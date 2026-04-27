import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/* ── ReactFlow OFI dark edge style ──────────────────────────── */
export const ofiEdgeStyle = {
  stroke:      '#1F1F1F',
  strokeWidth: 1.5,
};

export const ofiSelectedEdgeStyle = {
  stroke:      '#CCA23E',
  strokeWidth: 2,
};

/* ── ReactFlow MiniMap style ─────────────────────────────────── */
export const ofiMiniMapStyle = {
  background:    '#0A0A0A',
  maskColor:     'rgba(0, 0, 0, 0.7)',
  nodeBorderRadius: 6,
};

export const ofiMiniMapNodeColor = (node) => {
  if (node.type === 'plant') return '#CCA23E';
  if (node.type === 'dc')    return '#3B82F6';
  return '#555555';
};

/* ── Handle style ────────────────────────────────────────────── */
const handleStyle = {
  background: '#1F1F1F',
  border:     '1px solid #2A2A2A',
  width:      8,
  height:     8,
};

const selectedHandleStyle = {
  ...handleStyle,
  background: '#CCA23E',
  border:     '1px solid #CCA23E',
};

/**
 * OFINode — base dark node. Wrap in memo for performance.
 *
 * @param {Object} data    - node data from ReactFlow
 * @param {boolean} selected
 */
export const OFINode = memo(function OFINode({ data, selected }) {
  return (
    <div
      style={{
        background:   selected ? 'rgba(204,162,62,0.08)' : '#0A0A0A',
        border:       `1px solid ${selected ? '#CCA23E' : '#1F1F1F'}`,
        borderRadius: '8px',
        padding:      '10px 14px',
        minWidth:     '120px',
        boxShadow:    selected ? '0 0 0 2px rgba(204,162,62,0.2)' : '0 2px 8px rgba(0,0,0,0.4)',
        transition:   'all 0.15s',
      }}
    >
      <Handle type="target" position={Position.Left}  style={selected ? selectedHandleStyle : handleStyle} />

      {data.icon && (
        <div style={{ fontSize: 20, marginBottom: 4, textAlign: 'center' }}>{data.icon}</div>
      )}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', letterSpacing: '0.02em' }}>
        {data.label}
      </div>
      {data.sublabel && (
        <div style={{ fontSize: 10, color: '#A0A0A0', textAlign: 'center', marginTop: 2 }}>
          {data.sublabel}
        </div>
      )}

      <Handle type="source" position={Position.Right} style={selected ? selectedHandleStyle : handleStyle} />
    </div>
  );
});

/**
 * OFINodeWrapper — helper HOC to keep your custom nodes styled OFI.
 * Merges OFI base styles with any additional wrapper styles.
 */
export function OFINodeWrapper({ selected, children, style }) {
  return (
    <div
      style={{
        background:   selected ? 'rgba(204,162,62,0.06)' : '#0A0A0A',
        border:       `1px solid ${selected ? '#CCA23E' : '#1F1F1F'}`,
        borderRadius: '8px',
        boxShadow:    selected ? '0 0 0 2px rgba(204,162,62,0.15)' : '0 2px 8px rgba(0,0,0,0.4)',
        transition:   'all 0.15s',
        overflow:     'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
