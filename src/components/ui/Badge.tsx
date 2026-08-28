import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'yellow';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-foodie-app text-foodie-charcoal border border-foodie-border',
    yellow: 'bg-foodie-yellow-soft text-foodie-amber-dark border border-foodie-yellow/40',
    success: 'bg-emerald-50 text-foodie-green border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-foodie-red border border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
