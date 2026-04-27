import React, { useState, useEffect } from 'react';
import { UserX, AlertTriangle, CheckCircle } from 'lucide-react';
import { API_URL, STORAGE_KEYS } from '../config/constants';

function SuboptimalCustomerTile({ selectedCountry }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const url = selectedCountry
      ? `${API_URL}/api/kpi/suboptimal-customers?country=${selectedCountry}`
      : `${API_URL}/api/kpi/suboptimal-customers`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedCountry]);

  if (loading) {
    return (
      <div className="suboptimal-tile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="kpi-card__shimmer" />
      </div>
    );
  }
  if (!data) return null;

  const pct = data.suboptimal_pct;
  const severity = pct >= 60 ? 'critical' : pct >= 40 ? 'warning' : 'good';

  /* Status colours for badge/icon only — value text stays white */
  const statusColor = { critical: '#EF4444', warning: '#F59E0B', good: '#22C55E' }[severity];
  const badgeLabel  = { critical: '● Critical', warning: '● Warning', good: '● Healthy' }[severity];
  const IconComp    = { critical: AlertTriangle, warning: UserX, good: CheckCircle }[severity];

  return (
    <div className="suboptimal-tile">
      <div className="suboptimal-tile__header">
        <div className="suboptimal-tile__icon" style={{ background: `${statusColor}14`, color: statusColor }}>
          <IconComp size={20} />
        </div>
        <div className="suboptimal-tile__badge" style={{ background: `${statusColor}14`, color: statusColor }}>
          {badgeLabel}
        </div>
      </div>

      {/* Value always white */}
      <div className="suboptimal-tile__value" style={{ color: '#FFFFFF' }}>{pct}%</div>
      <div className="suboptimal-tile__label">Sub-optimal Customer %</div>
      <div className="suboptimal-tile__desc">
        {data.suboptimal_orders} of {data.total_orders} orders allocated sub-optimally
        {selectedCountry ? ` in ${selectedCountry}` : ''}
      </div>

      {/* Decorative ring — uses gold */}
      <div className="suboptimal-tile__ring">
        <svg viewBox="0 0 36 36" className="suboptimal-ring-svg">
          <path className="suboptimal-ring-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path
            className="suboptimal-ring-fill"
            strokeDasharray={`${pct}, 100`}
            style={{ stroke: '#CCA23E' }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </div>
    </div>
  );
}

export default SuboptimalCustomerTile;
