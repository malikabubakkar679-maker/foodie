import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section className="my-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950 p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        {/* Left Copy */}
        <div className="relative z-10 max-w-md space-y-3">
          <span className="inline-block px-3 py-1 bg-foodie-yellow text-foodie-charcoal text-[11px] font-black tracking-wider uppercase rounded-md">
            Exclusive Deal
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
            50% OFF
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300">
            On your first order! Use code <strong className="text-foodie-yellow font-black">FOODIE50</strong> at checkout.
          </p>
          <button
            onClick={handleClaim}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foodie-yellow text-foodie-charcoal text-xs sm:text-sm font-extrabold rounded-xl hover:bg-white transition-all shadow-md active:scale-95 mt-1"
          >
            <span>Claim Offer Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Food Art */}
        <div className="hidden sm:block relative w-44 h-44 lg:w-56 lg:h-56 shrink-0 rotate-12">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80"
            alt="Delicious Pizza Promo"
            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/10"
          />
        </div>
      </div>
    </section>
  );
};
