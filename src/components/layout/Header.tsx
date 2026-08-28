import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MessageSquare, ShoppingBag, User, Bell } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { AnimatedSearchOverlay } from '@/components/home/AnimatedSearchOverlay';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);
  const favoritesCount = useWishlistStore((s) => s.getFavoritesCount());
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const { togglePanel, getUnreadCount } = useNotificationStore();
  const unreadNotifCount = getUnreadCount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Pure Italic Text Logo */}
          <Link to="/" className="group select-none flex items-center py-1">
            <span className="font-black italic text-2xl sm:text-3xl tracking-tighter text-foodie-charcoal group-hover:opacity-90 transition-opacity">
              Foodie<span className="text-foodie-amber-dark not-italic">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/' ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
              }`}
            >
              Home
            </Link>
            <Link
              to="/wishlist"
              className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/wishlist' ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
              }`}
            >
              Wishlist
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-foodie-yellow rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/orders' ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
              }`}
            >
              My Orders
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/chat' ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
              }`}
            >
              Support Chat
            </Link>
            <Link
              to="/profile"
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/profile' ? 'text-foodie-charcoal font-black' : 'text-foodie-muted hover:text-foodie-charcoal'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Animated Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow hover:border-foodie-yellow transition-all shadow-sm active:scale-95"
              aria-label="Open animated search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell Trigger with Animated Badge */}
            <button
              onClick={togglePanel}
              className="relative w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow hover:border-foodie-yellow transition-all shadow-sm active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-foodie-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Support Chat Trigger (Desktop) */}
            <button
              onClick={() => navigate('/chat')}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow hover:border-foodie-yellow transition-all shadow-sm hidden sm:flex active:scale-95"
              aria-label="Live Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow hover:border-foodie-yellow transition-all shadow-sm active:scale-95"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-foodie-orange text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Sign In */}
            {isAuthenticated && user ? (
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-foodie-yellow hover:scale-105 transition-transform shrink-0 shadow-sm"
                aria-label="Profile"
              >
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-3.5 sm:px-4 py-2 text-xs font-black bg-foodie-yellow hover:bg-foodie-yellow-dark text-foodie-charcoal rounded-2xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Animated Floating Glassmorphic Search Overlay */}
      <AnimatedSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
