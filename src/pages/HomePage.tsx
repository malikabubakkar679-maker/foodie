import React, { useEffect } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FoodGrid } from '@/components/home/FoodGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { FilterModal } from '@/components/home/FilterModal';
import { useFoodStore } from '@/store/useFoodStore';

export const HomePage: React.FC = () => {
  const fetchData = useFoodStore((s) => s.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-3">
      {/* 1. Hero Greeting Headline & Rotating Pizza (Touching Header & Category) */}
      <HeroSection />

      {/* 2. Horizontally Scrollable Categories */}
      <CategoryBar />

      {/* 3. Direct Food Products Grid (Right below categories) */}
      <FoodGrid />

      {/* 4. Super Deal Promo Banner */}
      <PromoBanner />

      {/* Filter Bottom Sheet / Modal */}
      <FilterModal />
    </div>
  );
};
