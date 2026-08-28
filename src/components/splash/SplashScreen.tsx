import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import splashBgImg from '@/assets/foodie-splash-logo.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onComplete, 350);
  };

  useEffect(() => {
    // Snappy loading time for fast startup
    const timer = setTimeout(handleFinish, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={handleFinish}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between select-none overflow-hidden bg-[#e9a924] cursor-pointer"
        >
          {/* Full Screen Image Artwork */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img
              src={splashBgImg}
              alt="Foodie Splash Screen"
              className="w-full h-full object-cover sm:object-contain"
            />
          </div>

          {/* Top spacer */}
          <div className="relative z-10 pt-12"></div>

          {/* Bottom Loading Dots Floating Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative z-10 pb-14 sm:pb-18 flex flex-col items-center gap-3"
          >
            {/* 4 Animated Sequential Bouncing Dots */}
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    scale: [0.4, 1.4, 0.4],
                    opacity: [0.35, 1, 0.35],
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  }}
                  className="w-3 h-3 bg-white rounded-full shadow-md"
                />
              ))}
            </div>
            <span className="text-[11px] font-black text-white drop-shadow tracking-wider uppercase">
              Loading Delicious Food...
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
