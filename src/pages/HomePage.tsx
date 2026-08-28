import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FoodGrid } from '@/components/home/FoodGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { FilterModal } from '@/components/home/FilterModal';
import { useFoodStore } from '@/store/useFoodStore';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

export const HomePage: React.FC = () => {
  const fetchData = useFoodStore((s) => s.fetchData);
  const totalCount = useCartStore((s) => s.getTotalItemsCount());
  const totalPrice = useCartStore((s) => s.getTotal());
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Hero Greeting Headline & 360° Rotating Artisan Pizza */}
      <HeroSection />

      {/* 2. Horizontally Scrollable Categories with Item Counts */}
      <CategoryBar />

      {/* 3. Direct Food Products Grid with 3D Hover Cards */}
      <FoodGrid />

      {/* 4. Super Deal Promo Banner */}
      <PromoBanner />

      {/* Filter Bottom Sheet / Modal */}
      <FilterModal />

      {/* 5. FLOATING ACTIVE CART QUICK BAR (Appears when cart has items) */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
          >
            <button
              onClick={openCartDrawer}
              className="w-full p-3.5 sm:p-4 rounded-3xl bg-foodie-charcoal text-white border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.35)] flex items-center justify-between group hover:bg-black transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-foodie-yellow flex items-center justify-center text-foodie-charcoal font-black shadow-foodie-glow">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-black block text-foodie-yellow">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'} in Cart
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 group-hover:bg-foodie-yellow group-hover:text-foodie-charcoal text-xs font-black transition-all">
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
