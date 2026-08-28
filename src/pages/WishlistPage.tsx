import React from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodCard } from '@/components/food/FoodCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds } = useWishlistStore();
  const { products } = useFoodStore();

  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Back Button */}
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
            My Wishlist ❤️
          </h2>
          <p className="text-xs sm:text-sm text-foodie-muted mt-0.5">
            Your saved favorite dishes for fast 1-tap reordering
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-foodie-border rounded-3xl p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-red-50 text-foodie-red rounded-full flex items-center justify-center text-4xl mx-auto">
            ❤️
          </div>
          <h3 className="text-xl font-black text-foodie-charcoal">Your Wishlist is Empty</h3>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-sm mx-auto leading-relaxed">
            Tap the heart icon on any pizza, burger, or dessert to save it here for later.
          </p>
          <Button onClick={() => navigate('/')} className="mt-2">
            Explore Menu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favoriteProducts.map((p) => (
            <FoodCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
