import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  // Transform scroll position into interactive wheel rolling rotation
  const scrollRotate = useTransform(scrollY, [0, 1000], [0, 480]);
  const scrollX = useTransform(scrollY, [0, 600], [0, 70]);

  return (
    <section className="relative w-full py-8 sm:py-14 md:py-20 lg:py-24 px-4 sm:px-8 md:px-10 overflow-hidden select-none">
      {/* 360° GRAND ROLLING WHEEL ARTISAN PIZZA HERO BACKGROUND — MASSIVE & CRYSTAL CLEAR */}
      <div className="absolute -right-20 sm:-right-8 md:right-0 lg:right-6 xl:right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center">
        <div className="relative w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] md:w-[640px] md:h-[640px] lg:w-[760px] lg:h-[760px] xl:w-[840px] xl:h-[840px] flex items-center justify-center opacity-100">
          
          {/* Ambient Warm Golden Backlight Glow */}
          <div className="absolute w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[720px] lg:h-[720px] rounded-full bg-gradient-to-tr from-foodie-yellow/45 via-amber-400/30 to-foodie-orange/25 blur-[80px] sm:blur-[110px] pointer-events-none" />

          {/* Rotating Dashed Orbit Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-foodie-yellow/30 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-10 sm:inset-14 rounded-full border border-amber-300/20 pointer-events-none"
          />

          {/* Rolling Wheel Entrance & Scroll-Responsive 360° Rotating Transparent Pizza */}
          <motion.div
            initial={{ opacity: 0, x: 280, rotate: 540, scale: 0.75 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={{
              x: { duration: 1.5, ease: [0.18, 0.9, 0.32, 1] },
              rotate: { duration: 1.5, ease: [0.18, 0.9, 0.32, 1] },
              scale: { duration: 1.3, ease: [0.18, 0.9, 0.32, 1] },
              opacity: { duration: 0.5 },
            }}
            style={{ rotate: scrollRotate, x: scrollX }}
            className="w-full h-full p-2 sm:p-4 flex items-center justify-center drop-shadow-[0_32px_65px_rgba(0,0,0,0.24)] will-change-transform"
          >
            {/* Smooth Continuous Ambient Rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
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
      </div>

      {/* FOREGROUND HEADLINE & CONTENT */}
      <div className="relative z-10 max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-4 sm:space-y-6 pt-1">
        {/* Location Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-white text-xs sm:text-sm font-bold shadow-sm select-none hover:shadow-md transition-shadow"
        >
          <MapPin className="w-4 h-4 text-foodie-amber-dark" />
          <span className="text-foodie-muted">Deliver to:</span>
          <strong className="text-foodie-charcoal">Your Current Location</strong>
          <span className="w-2 h-2 rounded-full bg-foodie-green animate-pulse" />
        </motion.div>

        {/* Main Grand Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1], delay: 0.12 }}
          className="space-y-2"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foodie-charcoal tracking-tight leading-[1.08]">
            Delicious food is just a{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="relative inline-block text-foodie-amber-dark bg-gradient-to-r from-foodie-yellow-soft via-foodie-yellow-light to-foodie-yellow-soft px-4 sm:px-6 py-1 rounded-2xl sm:rounded-3xl border border-foodie-yellow/40 shadow-xs"
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1], delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl font-bold text-foodie-charcoal/85 max-w-xl lg:max-w-2xl leading-relaxed pt-1"
        >
          Stone-baked pizzas, prime smash angus burgers, golden buttermilk tenders, and Italian desserts with live animated GPS delivery tracking under 30 minutes!
        </motion.p>
      </div>
    </section>
  );
};


