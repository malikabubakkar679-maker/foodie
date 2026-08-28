import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, FastForward } from 'lucide-react';
import pizzaPng from '@/assets/onboarding-pizza.png';
import burgerPng from '@/assets/onboarding-burger.png';
import deliveryPng from '@/assets/onboarding-delivery.png';

interface OnboardingSliderProps {
  onComplete: () => void;
}

const ONBOARDING_PAGES = [
  {
    id: 'pizza-page',
    tag: '🍕 ARTISAN STONE-BAKED PIZZAS',
    heading: 'Your Favorite Food, One Tap Away',
    description: 'Crispy stone-baked dough, fresh buffalo mozzarella, and fragrant Italian herbs handcrafted fresh for you.',
    image: pizzaPng,
    bgGradient: 'from-[#FFA000] via-[#FFB300] to-[#FFC107]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
    accentBadge: '🔥 100% Buffalo Mozzarella',
    imgClass: 'max-h-[48vh] sm:max-h-[54vh] w-full max-w-[320px] sm:max-w-[390px] drop-shadow-[0_28px_45px_rgba(0,0,0,0.28)]',
    animationType: 'pizza-wheel',
  },
  {
    id: 'burger-page',
    tag: '🍔 SMASH ANGUS BURGERS',
    heading: 'Cravings Made Simple & Delicious',
    description: '100% prime angus beef smashed patties, double melted aged cheddar, caramelized onions, and secret sauce on buttered brioche.',
    image: burgerPng,
    bgGradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
    accentBadge: '⭐ Double Melted Cheddar',
    imgClass: 'max-h-[46vh] sm:max-h-[52vh] w-full max-w-[330px] sm:max-w-[400px] drop-shadow-[0_28px_45px_rgba(0,0,0,0.25)]',
    animationType: 'burger-float',
  },
  {
    id: 'delivery-page',
    tag: '🛵 LIGHTNING FAST GPS DELIVERY',
    heading: 'Hot & Fresh Delivery Right to Your Door',
    description: 'Piping hot meals delivered in insulated temperature bags under 30 minutes with live GPS courier tracking.',
    image: deliveryPng,
    bgGradient: 'from-[#F59E0B] via-[#FFC107] to-[#FFE082]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
    accentBadge: '⚡ Under 25-Min Guarantee',
    imgClass: 'max-h-[46vh] sm:max-h-[52vh] w-full max-w-[330px] sm:max-w-[400px] drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]',
    animationType: 'delivery-drive',
  },
];

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_PAGES.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const currentPage = ONBOARDING_PAGES[currentIndex];

  // 1. Slow, buttery-smooth rolling wheel entrance variant exclusively for Pizza
  const pizzaWheelVariants = {
    initial: (customDir: number) => ({
      opacity: 0,
      x: customDir > 0 ? '110vw' : '-110vw',
      rotate: customDir > 0 ? 540 : -540,
      scale: 0.8,
    }),
    animate: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        x: { duration: 1.4, ease: [0.18, 0.9, 0.32, 1] },
        rotate: { duration: 1.4, ease: [0.18, 0.9, 0.32, 1] },
        scale: { duration: 1.2, ease: [0.18, 0.9, 0.32, 1] },
        opacity: { duration: 0.5 },
      },
    },
    exit: (customDir: number) => ({
      opacity: 0,
      x: customDir > 0 ? '-100vw' : '100vw',
      rotate: customDir > 0 ? -480 : 480,
      scale: 0.8,
      transition: {
        x: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
        rotate: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.6 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  // 2. Classic sliding animation for Burger and Delivery (NO wheel rotation)
  const standardSlideVariants = {
    initial: (customDir: number) => ({
      opacity: 0,
      x: customDir > 0 ? '60vw' : '-60vw',
      rotate: 0,
      scale: 0.88,
    }),
    animate: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        x: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.4 },
      },
    },
    exit: (customDir: number) => ({
      opacity: 0,
      x: customDir > 0 ? '-60vw' : '60vw',
      rotate: 0,
      scale: 0.88,
      transition: {
        x: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.4 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  // Select the appropriate variants based on current page
  const currentVariants = currentPage.animationType === 'pizza-wheel' ? pizzaWheelVariants : standardSlideVariants;

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full select-none overflow-hidden flex flex-col justify-between">
      {/* FULL SCREEN BACKGROUND GRADIENT */}
      <motion.div
        key={currentPage.id + '-bg'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`absolute inset-0 w-full h-full bg-gradient-to-b ${currentPage.bgGradient} z-0`}
      />

      {/* TOP HEADER CONTROLS */}
      <div className="relative z-30 flex items-center justify-between p-5 sm:p-7 pt-6 max-w-lg sm:max-w-xl mx-auto w-full">
        {/* Brand Logo - Clean bold italic text logo directly on background (white box removed) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-baseline py-1 cursor-default select-none"
        >
          <span className="font-black italic tracking-wide text-2xl sm:text-3xl text-zinc-950 font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-sm">
            Foodie
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-500 italic leading-none ml-0.5 drop-shadow-sm">.</span>
        </motion.div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={onComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-zinc-950/85 hover:bg-zinc-950 backdrop-blur-xl border border-white/25 text-white text-xs sm:text-sm font-extrabold shadow-lg transition-all active:scale-95"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-foodie-yellow" />
        </motion.button>
      </div>

      {/* MIDDLE ARTWORK STAGE — SLOW WHEEL ENTRANCE FOR PIZZA / CLASSIC SLIDE FOR BURGER & DELIVERY */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 overflow-hidden -my-1 sm:my-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage.id + '-img'}
            custom={direction}
            variants={currentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) handleNext();
              else if (info.offset.x > 40) handlePrev();
            }}
            className="relative w-full max-w-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* Ambient Shadow under food */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.28, 0.42, 0.28],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute bottom-3 w-48 sm:w-64 h-7 bg-black/35 rounded-[100%] blur-xl pointer-events-none"
            />

            {/* Floating Artwork with Specific Idle Behaviors */}
            {currentPage.animationType === 'pizza-wheel' && (
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-full flex items-center justify-center p-1"
              >
                <img
                  src={currentPage.image}
                  alt={currentPage.heading}
                  className={`select-none object-contain ${currentPage.imgClass}`}
                  draggable={false}
                />
              </motion.div>
            )}

            {currentPage.animationType === 'burger-float' && (
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.025, 1],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-full flex items-center justify-center p-1"
              >
                <img
                  src={currentPage.image}
                  alt={currentPage.heading}
                  className={`select-none object-contain ${currentPage.imgClass}`}
                  draggable={false}
                />
              </motion.div>
            )}

            {currentPage.animationType === 'delivery-drive' && (
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  x: [0, 3, 0, -3, 0],
                  rotate: [0, -1, 0, 1, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-full flex items-center justify-center p-1"
              >
                <img
                  src={currentPage.image}
                  alt={currentPage.heading}
                  className={`select-none object-contain ${currentPage.imgClass}`}
                  draggable={false}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION — CLEAN TYPOGRAPHY DIRECTLY ON SCREEN */}
      <div className="relative z-20 p-6 pb-8 sm:pb-10 max-w-lg sm:max-w-xl mx-auto w-full flex flex-col items-center text-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage.id + '-content'}
            custom={direction}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-3.5"
          >
            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.32 }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.16] ${currentPage.textColor}`}
            >
              {currentPage.heading}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.32 }}
              className={`text-xs sm:text-sm font-bold leading-relaxed max-w-md mx-auto px-2 ${currentPage.subTextColor}`}
            >
              {currentPage.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Controls Bar: Dots & CTA Button */}
        <div className="w-full pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination Dots */}
          <div className="flex items-center gap-2.5">
            {ONBOARDING_PAGES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-10 bg-zinc-950 shadow-md'
                      : 'w-2.5 bg-black/25 hover:bg-black/45'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleNext}
            className={`w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-black rounded-2xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-2xl ${currentPage.btnBg}`}
          >
            <span>
              {currentIndex === ONBOARDING_PAGES.length - 1 ? 'Start Ordering Now 🍔' : 'Next Step'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

