import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * OFI Card — dark surface (#0A0A0A), 1px border (#1F1F1F).
 * Pass `hoverable` for Framer Motion lift on hover.
 *
 * @param {boolean} hoverable - enable hover lift animation
 * @param {string} className
 */
export function Card({ hoverable = false, className, children, ...props }) {
  const base = cn(
    'bg-ofi-surface border border-ofi-border rounded-ofi-md p-5',
    className,
  );

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
        transition={{ duration: 0.2 }}
        className={base}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} {...props}>
      {children}
    </div>
  );
}

/**
 * OFI StatCard — pre-built KPI card layout.
 *
 * @param {React.ReactNode} icon
 * @param {string} label
 * @param {string|number} value
 * @param {string} [delta] - change string, e.g. '+2.4%'
 * @param {'up'|'down'|'neutral'} [deltaDir]
 * @param {string} [description]
 */
export function StatCard({ icon, label, value, delta, deltaDir = 'neutral', description, className }) {
  const deltaColor = {
    up:      'text-ofi-success bg-[rgba(34,197,94,0.10)]',
    down:    'text-ofi-error   bg-[rgba(239,68,68,0.10)]',
    neutral: 'text-ofi-text-muted bg-ofi-surface-2',
  }[deltaDir];

  return (
    <Card hoverable className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[10px] bg-ofi-gold-muted border border-[rgba(204,162,62,0.15)] flex items-center justify-center text-ofi-gold">
          {icon}
        </div>
        {delta && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide', deltaColor)}>
            {delta}
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-ofi-text leading-none mb-1">{value}</div>
        <div className="text-sm font-semibold text-ofi-text mb-0.5">{label}</div>
        {description && <div className="text-xs text-ofi-text-muted">{description}</div>}
      </div>
    </Card>
  );
}
