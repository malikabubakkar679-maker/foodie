import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative flex flex-col gap-1">
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 text-foodie-muted flex items-center pointer-events-none">{icon}</div>}
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-xl border border-foodie-border bg-white px-3.5 py-2 text-sm text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
              icon && 'pl-10',
              error && 'border-foodie-red focus:border-foodie-red focus:ring-foodie-red/20',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-foodie-red font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
