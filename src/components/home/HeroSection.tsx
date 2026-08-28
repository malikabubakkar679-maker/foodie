import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-6 sm:py-10 md:py-14 px-2 sm:px-4 md:px-6 overflow-hidden select-none">
      {/* FULL-BLEED 360° ROTATING PIZZA HERO BACKGROUND (Enlarged & Right-Anchored) */}
      <div className="absolute -right-16 sm:-right-10 md:right-0 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center">
        <div className="relative w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] lg:w-[620px] lg:h-[620px] flex items-center justify-center opacity-90 sm:opacity-95">
          
          {/* Ambient Warm Golden Backlight Glow */}
          <div className="absolute w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-foodie-yellow/45 via-amber-400/35 to-foodie-orange/25 blur-3xl pointer-events-none" />

          {/* Rotating Subtle Dashed Orbit Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-foodie-yellow/35 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 sm:inset-10 rounded-full border border-amber-300/25 pointer-events-none"
          />

          {/* Smooth Continuous 360° Rotating Transparent Pizza (Enlarged High-Res) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full p-2 flex items-center justify-center drop-shadow-[0_25px_45px_rgba(0,0,0,0.20)] will-change-transform"
          >
            <img
              src="/assets/hero-pizza.png"
              alt="Artisan Neapolitan Margherita Pizza"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* FOREGROUND HEADLINE & CONTENT (Full Width Left-to-Right Spread) */}
      <div className="relative z-10 max-w-xl md:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 pt-1">
        {/* Location Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-xs sm:text-sm font-bold shadow-2xs select-none"
        >
          <MapPin className="w-4 h-4 text-foodie-amber-dark" />
          <span className="text-foodie-muted">Deliver to:</span>
          <strong className="text-foodie-charcoal">Your Current Location</strong>
          <span className="w-2 h-2 rounded-full bg-foodie-green animate-pulse" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1], delay: 0.12 }}
          className="space-y-1.5"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foodie-charcoal tracking-tight leading-[1.10]">
            Good food is just a{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="relative inline-block text-foodie-amber-dark bg-gradient-to-r from-foodie-yellow-soft via-foodie-yellow-light to-foodie-yellow-soft px-3.5 py-0.5 rounded-2xl border border-foodie-yellow/30 shadow-2xs"
            >
              few taps away
            </motion.span>{' '}
            <motion.span
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              ✨
            </motion.span>
          </h1>
        </motion.div>

        {/* Detail Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1], delay: 0.2 }}
          className="text-xs sm:text-base md:text-[16px] font-bold text-foodie-charcoal/85 max-w-xl leading-relaxed pt-0.5"
        >
          Order handcrafted stone-baked pizzas, prime smash angus burgers, golden buttermilk tenders, and Italian desserts with live animated GPS delivery tracking under 30 minutes!
        </motion.p>
      </div>
    </section>
  );
};
