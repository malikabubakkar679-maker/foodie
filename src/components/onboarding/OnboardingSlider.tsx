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
    tag: '🍕 ARTISAN PIZZAS',
    heading: 'Your Favorite Food, One Tap Away',
    description: 'Crispy stone-baked dough, fresh buffalo mozzarella, and fragrant Italian herbs handcrafted for you.',
    image: pizzaPng,
    bgGradient: 'from-[#FFA000] via-[#FFB300] to-[#FFC107]',
    imgClass: 'max-h-[44vh] sm:max-h-[48vh] w-auto scale-105 sm:scale-110 drop-shadow-[0_25px_40px_rgba(0,0,0,0.28)]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
  },
  {
    id: 'burger-page',
    tag: '🍔 SMASH BURGERS',
    heading: 'Cravings Made Simple & Delicious',
    description: '100% prime angus beef patties, double melted aged cheddar, caramelized onions, and gourmet secret sauce.',
    image: burgerPng,
    bgGradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]',
    imgClass: 'max-h-[42vh] sm:max-h-[46vh] w-auto scale-105 sm:scale-110 drop-shadow-[0_25px_40px_rgba(0,0,0,0.28)]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
  },
  {
    id: 'delivery-page',
    tag: '🛵 LIGHTNING FAST DELIVERY',
    heading: 'Hot & Fresh Delivery Right to Your Door',
    description: 'Piping hot meals delivered in insulated temperature bags in under 30 minutes with live GPS courier tracking.',
    image: deliveryPng,
    bgGradient: 'from-[#F59E0B] via-[#FFC107] to-[#FFE082]',
    imgClass: 'max-h-[42vh] sm:max-h-[46vh] w-auto scale-105 sm:scale-110 drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)]',
    textColor: 'text-zinc-950',
    subTextColor: 'text-zinc-900/90',
    tagBg: 'bg-white/95 text-amber-950 border-white/70 shadow-sm',
    btnBg: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-2xl',
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

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const currentPage = ONBOARDING_PAGES[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full select-none overflow-hidden flex flex-col justify-between">
      {/* FULL SCREEN BACKGROUND GRADIENT */}
      <motion.div
        key={currentPage.id + '-bg'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 w-full h-full bg-gradient-to-b ${currentPage.bgGradient} z-0`}
      />

      {/* TOP HEADER CONTROLS (DESIGNER FROSTED GLASS CAPSULES) */}
      <div className="relative z-30 flex items-center justify-between p-5 sm:p-7 pt-6 max-w-lg sm:max-w-xl mx-auto w-full">
        {/* Designer Foodie Brand Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/70 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-foodie-yellow to-foodie-orange flex items-center justify-center text-lg shadow-sm">
            🍔
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-black tracking-tight text-foodie-charcoal">
              Foodie
            </span>
            <span className="text-lg font-black text-foodie-orange leading-none">.</span>
          </div>
        </motion.div>

        {/* Designer Skip Button */}
        <motion.button
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={onComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-zinc-950/80 hover:bg-zinc-950 backdrop-blur-xl border border-white/25 text-white text-xs sm:text-sm font-extrabold shadow-lg transition-all"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-foodie-yellow" />
        </motion.button>
      </div>

      {/* TOP/MIDDLE ARTWORK STAGE — LARGER & PROMINENT 3D VISUALS */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 overflow-hidden -my-2 sm:my-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage.id + '-img'}
            custom={direction}
            initial={{ opacity: 0, scale: 0.84, y: direction * 45 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: direction * -45 }}
            transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            className="w-full flex items-center justify-center"
          >
            <motion.img
              src={currentPage.image}
              alt={currentPage.heading}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1.2, 0, -1.2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`select-none ${currentPage.imgClass}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION — CLEAN TYPOGRAPHY DIRECTLY ON SCREEN */}
      <div className="relative z-20 p-6 pb-8 sm:pb-10 max-w-lg sm:max-w-xl mx-auto w-full flex flex-col items-center text-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage.id + '-content'}
            custom={direction}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            className="w-full space-y-3.5"
          >
            {/* Tag Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase backdrop-blur-xl shadow-md border ${currentPage.tagBg}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark" />
              <span>{currentPage.tag}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.18] ${currentPage.textColor}`}
            >
              {currentPage.heading}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.35 }}
              className={`text-xs sm:text-sm font-bold leading-relaxed max-w-md mx-auto px-2 ${currentPage.subTextColor}`}
            >
              {currentPage.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Controls Bar: Dots & CTA Button */}
        <div className="w-full pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
