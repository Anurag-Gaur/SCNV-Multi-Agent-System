import React, { useState } from 'react';
import { LogOut, LayoutDashboard, Bell, Compass, ChevronDown, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS } from '../config/agents.jsx';
import '../styles/sidebar.css';
import ofiLogo from '../utils/image (3).png';

function Sidebar({ authData, onLogout, onUploadClick, collapsed = false, setCollapsed, onSelectAgent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [agentsOpen, setAgentsOpen] = useState(false);

  const activePage =
    location.pathname === '/dashboard' || location.pathname === '/'
      ? 'dashboard'
      : location.pathname === '/decisions'
      ? 'decisions'
      : 'chat';

  const handleAgentClick = (agent) => {
    onSelectAgent(agent);
    navigate('/chat');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>

      {/* ── Logo header ───────────────────────────────────────────── */}
      <div className="sidebar__logo-header">
        {!collapsed ? (
          <div className="sidebar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={ofiLogo}
                alt="OFI"
                style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
              />
              <div>
                <div className="sidebar__brand">
                  <span className="sidebar__brand-akzo">OFI</span>
                  <span className="sidebar__brand-nobel">&nbsp;Services</span>
                </div>
                <div className="sidebar__tagline">SCNV Platform</div>
              </div>
            </div>
          </div>
        ) : (
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src={ofiLogo}
              alt="OFI"
              style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        )}

        <button
          className="sidebar__toggle-v2"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* ── Main navigation ───────────────────────────────────────── */}
      <div className="sidebar__nav">

        <button
          className={`nav-item ${activePage === 'dashboard' ? 'nav-item--active' : ''}`}
          onClick={() => navigate('/')}
          title={collapsed ? 'Dashboard' : undefined}
        >
          <div className="nav-icon-wrapper">
            <LayoutDashboard size={18} />
          </div>
          {!collapsed && <span style={{ flex: 1 }}>Dashboard</span>}
        </button>

        <button
          className={`nav-item ${activePage === 'decisions' ? 'nav-item--active' : ''}`}
          onClick={() => navigate('/decisions')}
          title={collapsed ? 'Decisions' : undefined}
        >
          <div className="nav-icon-wrapper">
            <Bell size={18} />
          </div>
          {!collapsed && <span style={{ flex: 1 }}>Decisions</span>}
        </button>

        {/* Agents dropdown */}
        <div className="nav-dropdown" style={{ position: 'relative' }}>
          <button
            className={`nav-item ${activePage === 'chat' ? 'nav-item--active' : ''}`}
            onClick={() => {
              if (collapsed) { setCollapsed(false); setAgentsOpen(true); }
              else setAgentsOpen(!agentsOpen);
            }}
            title={collapsed ? 'Explore Agents' : undefined}
          >
            <div className="nav-icon-wrapper">
              <Compass size={18} />
            </div>
            {!collapsed && (
              <>
                <span style={{ flex: 1 }}>Explore Agents</span>
                <ChevronDown
                  size={13}
                  className={`dropdown-arrow ${agentsOpen ? 'dropdown-arrow--rotated' : ''}`}
                />
              </>
            )}
          </button>

          <AnimatePresence>
            {agentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
                className={`nav-dropdown__content ${collapsed ? 'nav-dropdown__content--flyout' : ''}`}
              >
                {AGENTS.map(agent => (
                  <button
                    key={agent.id}
                    className="nav-dropdown__item"
                    onClick={() => handleAgentClick(agent)}
                    title={collapsed ? agent.title : undefined}
                  >
                    <div className="agent-icon-small" style={{
                      color: agent.color,
                      background: agent.bgColor,
                      border: `1px solid ${agent.color}25`,
                    }}>
                      {agent.icon}
                    </div>
                    <span>{agent.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="sidebar__footer">
        {!collapsed && authData?.email && (
          <div className="sidebar__user-card">
            <div className="sidebar__user-email">{authData.email}</div>
            <div className="sidebar__user-role">{authData.role || 'User'}</div>
          </div>
        )}

        <button
          className="btn btn-outline btn-full"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
