import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);
  const favoritesCount = useWishlistStore((s) => s.getFavoritesCount());

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, badge: favoritesCount },
    { to: '#cart', label: 'Cart', icon: ShoppingBag, isCart: true, badge: totalCartCount },
    { to: '/chat', label: 'Support', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-[999] bg-white/85 backdrop-blur-2xl border-t border-white/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-2 px-3 safe-area-pb select-none transition-all"
    >
      <div className="max-w-md md:max-w-lg mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isCart && location.pathname === item.to;

          if (item.isCart) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={openCartDrawer}
                className="relative flex flex-col items-center justify-center py-1 px-3 text-foodie-muted hover:text-foodie-charcoal transition-all active:scale-95 group"
                aria-label="Open Shopping Cart"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform text-foodie-charcoal" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-foodie-orange text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-xs animate-scale-in">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-black mt-0.5 group-hover:text-foodie-charcoal transition-colors">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-3.5 transition-all active:scale-95 ${
                  isActive ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-pill"
                      className="absolute inset-0 bg-foodie-yellow/30 rounded-2xl -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive
                          ? 'scale-110 text-foodie-amber-dark stroke-[2.5]'
                          : 'stroke-[1.75]'
                      }`}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-foodie-yellow text-foodie-charcoal text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight transition-colors ${
                      isActive ? 'font-black text-foodie-charcoal' : 'font-bold text-foodie-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
