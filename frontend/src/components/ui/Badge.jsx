import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  gold:    'bg-[rgba(204,162,62,0.12)] text-ofi-gold    border-[rgba(204,162,62,0.2)]',
  success: 'bg-[rgba(34,197,94,0.10)] text-ofi-success  border-[rgba(34,197,94,0.2)]',
  warning: 'bg-[rgba(245,158,11,0.10)] text-ofi-warning border-[rgba(245,158,11,0.2)]',
  error:   'bg-[rgba(239,68,68,0.10)] text-ofi-error    border-[rgba(239,68,68,0.2)]',
  info:    'bg-[rgba(59,130,246,0.10)] text-ofi-info    border-[rgba(59,130,246,0.2)]',
  muted:   'bg-ofi-surface-2 text-ofi-text-muted border-ofi-border',
};

/**
 * OFI Badge — status indicator chip with color-coded variants.
 *
 * @param {'gold'|'success'|'warning'|'error'|'info'|'muted'} variant
 * @param {boolean} dot - prepend a colored status dot
 */
export function Badge({ variant = 'muted', dot = false, className, children }) {
  const dotColor = {
    gold:    'bg-ofi-gold',
    success: 'bg-ofi-success',
    warning: 'bg-ofi-warning',
    error:   'bg-ofi-error',
    info:    'bg-ofi-info',
    muted:   'bg-ofi-text-muted',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full border',
        variants[variant],
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />}
      {children}
    </span>
  );
}
