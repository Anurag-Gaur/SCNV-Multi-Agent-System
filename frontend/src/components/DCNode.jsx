import React from 'react';
import { Handle, Position } from 'reactflow';
import { Warehouse } from 'lucide-react';
import { OFINodeWrapper } from './ui/FlowTheme';

const DCNode = ({ data, isConnectable, selected }) => (
  <OFINodeWrapper selected={selected}>
    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#3B82F6', border: '2px solid #0A0A0A', width: 8, height: 8 }}
      />
      <div style={{
        background: 'rgba(59, 130, 246, 0.12)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '7px',
        borderRadius: '6px',
        color: '#3B82F6',
        display: 'flex',
      }}>
        <Warehouse size={18} />
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', textTransform: 'capitalize' }}>
          {data.label}
        </div>
        <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {data.type || 'DC'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#3B82F6', border: '2px solid #0A0A0A', width: 8, height: 8 }}
      />
    </div>
  </OFINodeWrapper>
);

export default DCNode;
