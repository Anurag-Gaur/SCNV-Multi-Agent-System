import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, MessageSquare, Upload, Bell, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import WelcomeScreen from '../components/WelcomeScreen';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import SOReroutingCard from '../components/SOReroutingCard';
import { fetchSessions, loadSession, saveSession, sendMessage, uploadDocument } from '../api/api';
import { generateId, getTimeLabel } from '../utils/helpers';
import PreviewModal from '../components/PreviewModal';
import { STORAGE_KEYS, API_URL } from '../config/constants';
import StarBorder from '../components/StarBorder';

function ChatPage({ sidebarCollapsed, setSidebarCollapsed, selectedAgent, setSelectedAgent }) {
  const navigate = useNavigate();

  const authData = {
    token: localStorage.getItem(STORAGE_KEYS.TOKEN),
    role:  localStorage.getItem(STORAGE_KEYS.ROLE),
    email: localStorage.getItem(STORAGE_KEYS.EMAIL),
  };

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soAlerts, setSoAlerts] = useState([]);
  const [showSOPanel, setShowSOPanel] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const refreshSessions = useCallback(async () => {
    try {
      const list = await fetchSessions(selectedAgent?.id);
      setSessions(list);
    } catch (err) { console.error('Failed to fetch sessions:', err); }
  }, [selectedAgent]);

  const handleLoadSession = useCallback(async (sessionId) => {
    try {
      const data = await loadSession(sessionId);
      setCurrentSessionId(sessionId);
      setMessages(data.messages || []);
    } catch (err) { console.error('Failed to load session:', err); }
  }, []);

  const persistSession = useCallback(async (sessionId, msgs) => {
    if (!sessionId || msgs.length === 0) return;
    try {
      await saveSession({ sessionId, messages: msgs, agentId: selectedAgent?.id });
      await refreshSessions();
    } catch (err) { console.error('Failed to save session:', err); }
  }, [refreshSessions]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    const sessionId = currentSessionId || generateId();
    if (!currentSessionId) setCurrentSessionId(sessionId);
    setInput('');
    const userMsg = { role: 'user', content: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const data = await sendMessage(userMessage, sessionId, selectedAgent?.id);
      const botMsg = { role: 'assistant', content: data.answer || 'No response', sources: data.sources || [], timestamp: Date.now() };
      setMessages(prev => { const updated = [...prev, botMsg]; persistSession(sessionId, updated); return updated; });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: 'Error: ' + (err.response?.data?.detail || 'Failed to get response'), timestamp: Date.now() }]);
    } finally { setIsLoading(false); }
  }, [input, isLoading, currentSessionId, persistSession]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadDocument(file);
      setMessages(prev => [...prev, { role: 'system', content: `✅ Successfully uploaded "${file.name}". Processing in progress.`, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: `❌ Upload failed: ${err.response?.data?.detail || 'Unknown error'}`, timestamp: Date.now() }]);
    }
    e.target.value = '';
  }, []);

  const handleNewChat = useCallback(() => { setCurrentSessionId(null); setMessages([]); }, []);
  const handleLogout = useCallback(() => { Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k)); navigate('/login'); }, [navigate]);

  useEffect(() => { refreshSessions(); }, [refreshSessions]);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { setCurrentSessionId(null); setMessages([]); }, [selectedAgent]);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;
    fetch(`${API_URL}/api/alerts/pending-so`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setSoAlerts(d.alerts || []))
      .catch(console.error);
  }, []);

  return (
    <div className="chat-page">
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.csv,.doc,.docx,.json,.xlsx" onChange={handleFileUpload} style={{ display: 'none' }} />

      <Sidebar
        authData={authData}
        onLogout={handleLogout}
        onUploadClick={() => fileInputRef.current?.click()}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onSelectAgent={setSelectedAgent}
      />

      <main className="chat-main" style={{ flexDirection: selectedAgent ? 'row' : 'column' }}>
        {!selectedAgent ? (
          <div className="explore-agents-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
            <WelcomeScreen onSelectAgent={setSelectedAgent} />
          </div>
        ) : (
          <>
            {/* ── Session sidebar ── */}
            <aside className="chat-sub-sidebar">
              <div className="sub-sidebar__header">
                <StarBorder
                  color={selectedAgent?.color || '#CCA23E'}
                  speed="6s"
                  thickness={2}
                  style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', width: '100%' }}
                >
                  <div className="agent-identity" style={{ padding: '10px 12px' }}>
                    <div className="agent-icon-v2" style={{
                      background: selectedAgent?.bgColor || 'rgba(255,255,255,0.06)',
                      border: `1px solid ${selectedAgent?.color || '#1F1F1F'}30`,
                      color: selectedAgent?.color || '#CCA23E',
                    }}>
                      {selectedAgent?.icon}
                    </div>
                    <div className="agent-info-v2">
                      <div className="agent-name-v2">{selectedAgent?.title}</div>
                      <div className="agent-status-v2">Online &amp; Ready</div>
                    </div>
                  </div>
                </StarBorder>
              </div>

              <div style={{ flex: 1 }} />

              <div className="sidebar__new-btn-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button className="btn btn-primary btn-full" onClick={handleNewChat}>
                  <Plus size={15} /> New Session
                </button>
                {authData?.role === 'Admin' && (
                  <button className="btn btn-outline btn-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={13} /> Upload Data
                  </button>
                )}
              </div>

              <div className="sidebar__history" style={{ padding: '0 10px' }}>
                <div className="section-label" style={{ paddingBottom: '8px' }}>Recent Sessions</div>
                {sessions.length === 0 ? (
                  <div className="sidebar__empty">No session history yet</div>
                ) : (
                  sessions.map(session => (
                    <div
                      key={session.session_id}
                      className={`session-item ${session.session_id === currentSessionId ? 'session-item--active' : ''}`}
                      onClick={() => handleLoadSession(session.session_id)}
                    >
                      <div className="session-item__header">
                        <MessageSquare size={13} style={{ color: session.session_id === currentSessionId ? 'var(--ofi-gold)' : 'var(--ofi-text-muted)', flexShrink: 0 }} />
                        <div className="session-item__title">{session.title || 'Untitled Session'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* ── Chat area ── */}
            <div className="chat-content-v2">
              <div className="chat-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '7px',
                    background: selectedAgent.bgColor,
                    border: `1px solid ${selectedAgent.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: selectedAgent.color,
                  }}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <div className="chat-topbar__title">{currentSessionId ? 'Active Session' : 'New Session'}</div>
                    <div className="chat-topbar__subtitle">Powered by {selectedAgent.title}</div>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                <div className="chat-messages__inner">
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--ofi-text-muted)' }}>
                      <p style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--ofi-text-sec)' }}>
                        Start a conversation with <strong style={{ color: 'var(--ofi-gold)' }}>{selectedAgent.title}</strong>
                      </p>
                      <p style={{ fontSize: '13px' }}>Type your query below to get intelligent supply chain insights.</p>
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <MessageBubble key={idx} msg={msg} onPreview={setPreviewFile} />
                  ))}
                  {isLoading && (
                    <div className="message-row message-row--system">
                      <div className="msg-avatar msg-avatar--bot">
                        <Loader2 size={15} color="#000" style={{ animation: 'spin 1s linear infinite' }} />
                      </div>
                      <div className="typing-bubble">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="chat-input-section" style={{ padding: '0 0 1.5rem' }}>
                <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── SO toggle FAB ── */}
      {soAlerts.length > 0 && (
        <button className="so-alerts-panel__toggle" onClick={() => setShowSOPanel(!showSOPanel)} title="SO Re-routing Alerts">
          <Bell size={22} />
          <span className="so-alerts-panel__toggle-count">{soAlerts.length}</span>
        </button>
      )}

      {/* ── SO slide panel ── */}
      {showSOPanel && (
        <div className="so-alerts-panel">
          <div className="so-alerts-panel__header">
            <div className="so-alerts-panel__title">
              <Bell size={16} />
              SO Re-routing Decisions
              <span className="so-alerts-panel__badge">{soAlerts.length} pending</span>
            </div>
            <button onClick={() => setShowSOPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ofi-text-muted)' }}>
              <X size={18} />
            </button>
          </div>
          <div className="so-alerts-panel__body">
            {soAlerts.map(alert => (
              <SOReroutingCard key={alert.id} alert={alert} onActionComplete={(id, action) => console.log(`SO ${id} ${action}`)} />
            ))}
          </div>
        </div>
      )}

      {previewFile && <PreviewModal filename={previewFile} onClose={() => setPreviewFile(null)} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .chat-sub-sidebar {
          width: 260px;
          border-right: 1px solid #1F1F1F;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          color: #FFFFFF;
        }

        .chat-content-v2 {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #000000;
          position: relative;
        }

        .sub-sidebar__header {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid #1F1F1F;
        }

        .agent-identity {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .agent-icon-v2 {
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          border: 1px solid #1F1F1F;
        }

        .agent-info-v2 { display: flex; flex-direction: column; gap: 1px; }
        .agent-name-v2 { font-size: 14px; font-weight: 600; color: #FFFFFF; }
        .agent-status-v2 {
          font-size: 10px; color: #22C55E; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 4px;
        }
        .agent-status-v2::before {
          content: ''; display: inline-block;
          width: 5px; height: 5px;
          background: #22C55E; border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default ChatPage;
