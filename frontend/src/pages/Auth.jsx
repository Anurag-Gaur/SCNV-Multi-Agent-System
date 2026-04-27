import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../api/api';
import { STORAGE_KEYS } from '../config/constants';
import Antigravity from '../components/Antigravity';
import '../styles/auth.css';
import '../styles/components.css';
import ofiLogo from '../utils/image (3).png';

const FEATURES = [
  { icon: '🎯', text: 'Orchestrator Agent – Coordination' },
  { icon: '🔍', text: 'SCM Analyst – Classification' },
  { icon: '⚡', text: 'Optimizer – Network Routes' },
];

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isLogin) await register({ email, password, role });
      const data = await login({ email, password });
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
      localStorage.setItem(STORAGE_KEYS.ROLE, data.role);
      localStorage.setItem(STORAGE_KEYS.EMAIL, email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left branding panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__canvas">
          <Antigravity
            count={350}
            magnetRadius={6}
            ringRadius={8}
            waveSpeed={0.3}
            waveAmplitude={1.2}
            particleSize={1.6}
            lerpSpeed={0.06}
            autoAnimate
            particleVariance={1.2}
            rotationSpeed={0.1}
            depthFactor={1.2}
            pulseSpeed={2.5}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>
        <div className="auth-panel__shape auth-panel__shape--tl" />
        <div className="auth-panel__shape auth-panel__shape--br" />

        <div className="auth-panel__content">
          {/* Logo + brand */}
          <div className="auth-brand">
            <div className="auth-brand__logo">
              <img src={ofiLogo} alt="OFI" className="auth-brand__logo-img" />
              <div>
                <span className="auth-brand__name">OFI</span>
                <span className="auth-brand__name" style={{ color: 'var(--ofi-text-sec)', fontWeight: 600 }}>&nbsp;Services</span>
              </div>
            </div>
            <div className="auth-brand__subtitle">Supply Chain Network Visibility</div>
          </div>

          <h1 className="auth-heading">
            OPTIMIZE YOUR<br />
            <span>SUPPLY CHAIN</span>
          </h1>

          <p className="auth-description">
            AI-powered multi-agent system for supply chain optimization, classification,
            and process analytics. Intelligent decision support at every level.
          </p>

          <ul className="auth-features">
            {FEATURES.map((f) => (
              <li key={f.text} className="auth-feature">
                <div className="auth-feature__icon">{f.icon}</div>
                <span className="auth-feature__text">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 className="auth-card__title">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-card__subtitle">
            {isLogin
              ? 'Access your supply chain intelligence dashboard'
              : 'Join the SCNV platform for supply chain optimization'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-pw-wrapper">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingRight: '46px' }}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="User">👤 Analyst – Query &amp; Monitor</option>
                  <option value="Admin">🔑 Admin – Configure &amp; Manage</option>
                </select>
              </div>
            )}

            {error && <div className="alert-error">⚠️ {error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="divider">
            {isLogin ? 'New to SCNV?' : 'Have an account?'}
          </div>

          <button className="auth-switch" onClick={() => { setIsLogin(p => !p); setError(''); }}>
            {isLogin ? 'Create new account' : 'Sign in instead'}
          </button>

          <p className="auth-footer">
            Secured AI-powered supply chain platform<br />
            © 2025 OFI Services SCNV. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
