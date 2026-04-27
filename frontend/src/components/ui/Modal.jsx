import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * OFI Modal — portal, Framer fade+scale entrance, Escape key to close.
 *
 * @param {boolean}  open      - controlled open state
 * @param {Function} onClose   - called when user dismisses
 * @param {string}   title
 * @param {string}   [size]    - 'sm' | 'md' | 'lg'
 */
export function Modal({ open, onClose, title, size = 'md', className, children }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{   scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full bg-ofi-surface border border-ofi-border rounded-ofi-md shadow-2xl',
              widths[size],
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ofi-border">
              <h2 className="text-base font-bold text-ofi-text">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md text-ofi-text-muted hover:text-ofi-text hover:bg-ofi-surface-2 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
