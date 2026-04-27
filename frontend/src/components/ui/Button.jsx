import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const variants = {
  primary:   'bg-ofi-gold text-black font-semibold hover:bg-[#D4AC42] shadow-ofi-gold border border-transparent',
  secondary: 'bg-transparent text-ofi-gold border border-ofi-gold hover:bg-ofi-gold-muted',
  ghost:     'bg-transparent text-ofi-text-sec border border-transparent hover:text-ofi-text hover:bg-ofi-surface-2',
  danger:    'bg-transparent text-ofi-error border border-ofi-error hover:bg-[rgba(239,68,68,0.10)]',
};

const sizes = {
  sm:   'text-xs px-3 py-2 rounded-ofi-sm gap-1.5',
  md:   'text-sm px-4 py-2.5 rounded-ofi-sm gap-2',
  lg:   'text-base px-5 py-3 rounded-ofi-sm gap-2',
};

/**
 * OFI Button — primary (gold fill), secondary (outlined gold),
 * ghost (text only), danger (red outlined). Framer Motion whileTap scale.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} disabled
 * @param {boolean} loading
 * @param {React.ReactNode} children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ duration: 0.1 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ofi-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ofi-bg disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
