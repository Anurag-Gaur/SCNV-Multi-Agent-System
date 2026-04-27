import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import ofiLogo from '../../utils/image (3).png';

/**
 * OFI Navbar — top bar, OFI logo left, action buttons right.
 *
 * @param {string}   title       - page title shown in center/left
 * @param {Function} onLogout
 * @param {number}   alertCount  - notification badge count
 * @param {Function} onAlerts
 */
export function Navbar({ title, onLogout, alertCount = 0, onAlerts, className }) {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-5 h-14 bg-ofi-surface border-b border-ofi-border shrink-0',
        className,
      )}
    >
      {/* Left — logo + title */}
      <div className="flex items-center gap-3">
        <img src={ofiLogo} alt="OFI" className="h-7 w-auto object-contain" />
        {title && (
          <>
            <div className="w-px h-4 bg-ofi-border" />
            <span className="text-sm font-semibold text-ofi-text-sec">{title}</span>
          </>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        {onAlerts && (
          <button
            onClick={onAlerts}
            className="relative w-8 h-8 flex items-center justify-center rounded-md text-ofi-text-muted hover:text-ofi-text hover:bg-ofi-surface-2 transition-colors"
          >
            <Bell size={16} />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ofi-error text-white text-[9px] font-bold flex items-center justify-center border border-ofi-bg">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-8 h-8 flex items-center justify-center rounded-md text-ofi-text-muted hover:text-ofi-error hover:bg-[rgba(239,68,68,0.08)] transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
