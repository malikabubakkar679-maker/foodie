import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { OnboardingSlider } from '@/components/onboarding/OnboardingSlider';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { useAuthStore } from '@/store/useAuthStore';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const initializeSession = useAuthStore((s) => s.initializeSession);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // User requested: Onboarding screen should ALWAYS appear every time the app opens!
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showOnboarding) {
    return <OnboardingSlider onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};
