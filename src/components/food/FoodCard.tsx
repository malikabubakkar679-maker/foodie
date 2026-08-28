import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Plus, Check, Clock, Flame } from 'lucide-react';
import { Product } from '@/types/food.types';
import { formatCurrency, cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useFoodStore } from '@/store/useFoodStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface FoodCardProps {
  product: Product;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product }) => {
  const { toggleFavorite, isFavorite } = useWishlistStore();
  const quickAdd = useCartStore((s) => s.quickAdd);
  const openDetailModal = useFoodStore((s) => s.openDetailModal);
  const showToast = useNotificationStore((s) => s.showToast);
  const isFav = isFavorite(product.id);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(product.id);
    if (added) {
      showToast({
        title: 'Added to Wishlist! ❤️',
        message: `${product.name} saved to your favorites.`,
        type: 'deal',
        icon: '❤️',
      });
    } else {
      showToast({
        title: 'Removed from Wishlist',
        message: `${product.name} removed from your favorites.`,
        type: 'deal',
        icon: '🤍',
      });
    }
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    quickAdd(product);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 900);

    showToast({
      title: 'Added to Cart! 🛒',
      message: `1× ${product.name} (${formatCurrency(product.basePrice)}) added.`,
      type: 'deal',
      icon: '🍔',
      actionLabel: 'View Cart',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => openDetailModal(product)}
      className="group relative bg-white/80 backdrop-blur-xl border border-white/90 hover:border-foodie-yellow/90 rounded-3xl p-3 sm:p-4 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer overflow-hidden select-none"
    >
      {/* Top Floating Badges & Favorite Button */}
      <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-2.5 bg-gradient-to-b from-white/40 to-foodie-yellow-soft/30 flex items-center justify-center">
        {/* Crisp Food Image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-300 drop-shadow-md"
        />

        {/* Floating Heart Button */}
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs text-foodie-charcoal hover:text-foodie-red transition-colors z-10"
          aria-label="Favorite"
        >
          <Heart className={cn('w-4 h-4 transition-colors', isFav && 'fill-foodie-red text-foodie-red')} />
        </motion.button>

        {/* Tag Pills */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isVeg && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50/95 backdrop-blur-md text-foodie-green text-[10px] font-black border border-emerald-200 shadow-2xs">
              🌱 Veg
            </span>
          )}
          {product.isPopular && !product.isVeg && (
            <span className="px-2 py-0.5 rounded-full bg-foodie-yellow/95 backdrop-blur-md text-foodie-charcoal text-[10px] font-black shadow-2xs">
              🔥 Popular
            </span>
          )}
          {product.isSpicy && (
            <span className="px-2 py-0.5 rounded-full bg-red-50/95 backdrop-blur-md text-foodie-red text-[10px] font-black border border-red-200 shadow-2xs">
              🌶️ Spicy
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-black text-foodie-charcoal line-clamp-1 group-hover:text-foodie-amber-dark transition-colors">
          {product.name}
        </h4>

        {/* Rating & Prep Time */}
        <div className="flex items-center gap-2 text-xs font-bold text-foodie-charcoal">
          <span className="flex items-center gap-1 text-foodie-amber-dark">
            <Star className="w-3.5 h-3.5 fill-foodie-yellow text-foodie-yellow" />
            <span>{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-foodie-muted text-[11px] font-semibold">• {product.prepTime} mins</span>
          {product.calories && (
            <span className="text-foodie-muted text-[11px] font-semibold hidden sm:inline">• {product.calories} cal</span>
          )}
        </div>
      </div>

      {/* Price & Quick Add Button */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-foodie-border/60">
        <span className="text-sm sm:text-base font-black text-foodie-charcoal">
          {formatCurrency(product.basePrice)}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleQuickAddClick}
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-xs transition-all',
            isJustAdded
              ? 'bg-emerald-500 text-white scale-105'
              : 'bg-foodie-yellow hover:bg-foodie-yellow-dark text-foodie-charcoal'
          )}
          aria-label="Add to cart"
        >
          {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.div>
  );
};
