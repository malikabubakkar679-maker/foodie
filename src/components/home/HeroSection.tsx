import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  // Soft, smooth scroll-driven gentle rotation and translation
  const scrollRotate = useTransform(scrollY, [0, 800], [0, 240]);
  const scrollX = useTransform(scrollY, [0, 600], [0, 30]);

  return (
    <section className="relative w-full pt-4 pb-6 sm:pt-6 sm:pb-8 px-4 sm:px-6 md:px-8 overflow-hidden select-none flex flex-col items-center text-center">
      {/* 1. TOP: CLEAN & STYLISH MAIN HEADLINE */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-2.5 max-w-2xl mx-auto"
      >
        {/* Subtle Highlight Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-black tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Fresh & Handcrafted Daily</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foodie-charcoal tracking-tight leading-[1.12]">
          Delicious Food Is Just A{' '}
          <span className="relative inline-block text-amber-950 bg-gradient-to-r from-amber-200 via-foodie-yellow to-amber-300 px-3.5 sm:px-5 py-0.5 rounded-2xl border border-amber-300/60 shadow-xs">
            Few Taps Away
          </span>{' '}
          <motion.span
            animate={{ rotate: [0, 14, -8, 14, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            ✨
          </motion.span>
        </h1>
      </motion.div>

      {/* 2. MIDDLE: PROMINENT & CRYSTAL-CLEAR SLOW ROTATING PIZZA WHEEL ARTWORK */}
      <div className="relative my-4 sm:my-6 flex items-center justify-center">
        {/* Warm Golden Glow Backdrop */}
        <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-tr from-foodie-yellow/35 via-amber-400/20 to-orange-400/15 blur-[60px] pointer-events-none" />

        {/* Rotating Dashed Orbit Rings (Very Slow & Peaceful) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[410px] md:h-[410px] rounded-full border border-dashed border-foodie-yellow/40 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 95, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] rounded-full border border-amber-300/25 pointer-events-none"
        />

        {/* Pizza Artwork — Side Rolling Wheel Entrance & Scroll-Responsive 360° Rotating Transparent Pizza */}
        <motion.div
          initial={{ opacity: 0, x: 280, rotate: 600, scale: 0.82 }}
          animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
          transition={{
            x: { duration: 2.0, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 2.0, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.8, ease: 'easeOut' },
          }}
          style={{ rotate: scrollRotate, x: scrollX }}
          className="relative z-10 w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] flex items-center justify-center drop-shadow-[0_28px_50px_rgba(0,0,0,0.24)] will-change-transform"
        >
          {/* Extremely Smooth & Slow Continuous Spin */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src="/assets/hero-pizza.png"
              alt="Artisan Neapolitan Margherita Pizza"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 3. BOTTOM: CLEAN DETAILS & QUICK BADGES */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-3.5 max-w-xl mx-auto"
      >
        <p className="text-sm sm:text-base font-bold text-foodie-charcoal/80 leading-relaxed max-w-lg mx-auto">
          Stone-baked artisan pizzas, prime smash angus burgers, and Italian desserts delivered fresh in under 30 minutes!
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-800 text-xs font-black shadow-xs">
            🍕 Stone-Baked Crust
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-800 text-xs font-black shadow-xs">
            ⚡ Under 30-Min Delivery
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-800 text-xs font-black shadow-xs">
            ⭐ 4.9 Top Rated
          </span>
        </div>
      </motion.div>
    </section>
  );
};
