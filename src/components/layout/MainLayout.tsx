import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { PullToRefresh } from './PullToRefresh';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FoodDetailModal } from '@/components/food/FoodDetailModal';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { LiveTrackingModal } from '@/components/orders/LiveTrackingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { NotificationDetailModal } from '@/components/notifications/NotificationDetailModal';
import { FloatingToastContainer } from '@/components/notifications/FloatingToastContainer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-foodie-cream relative">
      {/* Top-to-Bottom Animated Live Notification Toasts */}
      <FloatingToastContainer />

      {/* Main Scrollable App Flow with Pull-to-Refresh */}
      <PullToRefresh>
        <div className="flex flex-col min-h-screen">
          {/* Top Header */}
          <Header />

          {/* Main Content View with bottom padding for bottom nav */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-28">
            <Outlet />
          </main>

          {/* Desktop Footer */}
          <Footer />
        </div>
      </PullToRefresh>

      {/* Fixed Bottom Navigation Dock (Firmly fixed on all screen sizes) */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <FoodDetailModal />
      <CheckoutModal />
      <LiveTrackingModal />
      <AuthModal />
      <NotificationPanel />
      <NotificationDetailModal />
    </div>
  );
};
