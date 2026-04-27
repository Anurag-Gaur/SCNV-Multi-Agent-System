import React from 'react';
import { Tooltip, ResponsiveContainer } from 'recharts';

/* OFI chart token constants — import these into any chart component */
export const OFI_COLORS = {
  gold:    '#CCA23E',
  success: '#22C55E',
  error:   '#EF4444',
  info:    '#3B82F6',
  warning: '#F59E0B',
  muted:   '#555555',
  border:  '#1F1F1F',
  text:    '#FFFFFF',
  textSec: '#A0A0A0',
};

/** Default series palette — gold first, then status colors */
export const OFI_SERIES_COLORS = [
  '#CCA23E',
  '#22C55E',
  '#3B82F6',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
];

/** Shared axis tick style for Recharts */
export const ofiAxisStyle = {
  fill:     '#A0A0A0',
  fontSize: 11,
  fontFamily: 'Inter, sans-serif',
};

/** Shared cartesian grid props */
export const ofiGridProps = {
  stroke:           '#1F1F1F',
  strokeDasharray:  '3 3',
  vertical:         false,
};

/**
 * OFITooltip — dark-themed Recharts custom tooltip.
 * Pass as `content={<OFITooltip />}` in a Recharts <Tooltip />.
 */
export function OFITooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ofi-surface border border-ofi-border rounded-ofi-sm px-3 py-2.5 shadow-2xl text-sm pointer-events-none">
      {label && <div className="text-xs font-bold text-ofi-text-muted mb-1.5 uppercase tracking-wide">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-ofi-text-sec text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color || OFI_COLORS.gold }} />
          <span className="font-medium text-ofi-text">{entry.name}</span>
          <span className="ml-auto font-bold" style={{ color: entry.color || OFI_COLORS.gold }}>
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * OFIChartWrapper — wraps any Recharts chart in a responsive container
 * with a consistent dark card frame.
 *
 * @param {string} title  - chart section title
 * @param {string} [subtitle]
 * @param {number} [height] - chart height in px (default 240)
 */
export function OFIChartWrapper({ title, subtitle, height = 240, children }) {
  return (
    <div className="bg-ofi-surface border border-ofi-border rounded-ofi-md overflow-hidden">
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-ofi-border">
          {title    && <div className="text-sm font-bold text-ofi-text">{title}</div>}
          {subtitle && <div className="text-xs text-ofi-text-muted mt-0.5">{subtitle}</div>}
        </div>
      )}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
