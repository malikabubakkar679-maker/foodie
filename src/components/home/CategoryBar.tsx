import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Pizza,
  Sandwich,
  Drumstick,
  CookingPot,
  Soup,
  Coffee,
  Cake,
  Tag,
  LucideIcon,
} from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Pizza,
  Sandwich,
  Drumstick,
  CookingPot,
  Soup,
  Coffee,
  Cake,
  Tag,
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useFoodStore();

  return (
    <section className="py-2 sm:py-3">
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <h3 className="text-lg sm:text-xl font-extrabold text-foodie-charcoal tracking-tight flex items-center gap-2">
          <span>Explore Categories</span>
          <span className="text-base">🍕</span>
        </h3>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none select-none">
        {categories.map((cat, index) => {
          const IconComponent = ICON_MAP[cat.icon] || Flame;
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.categoryId === cat.id).length;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, type: 'spring', damping: 20, stiffness: 300 }}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl border transition-all shrink-0 min-w-[90px] shadow-2xs relative group',
                isSelected
                  ? 'bg-gradient-to-b from-foodie-yellow via-[#FFB800] to-foodie-amber-dark border-foodie-yellow-dark text-foodie-charcoal shadow-foodie-glow'
                  : 'bg-white/85 backdrop-blur-md border-white/90 hover:border-foodie-yellow/60 hover:bg-foodie-yellow-soft/50'
              )}
            >
              {/* Category Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  isSelected
                    ? 'bg-white text-foodie-charcoal shadow-sm scale-105'
                    : 'bg-foodie-app text-foodie-muted group-hover:text-foodie-charcoal group-hover:bg-white'
                )}
              >
                <IconComponent className={cn('w-5 h-5 transition-transform duration-200', isSelected && 'scale-110')} />
              </div>

              {/* Title & Count */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'text-xs whitespace-nowrap tracking-tight',
                    isSelected ? 'font-black text-foodie-charcoal' : 'font-bold text-foodie-charcoal/85'
                  )}
                >
                  {cat.name}
                </span>
                {count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-extrabold',
                      isSelected ? 'text-foodie-charcoal/80' : 'text-foodie-muted'
                    )}
                  >
                    {count} {count === 1 ? 'dish' : 'dishes'}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
