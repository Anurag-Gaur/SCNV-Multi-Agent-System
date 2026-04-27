import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SOReroutingCard from '../components/SOReroutingCard';
import { STORAGE_KEYS, API_URL } from '../config/constants';
import { Bell, Activity, RefreshCcw } from 'lucide-react';

function DecisionsPage({ sidebarCollapsed, setSidebarCollapsed, setSelectedAgent }) {
  const [soAlerts, setSoAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const authData = {
    token: localStorage.getItem(STORAGE_KEYS.TOKEN),
    role:  localStorage.getItem(STORAGE_KEYS.ROLE),
    email: localStorage.getItem(STORAGE_KEYS.EMAIL),
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/alerts/pending-so`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      setSoAlerts(data.alerts || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleLogout = () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    window.location.href = '/login';
  };

  return (
    <div className="chat-page">
      <Sidebar
        sessions={[]}
        currentSessionId={null}
        authData={authData}
        onLogout={handleLogout}
        activePage="decisions"
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onSelectAgent={setSelectedAgent}
      />

      <main className="chat-main" style={{ padding: '1.75rem 2rem', background: 'var(--ofi-bg)', display: 'block', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={28} style={{ color: 'var(--ofi-gold)' }} />
              Re-routing Decisions
            </h1>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>
              Review and act on sub-optimal sales order allocations across the network.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '8px' }}
          >
            <RefreshCcw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </header>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555555' }}>
            <div style={{
              width: '36px', height: '36px',
              border: '2px solid #1F1F1F',
              borderTopColor: 'var(--ofi-gold)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '1rem',
            }} />
            <p style={{ fontSize: '14px' }}>Loading pending decisions…</p>
          </div>
        ) : soAlerts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: '#0A0A0A',
            borderRadius: '12px',
            border: '1px solid #1F1F1F',
          }}>
            <div style={{
              width: '72px', height: '72px',
              background: 'rgba(34, 197, 94, 0.10)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Activity size={36} color="#22C55E" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>All Clear!</h3>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>No pending re-routing decisions found in the network.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {soAlerts.map(alert => (
              <SOReroutingCard
                key={alert.id}
                alert={alert}
                onActionComplete={() => fetchAlerts()}
              />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default DecisionsPage;
