import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-1 sm:py-3 overflow-hidden">
      {/* 360° ROTATING PIZZA HERO BACKGROUND (Anchored to Right Side) */}
      <div className="absolute -right-14 sm:-right-8 md:-right-2 lg:right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center">
        <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] flex items-center justify-center opacity-90 sm:opacity-95">
          
          {/* Ambient Warm Golden Backlight Glow */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-foodie-yellow/45 via-amber-400/35 to-foodie-orange/25 blur-3xl pointer-events-none" />

          {/* Rotating Subtle Dashed Orbit Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-foodie-yellow/40 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-5 rounded-full border border-amber-300/25 pointer-events-none"
          />

          {/* Smooth 360° Rotating Transparent Pizza */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full p-2 flex items-center justify-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] will-change-transform"
          >
            <img
              src="/assets/hero-pizza.png"
              alt="Artisan Neapolitan Margherita Pizza"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* FOREGROUND HEADLINE & CONTENT (Top Snug & Seamlessly Integrated) */}
      <div className="relative z-10 max-w-xl md:max-w-2xl space-y-2.5 sm:space-y-3.5 pt-1">
        {/* Location Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-xs font-bold shadow-2xs select-none"
        >
          <MapPin className="w-3.5 h-3.5 text-foodie-amber-dark" />
          <span className="text-foodie-muted">Deliver to:</span>
          <strong className="text-foodie-charcoal">Your Current Location</strong>
          <span className="w-2 h-2 rounded-full bg-foodie-green animate-pulse" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1], delay: 0.12 }}
          className="space-y-1"
        >
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foodie-charcoal tracking-tight leading-[1.12]">
            Good food is just a{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="relative inline-block text-foodie-amber-dark bg-gradient-to-r from-foodie-yellow-soft via-foodie-yellow-light to-foodie-yellow-soft px-3 py-0.5 rounded-xl border border-foodie-yellow/30 shadow-2xs"
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
          className="text-xs sm:text-sm md:text-[15px] font-bold text-foodie-charcoal/85 max-w-lg leading-relaxed pt-0.5"
        >
          Order authentic Italian stone-baked pizza, artisanal smash burgers, golden crispy tenders, and desserts with live GPS courier tracking in under 30 mins!
        </motion.p>
      </div>
    </section>
  );
};
