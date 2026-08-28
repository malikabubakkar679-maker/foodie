import React from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodCard } from '@/components/food/FoodCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds, clearFavorites } = useWishlistStore();
  const { products } = useFoodStore();

  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 w-full max-w-7xl mx-auto select-none"
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between gap-3">
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
            <h1 className="text-2xl sm:text-4xl font-black text-foodie-charcoal tracking-tight flex items-center gap-2">
              <span>My Wishlist</span>
              <span className="text-foodie-red">❤️</span>
            </h1>
            <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
              Your saved favorite dishes for instant 1-tap ordering
            </p>
          </div>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            onClick={clearFavorites}
            className="px-3.5 py-1.5 rounded-xl bg-white/80 border border-foodie-border hover:border-foodie-red/40 text-foodie-muted hover:text-foodie-red text-xs font-black transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-sm">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 bg-red-50 text-foodie-red rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner border border-red-100"
          >
            ❤️
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-black text-foodie-charcoal">Your Wishlist is Empty</h3>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-md mx-auto leading-relaxed">
            Tap the heart icon on any pizza, burger, or dessert to keep your favorite meals saved here for fast reordering.
          </p>
          <Button onClick={() => navigate('/')} className="mt-4 px-8 py-3.5 text-sm font-black shadow-lg">
            Explore Menu 🍕
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {favoriteProducts.map((p) => (
            <FoodCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

