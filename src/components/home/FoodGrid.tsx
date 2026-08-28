import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodCard } from '@/components/food/FoodCard';
import { useFoodStore } from '@/store/useFoodStore';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Flame, Leaf, Star, Clock, Filter, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FoodGrid: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCategory,
    categories,
    getFilteredProducts,
    resetFilters,
    filterVeg,
    setFilterVeg,
    filterSpicy,
    setFilterSpicy,
    openFilterModal,
  } = useFoodStore();

  const [activeTag, setActiveTag] = useState<'all' | 'popular' | 'veg' | 'spicy' | 'fast'>('all');
  const products = getFilteredProducts();

  // Sub-filter by active quick tag
  const displayedProducts = products.filter((p) => {
    if (activeTag === 'popular') return p.isPopular;
    if (activeTag === 'veg') return p.isVeg;
    if (activeTag === 'spicy') return p.isSpicy;
    if (activeTag === 'fast') return p.prepTime <= 12;
    return true;
  });

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const categoryTitle =
    selectedCategory === 'all'
      ? 'Chef Specials & Hot Dishes 🔥'
      : `${currentCategory ? currentCategory.name : selectedCategory} Feast`;

  return (
    <section className="py-4 select-none" id="foods-grid">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-foodie-charcoal tracking-tight flex items-center gap-2">
              <span>{categoryTitle}</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-foodie-yellow-soft border border-foodie-yellow/40 text-foodie-amber-dark">
                {displayedProducts.length} items
              </span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
            Handcrafted with freshest artisan ingredients & express 25-min delivery
          </p>
        </div>

        {/* Filter Modal Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={openFilterModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-foodie-border text-foodie-charcoal text-xs font-black shadow-2xs hover:bg-foodie-yellow-soft transition-all active:scale-95"
          >
            <Filter className="w-3.5 h-3.5 text-foodie-amber-dark" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1 text-xs sm:text-sm font-black text-foodie-amber-dark hover:text-foodie-charcoal transition-colors px-2 py-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK FLOATING TAGS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Items', icon: '✨' },
          { id: 'popular', label: '🔥 Most Popular', icon: '🔥' },
          { id: 'veg', label: '🌱 100% Vegetarian', icon: '🌱' },
          { id: 'spicy', label: '🌶️ Spicy & Fiery', icon: '🌶️' },
          { id: 'fast', label: '⏱️ Under 12 Mins', icon: '⏱️' },
        ].map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveTag(tag.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap shrink-0 shadow-2xs active:scale-95',
              activeTag === tag.id
                ? 'bg-foodie-charcoal text-white border-foodie-charcoal shadow-sm'
                : 'bg-white/80 hover:bg-white text-foodie-charcoal border-foodie-border hover:border-foodie-yellow/60'
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayedProducts.length === 0 ? (
        <div className="bg-white border border-foodie-border rounded-3xl p-10 text-center space-y-3 shadow-xs">
          <div className="text-5xl">🍔</div>
          <h4 className="text-lg font-black text-foodie-charcoal">No dishes match this tag</h4>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-sm mx-auto">
            Try choosing "All Items" or reset your category filters to view more delicious food!
          </p>
          <button
            onClick={() => {
              setActiveTag('all');
              resetFilters();
            }}
            className="px-5 py-2.5 bg-foodie-yellow font-black text-xs sm:text-sm rounded-2xl hover:bg-foodie-yellow-dark transition-colors inline-block mt-2 shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayedProducts.map((product) => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
