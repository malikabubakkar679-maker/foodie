import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Flame, Clock, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-6 sm:py-10 md:py-12 px-2 sm:px-4 md:px-6 overflow-hidden select-none">
      {/* 360° ROTATING ARTISAN PIZZA HERO BACKGROUND */}
      <div className="absolute -right-16 sm:-right-8 md:right-0 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center">
        <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] flex items-center justify-center opacity-90 sm:opacity-95">
          
          {/* Ambient Warm Golden Backlight Glow */}
          <div className="absolute w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-foodie-yellow/40 via-amber-400/30 to-foodie-orange/20 blur-3xl pointer-events-none animate-pulse" />

          {/* Rotating Dashed Orbit Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-foodie-yellow/35 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 sm:inset-10 rounded-full border border-amber-300/25 pointer-events-none"
          />

          {/* Floating Feature Tags */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-4 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-lg text-[11px] font-black text-foodie-charcoal flex items-center gap-1.5 z-10"
          >
            <span className="text-amber-500">🔥</span>
            <span>Stone-Baked Daily</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-14 left-8 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-lg text-[11px] font-black text-foodie-charcoal flex items-center gap-1.5 z-10"
          >
            <Zap className="w-3.5 h-3.5 text-foodie-amber-dark" />
            <span>25-Min Fast GPS</span>
          </motion.div>

          {/* Smooth Continuous 360° Rotating Transparent Pizza */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full p-2 flex items-center justify-center drop-shadow-[0_25px_45px_rgba(0,0,0,0.18)] will-change-transform"
          >
            <img
              src="/assets/hero-pizza.png"
              alt="Artisan Neapolitan Margherita Pizza"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* FOREGROUND HEADLINE & CONTENT */}
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foodie-charcoal tracking-tight leading-[1.12]">
            Delicious food is just a{' '}
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
          className="text-xs sm:text-base md:text-[15px] font-bold text-foodie-charcoal/85 max-w-xl leading-relaxed pt-0.5"
        >
          Stone-baked pizzas, prime smash angus burgers, golden buttermilk tenders, and Italian desserts with live animated GPS delivery tracking under 30 minutes!
        </motion.p>

        {/* Quick Highlights Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 pt-2 flex-wrap"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-foodie-charcoal bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-foodie-red" />
            <span>Hot & Fresh</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-foodie-charcoal bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-foodie-amber-dark" />
            <span>25-30 Mins</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-foodie-charcoal bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-foodie-green" />
            <span>100% Quality</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
