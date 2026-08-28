import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Flame, Clock, Tag, ArrowRight } from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { formatCurrency } from '@/lib/utils';

interface AnimatedSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAST_SUGGESTIONS = [
  { label: 'Pepperoni Feast', icon: Flame, tag: 'pizza' },
  { label: 'Smash Angus Burger', icon: Sparkles, tag: 'burgers' },
  { label: 'Truffle Fettuccine', icon: Sparkles, tag: 'pasta' },
  { label: 'Under 15 Mins', icon: Clock, tag: 'fast' },
  { label: '50% OFF Deals', icon: Tag, tag: 'deals' },
  { label: 'Vegetarian Supreme', icon: Sparkles, tag: 'veg' },
];

export const AnimatedSearchOverlay: React.FC<AnimatedSearchOverlayProps> = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery, getFilteredProducts, openDetailModal } = useFoodStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = getFilteredProducts();

  const handleSelectProduct = (p: any) => {
    onClose();
    openDetailModal(p);
  };

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20">
        {/* FROSTED GLASS BLURRED BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xl"
        />

        {/* FLOATING GLASS SEARCH CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative z-10 w-full max-w-2xl bg-white/85 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        >
          {/* SEARCH INPUT BAR */}
          <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-foodie-border/60 bg-white/60">
            <Search className="w-5 h-5 text-foodie-amber-dark shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, toppings, burgers, pizzas..."
              className="flex-1 bg-transparent text-sm sm:text-base font-bold text-foodie-charcoal placeholder:text-foodie-muted focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-foodie-muted hover:text-foodie-charcoal hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-foodie-charcoal text-white text-xs font-black hover:bg-black transition-colors"
            >
              Esc
            </button>
          </div>

          {/* FAST SUGGESTIONS CHIPS */}
          <div className="p-4 bg-foodie-yellow-soft/50 border-b border-foodie-border/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-black text-foodie-muted uppercase shrink-0">Fast:</span>
            {FAST_SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => handleSuggestionClick(s.label.split(' ')[0])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-foodie-yellow text-foodie-charcoal text-xs font-bold shrink-0 border border-white/60 shadow-sm transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-foodie-amber-dark" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* SEARCH RESULTS LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <span className="text-4xl">🍕</span>
                <h4 className="text-base font-black text-foodie-charcoal">No matching dishes found</h4>
                <p className="text-xs text-foodie-muted">Try searching for "Pizza", "Burger", or "Pasta"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/75 hover:bg-white border border-white/80 hover:border-foodie-yellow shadow-sm hover:shadow-md cursor-pointer transition-all group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs sm:text-sm font-black text-foodie-charcoal truncate block">
                          {product.name}
                        </strong>
                        {product.isPopular && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-foodie-yellow text-foodie-charcoal shrink-0">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-foodie-muted truncate mt-0.5">{product.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-foodie-amber-dark">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="text-[11px] text-foodie-muted flex items-center gap-1">
                          ⭐ {product.rating}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foodie-muted group-hover:text-foodie-charcoal group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
