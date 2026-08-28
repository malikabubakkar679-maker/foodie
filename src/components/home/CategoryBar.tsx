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
  const { categories, selectedCategory, setSelectedCategory } = useFoodStore();

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-foodie-charcoal tracking-tight">
          Explore Categories
        </h3>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none select-none">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Flame;
          const isSelected = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border transition-all shrink-0 min-w-[85px] shadow-sm',
                isSelected
                  ? 'bg-foodie-yellow border-foodie-yellow-dark shadow-foodie-glow -translate-y-0.5'
                  : 'bg-white border-foodie-border hover:border-foodie-yellow/60 hover:bg-foodie-yellow-soft/50'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  isSelected ? 'bg-white text-foodie-charcoal shadow-sm' : 'bg-foodie-app text-foodie-muted'
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-foodie-charcoal whitespace-nowrap">
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
