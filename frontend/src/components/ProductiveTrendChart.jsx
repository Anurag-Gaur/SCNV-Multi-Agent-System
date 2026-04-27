import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { API_URL, STORAGE_KEYS } from '../config/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="chart-tooltip__item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span>{entry.name}: <strong style={{ color: entry.color }}>{Number(entry.value).toLocaleString()} HL</strong></span>
        </div>
      ))}
    </div>
  );
};

const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', marginBottom: '20px' }}>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: entry.color,
            boxShadow: `0 0 8px ${entry.color}80`
          }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-muted)' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

function ProductiveTrendChart({ selectedCountry }) {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const url = selectedCountry
      ? `${API_URL}/api/kpi/productive-trend?country=${selectedCountry}`
      : `${API_URL}/api/kpi/productive-trend`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const trend = (d.trend || []).map((t) => ({
          ...t,
          month: formatMonth(t.month),
        }));
        setTrendData(trend);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCountry]);

  return (
    <section className="chart-section" id="productive-trend-chart">
      <div className="chart-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="chart-section__title-group">
          <div className="chart-section__icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="chart-section__title">Productive vs Unproductive Volume</h2>
            <p className="chart-section__subtitle">
              Monthly trend {selectedCountry ? `for ${selectedCountry}` : '(all countries)'}
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#CCA23E' }} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#A0A0A0' }}>Productive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#EF4444' }} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#A0A0A0' }}>Unproductive</span>
          </div>
        </div>
      </div>

      <div className="chart-section__body" style={{ height: 280, padding: '1rem 1.25rem 1rem 0.5rem' }}>
        {loading ? (
          <div className="chart-section__loading">Loading chart data…</div>
        ) : trendData.length === 0 ? (
          <div className="chart-section__empty">No trend data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} barGap={8} barCategoryGap="25%">
              <defs>
                <linearGradient id="barGradientProductive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CCA23E" stopOpacity={1} />
                  <stop offset="100%" stopColor="#B8963A" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="barGradientUnproductive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1F1F1F" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#A0A0A0', fontFamily: 'Inter,sans-serif' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#A0A0A0', fontFamily: 'Inter,sans-serif' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                dx={-8}
              />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<CustomTooltip />} />
              <Bar
                dataKey="productive"
                name="Productive"
                fill="url(#barGradientProductive)"
                radius={[5, 5, 0, 0]}
                animationDuration={1000}
                activeBar={{ fill: '#D4AC42', stroke: '#CCA23E', strokeWidth: 1 }}
              />
              <Bar
                dataKey="unproductive"
                name="Unproductive"
                fill="url(#barGradientUnproductive)"
                radius={[5, 5, 0, 0]}
                animationDuration={1000}
                animationBegin={200}
                activeBar={{ fill: '#F87171', stroke: '#EF4444', strokeWidth: 1 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function formatMonth(str) {
  if (!str || str === 'Unknown') return str;
  try {
    const [y, m] = str.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  } catch {
    return str;
  }
}

export default ProductiveTrendChart;
