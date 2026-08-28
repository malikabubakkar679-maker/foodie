import React from 'react';
import { FoodCard } from '@/components/food/FoodCard';
import { useFoodStore } from '@/store/useFoodStore';
import { useNavigate } from 'react-router-dom';

export const FoodGrid: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, categories, getFilteredProducts, resetFilters } = useFoodStore();
  const products = getFilteredProducts();

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const categoryTitle =
    selectedCategory === 'all'
      ? 'Popular Near You 🔥'
      : `${currentCategory ? currentCategory.name : selectedCategory} Menu`;

  return (
    <section className="py-6" id="foods-grid">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-foodie-charcoal tracking-tight">
            {categoryTitle}
          </h3>
          <p className="text-xs sm:text-sm text-foodie-muted mt-0.5">
            Handcrafted with freshest ingredients & fast delivery
          </p>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="text-xs sm:text-sm font-extrabold text-foodie-amber-dark hover:text-foodie-charcoal transition-colors shrink-0"
        >
          View All →
        </button>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-foodie-border rounded-3xl p-10 text-center space-y-3">
          <div className="text-5xl">🍔</div>
          <h4 className="text-lg font-black text-foodie-charcoal">No dishes match your filters</h4>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-sm mx-auto">
            Try adjusting your category selection, max price slider, or dietary preferences.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-foodie-yellow font-extrabold text-xs sm:text-sm rounded-xl hover:bg-foodie-yellow-dark transition-colors inline-block mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
