import { supabase, isLiveSupabaseConfigured } from './supabaseClient';
import { FoodCategory, Product } from '@/types/food.types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/data/initialData';

export const foodService = {
  async getCategories(): Promise<FoodCategory[]> {
    if (isLiveSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length > 0) {
          return (data as any[]).map((c) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            image: c.image,
          }));
        }
      } catch (err) {
        console.warn('Categories Supabase fetch fallback:', err);
      }
    }
    return INITIAL_CATEGORIES;
  },

  async getProducts(): Promise<Product[]> {
    if (isLiveSupabaseConfigured) {
      try {
        const { data: productsData, error } = await supabase.from('products').select('*');
        if (!error && productsData && productsData.length > 0) {
          const { data: sizesData } = await supabase.from('product_sizes').select('*');
          
          return (productsData as any[]).map((p) => {
            const productSizes = ((sizesData as any[]) || []).filter((s) => s.product_id === p.id);
            return {
              id: p.id,
              categoryId: p.category_id,
              name: p.name,
              description: p.description,
              basePrice: Number(p.rating || 12.99),
              rating: Number(p.rating || 4.8),
              reviewsCount: p.reviews_count || 100,
              prepTime: p.prep_time || 15,
              calories: p.calories || 300,
              ingredients: ['Tomato Sauce', 'Mozzarella', 'Special Seasoning'],
              isVeg: Boolean(p.is_veg),
              isSpicy: Boolean(p.is_spicy),
              isPopular: Boolean(p.is_popular),
              imageUrl: p.image_url,
              sizes: productSizes.length > 0
                ? productSizes.map((s) => ({
                    id: s.size,
                    name: s.size.charAt(0).toUpperCase() + s.size.slice(1),
                    inches: s.inches,
                    extraPrice: Number(s.extra_price || 0),
                    imageUrl: s.image_url,
                  }))
                : [
                    { id: 'small' as const, name: 'Small', inches: '10" (6 slices)', extraPrice: 0.0 },
                    { id: 'medium' as const, name: 'Medium', inches: '12" (8 slices)', extraPrice: 3.50 },
                    { id: 'large' as const, name: 'Large', inches: '14" (10 slices)', extraPrice: 6.00 },
                  ],
            };
          });
        }
      } catch (err) {
        console.warn('Products Supabase fetch fallback:', err);
      }
    }
    return INITIAL_PRODUCTS;
  },
};
