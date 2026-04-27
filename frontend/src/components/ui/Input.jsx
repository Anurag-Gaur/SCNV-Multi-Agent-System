import React from 'react';
import { cn } from '../../lib/utils';

/**
 * OFI Input — dark bg (#111), gold focus ring, label above, optional error state.
 *
 * @param {string} label - field label
 * @param {string} error - error message string
 * @param {string} hint  - helper text below field
 * @param {React.ReactNode} prefix - icon/adornment left of input
 */
export function Input({
  label,
  error,
  hint,
  prefix,
  className,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-ofi-text-sec uppercase tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ofi-text-muted">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-ofi-surface-2 border text-ofi-text text-sm rounded-ofi-sm px-3 py-2.5 transition-colors duration-150 placeholder:text-ofi-text-muted focus:outline-none focus:ring-2 focus:ring-ofi-gold focus:border-ofi-gold',
            error
              ? 'border-ofi-error focus:ring-ofi-error'
              : 'border-ofi-border',
            prefix && 'pl-9',
            className,
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-ofi-error">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-ofi-text-muted">{hint}</p>
      )}
    </div>
  );
}
