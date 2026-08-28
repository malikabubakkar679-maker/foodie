import React, { useEffect } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FoodGrid } from '@/components/home/FoodGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { FilterModal } from '@/components/home/FilterModal';
import { useFoodStore } from '@/store/useFoodStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';

export const HomePage: React.FC = () => {
  const fetchData = useFoodStore((s) => s.fetchData);
  const showToast = useNotificationStore((s) => s.showToast);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    fetchData();

    // Welcome Alert on First Load
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        showToast({
          type: 'welcome',
          title: 'Welcome to Foodie! 🎉',
          message: 'Enjoy 50% OFF your first order with code FOODIE50. Tap to claim!',
          icon: '🎁',
          actionLabel: 'Use Code',
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [fetchData, isAuthenticated, showToast]);

  return (
    <div className="space-y-4">
      {/* 1. Hero Greeting Headline & Delivery Location */}
      <HeroSection />

      {/* 2. Horizontally Scrollable Categories */}
      <CategoryBar />

      {/* 3. Direct Food Products Grid (Right below categories) */}
      <FoodGrid />

      {/* 4. Super Deal Promo Banner (Moved to the very bottom / last) */}
      <PromoBanner />

      {/* Filter Bottom Sheet / Modal */}
      <FilterModal />
    </div>
  );
};
