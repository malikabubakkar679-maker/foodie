import React from 'react';
import { ArrowRight, Sparkles, Flame, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export const PromoBanner: React.FC = () => {
  const { applyCoupon, openCartDrawer } = useCartStore();
  const showToast = useNotificationStore((s) => s.showToast);

  const handleClaim = () => {
    applyCoupon('FOODIE50');
    openCartDrawer();
    showToast({
      title: 'Coupon FOODIE50 Applied! 🎉',
      message: '50% discount has been applied to your cart subtotal.',
      type: 'deal',
      icon: '🏷️',
      actionLabel: 'Checkout',
    });
  };

  return (
    <section className="my-8 select-none">
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 p-7 sm:p-10 lg:p-12 text-white shadow-2xl flex items-center justify-between border border-amber-500/20"
      >
        {/* Ambient Backlight Radiance */}
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-foodie-yellow/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-foodie-orange/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-foodie-yellow to-foodie-orange text-foodie-charcoal text-xs font-black tracking-wider uppercase rounded-xl shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Limited Time Offer</span>
            </span>
            <span className="text-xs font-bold text-amber-300/90 hidden sm:inline">
              ✨ Free Express Delivery Included
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white flex items-center gap-3">
              <span>50% OFF</span>
              <span className="text-2xl sm:text-3xl text-foodie-yellow font-bold">FEAST</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-md font-medium leading-relaxed pt-1">
              Apply code <strong className="text-foodie-yellow bg-foodie-yellow/10 px-2 py-0.5 rounded-lg border border-foodie-yellow/30 font-black">FOODIE50</strong> at checkout for instant half-price discount!
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClaim}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-foodie-yellow text-foodie-charcoal text-sm sm:text-base font-black rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95 mt-2"
          >
            <span>Claim 50% Coupon Now</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Right Art Banner */}
        <div className="hidden md:flex relative w-48 h-48 lg:w-64 lg:h-64 shrink-0 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full p-2 flex items-center justify-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <img
              src="/assets/hero-pizza.png"
              alt="Delicious Food Promo"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

