import React from 'react';
import { Search, X, ArrowLeft, Sparkles, Flame, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodCard } from '@/components/food/FoodCard';
import { Button } from '@/components/ui/Button';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    getFilteredProducts,
    resetFilters,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useFoodStore();

  const products = getFilteredProducts();

  const CRAVINGS = [
    { label: 'Stone-Baked Pizza', icon: '🍕' },
    { label: 'Angus Burger', icon: '🍔' },
    { label: 'Crispy Wings', icon: '🍗' },
    { label: 'Truffle Fries', icon: '🍟' },
    { label: 'Garden Veggie', icon: '🌱' },
    { label: 'Spicy Diablo', icon: '🌶️' },
    { label: 'Choco Lava Cake', icon: '🍫' },
    { label: 'Berry Mojito', icon: '🍹' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 w-full max-w-7xl mx-auto select-none"
    >
      {/* Search Input Header with Back Button */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow shadow-xs transition-all shrink-0"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-foodie-charcoal tracking-tight">
              Find Your Next Feast 🔍
            </h1>
            <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
              Explore artisan pizzas, smash burgers, drinks, and special combos
            </p>
          </div>
        </div>

        {/* Enhanced Glassmorphic Search Bar */}
        <div className="relative group">
          <Search className="w-5 h-5 text-foodie-muted group-focus-within:text-foodie-amber-dark absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name, ingredients (e.g. Pepperoni, Truffle, Angus)..."
            className="w-full pl-12 sm:pl-14 pr-12 py-4 bg-white/90 backdrop-blur-2xl border border-white/90 focus:border-foodie-yellow rounded-2xl sm:rounded-3xl text-sm sm:text-base font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:ring-4 focus:ring-foodie-yellow/25 shadow-sm transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-foodie-app hover:bg-foodie-yellow text-foodie-charcoal transition-colors"
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
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === c.id
                ? 'bg-foodie-yellow border-foodie-yellow-dark text-foodie-charcoal shadow-sm scale-102'
                : 'bg-white/85 backdrop-blur-md border-white/90 text-foodie-muted hover:text-foodie-charcoal hover:bg-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Popular Cravings Grid */}
      {!searchQuery && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl p-4 sm:p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-foodie-amber-dark" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-foodie-charcoal">
              Popular Cravings & Trends
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {CRAVINGS.map((c) => (
              <motion.button
                key={c.label}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery(c.label)}
                className="px-3.5 sm:px-4 py-2 bg-foodie-app/90 hover:bg-foodie-yellow hover:text-foodie-charcoal border border-foodie-border/60 rounded-2xl text-xs sm:text-sm font-black text-foodie-charcoal transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs sm:text-sm font-black text-foodie-muted">
          Showing <strong className="text-foodie-charcoal">{products.length}</strong> delicious {products.length === 1 ? 'dish' : 'dishes'}
        </span>
        <button
          onClick={resetFilters}
          className="text-xs sm:text-sm font-black text-foodie-amber-dark hover:underline"
        >
          Reset Filters
        </button>
      </div>

      {/* Results Grid */}
      {products.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="text-6xl animate-bounce">🔍</div>
          <h4 className="text-xl font-black text-foodie-charcoal">No matching dishes found</h4>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-sm mx-auto leading-relaxed">
            Try searching for "Pizza", "Burger", "Chicken", "Mojito", or "Lava Cake".
          </p>
          <Button onClick={resetFilters} className="mt-2">
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((p) => (
            <FoodCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

