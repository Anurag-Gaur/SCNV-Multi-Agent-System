import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../components/Sidebar';
import CountrySelector from '../components/CountrySelector';
import AllocationEfficiencyCard from '../components/AllocationEfficiencyCard';
import ProductiveTrendChart from '../components/ProductiveTrendChart';
import SuboptimalCustomerTile from '../components/SuboptimalCustomerTile';
import { STORAGE_KEYS, API_URL } from '../config/constants';
import { Maximize2, X, Activity } from 'lucide-react';
import PlantNode from '../components/PlantNode';
import DCNode from '../components/DCNode';

function DashboardPage({ sidebarCollapsed, setSidebarCollapsed, setSelectedAgent }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isCelonisEnabled, setIsCelonisEnabled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const nodeTypes = useMemo(() => ({ plant: PlantNode, dc: DCNode }), []);

  const authData = {
    token: localStorage.getItem(STORAGE_KEYS.TOKEN),
    role:  localStorage.getItem(STORAGE_KEYS.ROLE),
    email: localStorage.getItem(STORAGE_KEYS.EMAIL),
  };

  const handleLogout = () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    window.location.href = '/login';
  };

  const onNodesChange = useCallback((changes) => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges(eds => applyEdgeChanges(changes, eds)), []);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/network/map`, {
          headers: { Authorization: `Bearer ${authData.token || ''}` },
        });
        if (!res.ok && res.status !== 401) throw new Error('Failed to fetch network data');
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, [authData.token]);

  /* ── ReactFlow dark background override ── */
  const flowBgProps = { variant: 'dots', gap: 14, size: 1, color: '#1F1F1F' };

  const mapContent = loading ? (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ofi-text-muted)', fontSize: '14px' }}>
      Loading live SAP Network Data…
    </div>
  ) : error ? (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '14px' }}>
      {error}
    </div>
  ) : (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      style={{ background: '#000000' }}
      defaultEdgeOptions={{
        style: { stroke: 'rgba(204,162,62,0.55)', strokeWidth: 1.5 },
      }}
    >
      <Controls style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', borderRadius: '8px' }} />
      <Background {...flowBgProps} />
    </ReactFlow>
  );

  return (
    <div className="chat-page">
      <Sidebar
        sessions={[]}
        currentSessionId={null}
        authData={authData}
        onLogout={handleLogout}
        activePage="dashboard"
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onSelectAgent={setSelectedAgent}
      />

      <main className="chat-main" style={{ padding: '1.75rem 2rem', background: 'var(--ofi-bg)', display: 'block', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              Supply Chain Dashboard
            </h1>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>
              Real-time visibility across your supply network and agent activity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />

            {/* Celonis toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#0A0A0A',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #1F1F1F',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Celonis EMS</span>
                <span style={{ fontSize: '11px', color: isCelonisEnabled ? '#22C55E' : '#555555' }}>
                  {isCelonisEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <button
                onClick={() => setIsCelonisEnabled(v => !v)}
                style={{
                  width: '40px', height: '22px',
                  background: isCelonisEnabled ? '#22C55E' : '#1F1F1F',
                  borderRadius: '11px',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.25s',
                }}
              >
                <div style={{
                  width: '16px', height: '16px',
                  background: '#FFFFFF',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: isCelonisEnabled ? '21px' : '3px',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }} />
              </button>
            </div>
          </div>
        </header>

        {/* ── KPI Section ── */}
        <div className="dashboard-kpi-section">
          <div className="dashboard-kpi-section__title">
            <Activity size={13} /> Allocation Efficiency KPIs
          </div>
          <AllocationEfficiencyCard selectedCountry={selectedCountry} />
        </div>

        {/* ── Charts Row ── */}
        <div className="dashboard-charts-row">
          <ProductiveTrendChart selectedCountry={selectedCountry} />
          <SuboptimalCustomerTile selectedCountry={selectedCountry} />
        </div>

        {/* ── Network Map ── */}
        <section style={{
          background: '#0A0A0A',
          borderRadius: '12px',
          border: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          marginBottom: '2rem',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #1F1F1F' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Network Visibility Map</h2>
            <button
              onClick={() => setIsMapModalOpen(true)}
              style={{
                background: '#111111',
                border: '1px solid #1F1F1F',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                color: '#A0A0A0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.target.style.color = '#CCA23E'; e.target.style.borderColor = '#CCA23E'; }}
              onMouseLeave={e => { e.target.style.color = '#A0A0A0'; e.target.style.borderColor = '#1F1F1F'; }}
            >
              <Maximize2 size={13} /> Expand
            </button>
          </div>
          <div style={{ height: '520px', width: '100%' }}>
            {mapContent}
          </div>
        </section>

        {/* ── Fullscreen map modal ── */}
        {isMapModalOpen && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF' }}>Network Visibility Map</h2>
              <button
                onClick={() => setIsMapModalOpen(false)}
                style={{
                  background: '#0A0A0A',
                  border: '1px solid #1F1F1F',
                  borderRadius: '8px',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#FFFFFF',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, background: '#000000', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1F1F1F', minHeight: 0 }}>
              {mapContent}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
