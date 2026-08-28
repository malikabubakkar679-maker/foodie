import React from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodCard } from '@/components/food/FoodCard';
import { Button } from '@/components/ui/Button';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, getFilteredProducts, resetFilters, categories, selectedCategory, setSelectedCategory } = useFoodStore();
  const products = getFilteredProducts();

  const CRAVINGS = ['Pepperoni', 'Angus Burger', 'Truffle', 'Spicy', 'Veg Supreme', 'Lava Cake', 'Mojito'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Input Header with Back Button */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white border border-foodie-border flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-soft shadow-xs transition-all shrink-0 active:scale-95"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal tracking-tight">
              Find Your Next Meal 🔍
            </h2>
            <p className="text-xs text-foodie-muted font-bold">Search pizzas, burgers, drinks, and combos</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-foodie-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type dish name, ingredient (e.g. Pepperoni, Truffle)..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-foodie-border rounded-2xl text-sm sm:text-base text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/20 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-foodie-muted hover:text-foodie-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === c.id
                ? 'bg-foodie-yellow border-foodie-yellow-dark text-foodie-charcoal font-black shadow-sm'
                : 'bg-white border-foodie-border text-foodie-muted hover:text-foodie-charcoal'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Popular Cravings */}
      {!searchQuery && (
        <div className="bg-foodie-app border border-foodie-border rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
            Popular Cravings
          </h4>
          <div className="flex flex-wrap gap-2">
            {CRAVINGS.map((c) => (
              <button
                key={c}
                onClick={() => setSearchQuery(c)}
                className="px-3 py-1.5 bg-white hover:bg-foodie-yellow-soft border border-foodie-border rounded-xl text-xs font-bold text-foodie-charcoal transition-colors"
              >
                🔥 {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-foodie-muted">
          Showing {products.length} delicious results
        </span>
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-foodie-amber-dark hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Results Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-foodie-border rounded-3xl p-12 text-center space-y-3">
          <div className="text-5xl">🔍</div>
          <h4 className="text-lg font-black text-foodie-charcoal">No matching dishes found</h4>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-sm mx-auto">
            Try searching for "Pizza", "Burger", "Chicken", or "Lava Cake".
          </p>
          <Button onClick={resetFilters} className="mt-2">
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p) => (
            <FoodCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
