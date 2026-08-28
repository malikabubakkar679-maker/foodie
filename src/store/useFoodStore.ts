import { create } from 'zustand';
import { FoodCategory, Product } from '@/types/food.types';
import { foodService } from '@/services/foodService';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/data/initialData';

const PRODUCTS_DB_KEY = 'foodie_custom_products_db';

const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load local products:', e);
  }
  return INITIAL_PRODUCTS;
};

const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save local products:', e);
  }
};

interface FoodState {
  categories: FoodCategory[];
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  filterVeg: boolean;
  filterSpicy: boolean;
  filterMaxPrice: number;
  filterMinRating: number;
  isFilterModalOpen: boolean;
  selectedDetailProduct: Product | null;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedCategory: (catId: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterVeg: (val: boolean) => void;
  setFilterSpicy: (val: boolean) => void;
  setFilterMaxPrice: (val: number) => void;
  setFilterMinRating: (val: number) => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  openDetailModal: (product: Product) => void;
  closeDetailModal: () => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
}

export const useFoodStore = create<FoodState>((set, get) => ({
  categories: INITIAL_CATEGORIES,
  products: getStoredProducts(),
  selectedCategory: 'all',
  searchQuery: '',
  filterVeg: false,
  filterSpicy: false,
  filterMaxPrice: 35,
  filterMinRating: 0,
  isFilterModalOpen: false,
  selectedDetailProduct: null,
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const cats = await foodService.getCategories();
      const localProds = getStoredProducts();
      set({ categories: cats, products: localProds, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addProduct: (newProduct) => {
    const updated = [newProduct, ...get().products];
    set({ products: updated });
    saveStoredProducts(updated);
  },

  updateProduct: (id, data) => {
    const updated = get().products.map((p) => (p.id === id ? { ...p, ...data } : p));
    set({ products: updated });
    saveStoredProducts(updated);
  },

  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    set({ products: updated });
    saveStoredProducts(updated);
  },

  setSelectedCategory: (catId) => set({ selectedCategory: catId }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterVeg: (val) => set({ filterVeg: val }),
  setFilterSpicy: (val) => set({ filterSpicy: val }),
  setFilterMaxPrice: (val) => set({ filterMaxPrice: val }),
  setFilterMinRating: (val) => set({ filterMinRating: val }),
  openFilterModal: () => set({ isFilterModalOpen: true }),
  closeFilterModal: () => set({ isFilterModalOpen: false }),
  openDetailModal: (product) => set({ selectedDetailProduct: product }),
  closeDetailModal: () => set({ selectedDetailProduct: null }),

  resetFilters: () =>
    set({
      selectedCategory: 'all',
      searchQuery: '',
      filterVeg: false,
      filterSpicy: false,
      filterMaxPrice: 35,
      filterMinRating: 0,
    }),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery, filterVeg, filterSpicy, filterMaxPrice, filterMinRating } = get();

    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchIng = p.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchIng) return false;
      }
      if (filterVeg && !p.isVeg) return false;
      if (filterSpicy && !p.isSpicy) return false;
      if (p.basePrice > filterMaxPrice) return false;
      if (p.rating < filterMinRating) return false;
      return true;
    });
  },
}));
