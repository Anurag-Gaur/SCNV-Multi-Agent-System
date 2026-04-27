import React, { useState, useEffect } from 'react';
import { Gauge, TrendingDown, Target } from 'lucide-react';
import { API_URL, STORAGE_KEYS } from '../config/constants';
import StarBorder from './StarBorder';

function AllocationEfficiencyCard({ selectedCountry }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const url = selectedCountry
      ? `${API_URL}/api/kpi/allocation-efficiency?country=${selectedCountry}`
      : `${API_URL}/api/kpi/allocation-efficiency`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedCountry]);

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="kpi-card kpi-card--loading" style={{ flex: 1 }}>
            <div className="kpi-card__shimmer" />
          </div>
        ))}
      </div>
    );
  }
  if (!data) return null;

  /* Status colour is used only for badge + icon — NOT for value text */
  const statusColor = (val, thresholds, reverse = false) => {
    const [good, warn] = thresholds;
    if (reverse) {
      return val <= good ? '#22C55E' : val <= warn ? '#F59E0B' : '#EF4444';
    }
    return val >= good ? '#22C55E' : val >= warn ? '#F59E0B' : '#EF4444';
  };

  const metrics = [
    {
      label: 'Allocation Efficiency',
      value: `${data.allocation_efficiency_pct}%`,
      raw: data.allocation_efficiency_pct,
      icon: <Gauge size={20} />,
      status: statusColor(data.allocation_efficiency_pct, [70, 50]),
      badge: data.allocation_efficiency_pct >= 70 ? '● Good' : data.allocation_efficiency_pct >= 50 ? '● Average' : '● Low',
      description: 'Avg efficiency score across all orders',
      progress: Math.min(data.allocation_efficiency_pct, 100),
    },
    {
      label: 'Unproductive Transfer',
      value: `${data.unproductive_transfer_ratio}%`,
      raw: data.unproductive_transfer_ratio,
      icon: <TrendingDown size={20} />,
      status: statusColor(data.unproductive_transfer_ratio, [30, 50], true),
      badge: data.unproductive_transfer_ratio <= 30 ? '● Low' : data.unproductive_transfer_ratio <= 50 ? '● Medium' : '● High',
      description: 'Ratio of unproductive volume vs total',
      progress: Math.min(data.unproductive_transfer_ratio, 100),
    },
    {
      label: 'Optimal Allocation',
      value: `${data.optimal_allocation_ratio}%`,
      raw: data.optimal_allocation_ratio,
      icon: <Target size={20} />,
      status: statusColor(data.optimal_allocation_ratio, [60, 40]),
      badge: data.optimal_allocation_ratio >= 60 ? '● Good' : data.optimal_allocation_ratio >= 40 ? '● Average' : '● Needs Attention',
      description: 'Orders allocated to optimal plant',
      progress: Math.min(data.optimal_allocation_ratio, 100),
    },
  ];

  return (
    <div className="kpi-efficiency-grid">
      {metrics.map(m => (
        <StarBorder
          key={m.label}
          color="#CCA23E"
          speed="12s"
          thickness={2}
          style={{ borderRadius: '12px', display: 'block' }}
        >
          <div className="kpi-card" style={{ margin: 0, border: 'none', borderRadius: '12px' }}>
            <div className="kpi-card__header">
              {/* Icon uses status color for semantic context */}
              <div className="kpi-card__icon" style={{ background: `${m.status}14`, color: m.status }}>
                {m.icon}
              </div>
              {/* Badge uses status color */}
              <div
                className="kpi-card__trend-badge"
                style={{ background: `${m.status}14`, color: m.status }}
              >
                {m.badge}
              </div>
            </div>

            {/* Value is always white — clean, readable */}
            <div className="kpi-card__value" style={{ color: '#FFFFFF' }}>
              {m.value}
            </div>
            <div className="kpi-card__label">{m.label}</div>
            <div className="kpi-card__desc">{m.description}</div>

            {/* Progress bar uses OFI gold */}
            <div className="kpi-card__progress">
              <div
                className="kpi-card__progress-fill"
                style={{ width: `${m.progress}%`, background: '#CCA23E' }}
              />
            </div>
          </div>
        </StarBorder>
      ))}
    </div>
  );
}

export default AllocationEfficiencyCard;
