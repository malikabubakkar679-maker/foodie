import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';

    const variants = {
      primary: 'bg-foodie-yellow text-foodie-charcoal hover:bg-foodie-yellow-dark shadow-sm hover:shadow active:scale-[0.98]',
      secondary: 'bg-foodie-yellow-soft text-foodie-amber-dark hover:bg-foodie-yellow-light active:scale-[0.98]',
      outline: 'border border-foodie-border bg-white text-foodie-charcoal hover:bg-foodie-yellow-soft hover:border-foodie-yellow active:scale-[0.98]',
      ghost: 'bg-transparent text-foodie-muted hover:text-foodie-charcoal hover:bg-foodie-yellow-soft',
      danger: 'bg-white border border-red-200 text-foodie-red hover:bg-red-50 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-6 py-3.5 rounded-2xl',
      icon: 'h-10 w-10 p-0 rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-foodie-charcoal border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
