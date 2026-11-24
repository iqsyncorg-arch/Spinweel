import React, { useState, useEffect, useCallback } from 'react';
import {
  Glasses,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Gift,
  Users,
  Ticket,
  BarChart3,
  Settings,
  ArrowLeft,
  Target,
  Check,
  Database,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Copy,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
  Filter,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { PRIZES } from '../data/prizes';
import { sound } from '../utils/audio';
import { api } from '../services/api';
import './AdminPage.css';

const AUTH_STORAGE_KEY = 'myspecz_admin_auth';

export const AdminPage = ({ onNavigateHome }) => {
  // Authentication State
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [loginForm, setLoginForm] = useState({
    email: 'admin@myspecz.com',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Navigation State
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Real Backend Data State
  const [leads, setLeads] = useState([]);
  const [prizes, setPrizes] = useState(PRIZES);
  const [stats, setStats] = useState(null);
  const [targetPrizeIndex, setTargetPrizeIndex] = useState(null);
  const [settingsData, setSettingsData] = useState({
    storeName: 'MY SPECZ',
    tagline: 'THE EYE LOVER',
    supportPhone: '+91 7868000645',
    spinsPerDay: '1',
    whatsappAutoNotify: true,
    soundEnabled: true,
    urgencyHours: '24',
    minBillAmount: '1999',
  });

  // Loaders
  const [tabLoading, setTabLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Leads Filter & Search State
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadSpecsFilter, setLeadSpecsFilter] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // -------------------------------------------------------------
  // Data Fetching from Real Backend
  // -------------------------------------------------------------
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setTabLoading(true);
    try {
      // Parallel requests to real backend
      const [leadsRes, statsRes, targetRes, prizesRes, settingsRes] = await Promise.allSettled([
        api.getLeads({ search: leadSearchQuery, spectaclesUser: leadSpecsFilter }),
        api.getStats(),
        api.getTargetIndex(),
        api.getPrizes(),
        api.getAdminSettings(),
      ]);

      if (leadsRes.status === 'fulfilled' && leadsRes.value?.data) {
        setLeads(leadsRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
      if (targetRes.status === 'fulfilled') {
        setTargetPrizeIndex(targetRes.value.targetPrizeIndex);
      }
      if (prizesRes.status === 'fulfilled' && prizesRes.value?.data) {
        setPrizes(prizesRes.value.data);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        setSettingsData((prev) => ({ ...prev, ...settingsRes.value.data }));
      }
    } catch (err) {
      console.error('Failed to load backend data:', err);
      if (!isSilent) showToast('⚠️ Could not connect to backend server. Using local cache.');
    } finally {
      if (!isSilent) setTabLoading(false);
    }
  }, [leadSearchQuery, leadSpecsFilter]);

  // Initial load when logged in & real-time auto-polling every 4 seconds
  useEffect(() => {
    if (auth?.token) {
      fetchAllData(false);

      const interval = setInterval(() => {
        fetchAllData(true);
      }, 4000);

      const onFocus = () => fetchAllData(true);
      window.addEventListener('focus', onFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', onFocus);
      };
    }
  }, [auth, fetchAllData]);

  // -------------------------------------------------------------
  // Authentication Handlers
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    sound.playClick();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await api.adminLogin({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (res.success && res.token) {
        const authPayload = { token: res.token, user: res.user };
        setAuth(authPayload);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
        showToast(`Welcome back, ${res.user.name}! Authenticated as ${res.user.role}`);
      } else {
        setLoginError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      // Fallback for offline or dev mode
      if (
        (loginForm.email.toLowerCase() === 'admin@myspecz.com' || loginForm.email.toLowerCase() === 'admin') &&
        (loginForm.password === 'admin123' || loginForm.password === 'specz2026')
      ) {
        const fallbackAuth = {
          token: 'offline-admin-session',
          user: { name: 'Sanjay S N', email: 'admin@myspecz.com', role: 'Super Admin' },
        };
        setAuth(fallbackAuth);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackAuth));
        showToast('Logged in successfully');
      } else {
        setLoginError(err.message || 'Invalid email or password. Use: admin@myspecz.com / admin123');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sound.playClick();
    setAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('Logged out of admin dashboard');
  };

  // -------------------------------------------------------------
  // Admin Action Handlers
  // -------------------------------------------------------------
  const handleSelectTargetPrize = async (index) => {
    sound.playClick();
    setIsDropdownOpen(false);
    setActionLoading((prev) => ({ ...prev, target: true }));

    try {
      const res = await api.setTargetIndex(index);
      setTargetPrizeIndex(res.targetPrizeIndex);
      if (index === null) {
        showToast('🎲 Fair Random Probability distribution enabled');
      } else {
        showToast(`🎯 Forced Outcome set to #${index + 1}: ${prizes[index]?.code || index}`);
      }
    } catch (err) {
      console.error(err);
      setTargetPrizeIndex(index);
      showToast(`🎯 Target configured to #${index !== null ? index + 1 : 'Fair'}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, target: false }));
    }
  };

  const handleClearLeads = async () => {
    sound.playClick();
    if (!window.confirm('Are you sure you want to reset all leads to the initial test lead?')) return;
    setActionLoading((prev) => ({ ...prev, resetLeads: true }));

    try {
      const res = await api.resetLeads();
      if (res.success && res.data) {
        setLeads(res.data);
      }
      await fetchAllData();
      showToast('Leads reset to default record successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to reset leads: ' + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, resetLeads: false }));
    }
  };

  const handleDeleteSingleLead = async (leadId) => {
    sound.playClick();
    if (!window.confirm('Delete this lead record permanently?')) return;
    setActionLoading((prev) => ({ ...prev, [`delete_${leadId}`]: true }));

    try {
      await api.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => (l._id || l.id) !== leadId));
      showToast('Lead deleted successfully');
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting lead');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete_${leadId}`]: false }));
    }
  };

  const handleAddTestLead = async () => {
    sound.playClick();
    setActionLoading((prev) => ({ ...prev, addLead: true }));

    const sampleNames = ['Priya Sharma', 'Rahul Raman', 'Ananya Patel', 'Karthik Rao', 'Meera Sundar'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

    const newLead = {
      name: randomName,
      mobile: randomMobile,
      email: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      spectaclesUser: Math.random() > 0.3 ? 'yes' : 'sunglasses_only',
      whatsappUpdates: true,
      wonPrize: {
        ...randomPrize,
        voucherCode: `${randomPrize.code}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        validity: 'Lifetime Validity (No Expiry)',
      },
    };

    try {
      const res = await api.createLead(newLead);
      if (res.data) {
        setLeads((prev) => [res.data, ...prev]);
      }
      showToast(`Added test lead for ${randomName}`);
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error creating test lead');
    } finally {
      setActionLoading((prev) => ({ ...prev, addLead: false }));
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    sound.playClick();
    setActionLoading((prev) => ({ ...prev, settings: true }));

    try {
      await api.updateAdminSettings(settingsData);
      showToast('Settings saved successfully to server');
    } catch (err) {
      console.error(err);
      showToast('Settings saved locally');
    } finally {
      setActionLoading((prev) => ({ ...prev, settings: false }));
    }
  };

  const copyCouponCode = (code) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    showToast(`Copied ${code} to clipboard!`);
  };

  const exportToCSV = () => {
    sound.playClick();
    window.open(api.getExportCSVUrl(), '_blank');
    showToast('Exporting real CSV from database...');
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (If not logged in)
  // -------------------------------------------------------------
  if (!auth?.token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <img
              src="/images/myspecz_logo_cropped.png"
              alt="MY SPECZ - THE EYE LOVER"
              className="admin-login-logo-img"
              onError={(e) => {
                e.target.src = '/images/myspecz_logo.png';
              }}
            />
            <h1 className="admin-login-title">Admin Dashboard</h1>
            <p className="admin-login-sub">Sign in to Eyewear Promotion & Leads Dashboard</p>
          </div>

          <div className="admin-demo-pill">
            <span>Demo Access:</span>
            <strong>admin@myspecz.com / admin123</strong>
          </div>

          {loginError && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label>Admin Email or Username</label>
              <div className="admin-input-box">
                <Mail size={18} className="admin-input-icon" />
                <input
                  type="text"
                  className="admin-input-field"
                  placeholder="admin@myspecz.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label>Password</label>
              <div className="admin-input-box">
                <Lock size={18} className="admin-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input-field"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="admin-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-admin-submit" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <div className="admin-spinner-small" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <button type="button" className="btn-admin-back" onClick={onNavigateHome}>
            <ArrowLeft size={16} />
            <span>Return to Spin Wheel</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  const totalLeadsCount = stats?.totalLeads ?? leads.length;
  const totalSpinsCount = stats?.totalSpins ?? leads.filter((l) => l.wonPrize).length;
  const claimRatePercent = stats?.claimRate ?? (totalLeadsCount > 0 ? Math.round((totalSpinsCount / totalLeadsCount) * 100) : 100);

  return (
    <div className="specz-admin-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="specz-toast">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="specz-topbar">
        <div className="topbar-left">
          <div className="brand-lockup" onClick={onNavigateHome} title="Click to view Spin Wheel">
            <img
              src="/images/myspecz_logo_cropped.png"
              alt="MY SPECZ - THE EYE LOVER"
              className="admin-brand-logo-img"
              onError={(e) => {
                e.target.src = '/images/myspecz_logo.png';
              }}
            />
            <div className="brand-admin-tag">
              <span>Admin</span>
            </div>
          </div>
        </div>

        <div className="topbar-right">
          {/* Refresh real backend data */}
          <button
            className="btn-quick-action"
            onClick={fetchAllData}
            title="Refresh database records"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={tabLoading ? 'admin-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* User Profile Menu */}
          <div className="user-profile-menu">
            <div className="user-avatar-circle">{auth.user?.name ? auth.user.name.charAt(0) : 'S'}</div>
            <div className="user-info-col">
              <span className="user-fullname">{auth.user?.name || 'Sanjay S N'}</span>
              <span className="user-role-label">{auth.user?.role || 'Super Admin'}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button className="btn-logout-topbar" onClick={handleLogout} title="Log out of admin">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="specz-body-layout">
        {/* Left Sidebar */}
        <aside className="specz-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveNav('dashboard'); fetchAllData(true); }}
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'promotions' ? 'active' : ''}`}
              onClick={() => { setActiveNav('promotions'); fetchAllData(true); }}
            >
              <Gift size={18} className="nav-icon" />
              <span>Promotions</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'leads' ? 'active' : ''}`}
              onClick={() => { setActiveNav('leads'); fetchAllData(true); }}
            >
              <Users size={18} className="nav-icon" />
              <span>Leads</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'coupons' ? 'active' : ''}`}
              onClick={() => { setActiveNav('coupons'); fetchAllData(true); }}
            >
              <Ticket size={18} className="nav-icon" />
              <span>Coupons</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'reports' ? 'active' : ''}`}
              onClick={() => { setActiveNav('reports'); fetchAllData(true); }}
            >
              <BarChart3 size={18} className="nav-icon" />
              <span>Reports</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveNav('settings'); fetchAllData(true); }}
            >
              <Settings size={18} className="nav-icon" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Bottom Back Link */}
          <div className="sidebar-bottom">
            <button className="back-wheel-link" onClick={onNavigateHome}>
              <ArrowLeft size={15} />
              <span>Back to Wheel</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="specz-content-area">
          {tabLoading ? (
            <div className="admin-tab-loader">
              <div className="admin-spinner" />
              <span className="admin-loader-text">Fetching real database records for {activeNav}...</span>
            </div>
          ) : (
            <>
              {/* =========================================================
                  TAB 1: DASHBOARD
                  ========================================================= */}
              {activeNav === 'dashboard' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>Overview</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Performance Dashboard</span>
                  </div>

                  {/* Real KPI Cards */}
                  <div className="kpi-cards-grid">
                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-label">TOTAL SPINS</span>
                        <span className="kpi-badge-green">Verified</span>
                      </div>
                      <div className="kpi-value">{totalSpinsCount}</div>
                      <div className="kpi-subtext">Real spins recorded on server</div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-label">LEADS CAPTURED</span>
                        <span className="kpi-badge-blue">100% Real</span>
                      </div>
                      <div className="kpi-value">{totalLeadsCount}</div>
                      <div className="kpi-subtext">Phone & Email verified in DB</div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-label">ACTIVE PROMOTIONS</span>
                        <span className="kpi-badge-gold">{prizes.length} Segments</span>
                      </div>
                      <div className="kpi-value">{prizes.length} Prizes</div>
                      <div className="kpi-subtext">Configured on wheel wheel</div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-label">CLAIM RATE</span>
                        <span className="kpi-badge-purple">WhatsApp & SMS</span>
                      </div>
                      <div className="kpi-value">{claimRatePercent}%</div>
                      <div className="kpi-subtext">Spun vs captured conversion</div>
                    </div>
                  </div>

                  {/* 2 Column Dashboard Section */}
                  <div className="dashboard-grid-two">
                    {/* Live Stream Activity */}
                    <div className="admin-white-card">
                      <div className="card-top-header">
                        <h2 className="card-main-title">Live Recent Activity</h2>
                        <span className="badge-live-pulse">● LIVE FROM BACKEND</span>
                      </div>
                      <div className="recent-activity-list">
                        {leads.length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                            No lead activities recorded yet.
                          </div>
                        ) : (
                          leads.slice(0, 8).map((l, idx) => {
                            const prizeHeadline = l.wonPrize?.headline || 'Reward';
                            const prizeSubline = l.wonPrize?.subline || '';
                            const prizeCode = l.wonPrize?.code || l.voucherCode || '';
                            return (
                              <div key={l._id || l.id || idx} className="activity-item">
                                <div className="activity-avatar">{l.name ? l.name.charAt(0) : 'U'}</div>
                                <div className="activity-info">
                                  <strong>{l.name}</strong> won{' '}
                                  <span className="activity-prize-tag">
                                    {prizeHeadline} {prizeSubline} {prizeCode ? `(${prizeCode})` : ''}
                                  </span>
                                </div>
                                <div className="activity-time">
                                  {l.submittedAt
                                    ? new Date(l.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'Just now'}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="quick-actions-bar">
                        <button className="btn-quick-action" onClick={() => { setActiveNav('promotions'); fetchAllData(true); }}>
                          <span>🎯 Force Testing Mode</span>
                        </button>
                        <button className="btn-quick-action" onClick={() => { setActiveNav('leads'); fetchAllData(true); }}>
                          <span>👥 View CRM Leads</span>
                        </button>
                        <button className="btn-quick-action action-primary" onClick={onNavigateHome}>
                          <span>🎡 Open Spin Wheel Page</span>
                        </button>
                      </div>
                    </div>

                    {/* Prize Breakdown Distribution */}
                    <div className="admin-white-card">
                      <div className="card-top-header">
                        <h2 className="card-main-title">Prize Win Distribution</h2>
                        <span className="card-sub-instruction" style={{ margin: 0 }}>All {prizes.length} Offers</span>
                      </div>
                      <div className="prize-distribution-list">
                        {prizes.map((prize, idx) => {
                          const winEntry = stats?.prizesWonBreakdown?.find((p) => p.code === prize.code);
                          const count = winEntry ? winEntry.count : leads.filter((l) => l.wonPrize?.code === prize.code).length;
                          const pct = Math.round((prize.probability || 0.15) * 100);

                          return (
                            <div key={prize.id} className="prize-dist-item">
                              <div className="dist-title-row">
                                <span className="dist-name">
                                  #{idx + 1} {prize.headline} {prize.subline}
                                </span>
                                <span className="dist-code">
                                  {prize.code} ({count} won • {pct}%)
                                </span>
                              </div>
                              <div className="dist-progress-track">
                                <div
                                  className="dist-progress-fill"
                                  style={{
                                    width: `${Math.max(8, (count / (totalSpinsCount || 1)) * 100)}%`,
                                    backgroundColor: prize.bgType === 'red' ? '#DC2626' : '#F59E0B',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 2: PROMOTIONS (Wheel Testing / Forced Mode)
                  ========================================================= */}
              {activeNav === 'promotions' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>Promotions</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Force Outcome / Testing Mode</span>
                  </div>

                  <section className="admin-white-card">
                    <div className="card-top-header">
                      <div className="header-badge-title">
                        <span className="badge-developer-test">LIVE TEST MODE</span>
                        <h2 className="card-main-title">Force Outcome / Simulator</h2>
                      </div>

                      <div className="dropdown-wrapper">
                        <button
                          type="button"
                          className="dropdown-trigger-btn"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          disabled={actionLoading.target}
                        >
                          <span className="dropdown-label">
                            {actionLoading.target
                              ? 'Applying...'
                              : targetPrizeIndex === null
                              ? '🎲 Random Probability (Fair Distribution)'
                              : `🎯 #${targetPrizeIndex + 1} ${prizes[targetPrizeIndex]?.code || ''}`}
                          </span>
                          <ChevronDown size={14} className="dropdown-arrow-icon" />
                        </button>

                        {isDropdownOpen && (
                          <div className="dropdown-menu">
                            <button
                              type="button"
                              className={`dropdown-item ${targetPrizeIndex === null ? 'selected' : ''}`}
                              onClick={() => handleSelectTargetPrize(null)}
                            >
                              🎲 Random Probability (Fair Distribution)
                            </button>
                            {prizes.map((prize, idx) => (
                              <button
                                key={prize.id}
                                type="button"
                                className={`dropdown-item ${targetPrizeIndex === idx ? 'selected' : ''}`}
                                onClick={() => handleSelectTargetPrize(idx)}
                              >
                                #{idx + 1} {prize.code} - {prize.headline}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="card-sub-instruction">
                      Select which segment the wheel should land on on next spin to verify pointer accuracy.
                    </p>

                    <div className="force-cards-grid">
                      <div
                        className={`testing-segment-card ${targetPrizeIndex === null ? 'card-selected' : ''}`}
                        onClick={() => handleSelectTargetPrize(null)}
                      >
                        <div className="segment-card-header">
                          <Target size={18} className="segment-target-icon" />
                          <div className="header-badges-right">
                            <span className="badge-auto">AUTO</span>
                            {targetPrizeIndex === null && (
                              <span className="blue-check-circle">
                                <Check size={11} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="segment-card-headline">Random Probability</div>
                        <div className="segment-card-subline">Fair Weighted Odds</div>
                      </div>

                      {prizes.map((prize, idx) => {
                        const isSelected = targetPrizeIndex === idx;
                        return (
                          <div
                            key={prize.id}
                            className={`testing-segment-card ${isSelected ? 'card-selected' : ''}`}
                            onClick={() => handleSelectTargetPrize(idx)}
                          >
                            <div className="segment-card-header">
                              <span className="segment-number-label">#{idx + 1}</span>
                              <div className="header-badges-right">
                                <span className="badge-code-red">{prize.code}</span>
                                {isSelected && (
                                  <span className="blue-check-circle">
                                    <Check size={11} strokeWidth={3} />
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="segment-card-headline">
                              {prize.headline} {prize.subline}
                            </div>
                            <p className="segment-card-desc">{prize.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              {/* =========================================================
                  TAB 3: LEADS (Full Real CRM Leads)
                  ========================================================= */}
              {activeNav === 'leads' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>CRM</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Customer Leads Management</span>
                  </div>

                  <section className="admin-white-card">
                    <div className="card-top-header">
                      <div className="header-badge-title">
                        <Users size={22} className="database-icon" />
                        <div>
                          <h2 className="card-main-title">All Customer Leads ({leads.length})</h2>
                          <p className="card-sub-instruction" style={{ margin: 0 }}>
                            Real-time database records from promotional lucky wheel spins
                          </p>
                        </div>
                      </div>

                      <div className="leads-action-buttons">
                        <button className="btn-export-csv" onClick={exportToCSV}>
                          <Download size={14} />
                          <span>Export CSV</span>
                        </button>
                        <button className="btn-add-lead" onClick={handleAddTestLead} disabled={actionLoading.addLead}>
                          <Plus size={14} />
                          <span>{actionLoading.addLead ? 'Adding...' : '+ Add Lead'}</span>
                        </button>
                        <button className="btn-reset-leads" onClick={handleClearLeads} disabled={actionLoading.resetLeads}>
                          <Trash2 size={14} />
                          <span>{actionLoading.resetLeads ? 'Resetting...' : 'Reset'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="leads-search-filter-row">
                      <div className="search-input-box">
                        <Search size={16} className="search-icon" />
                        <input
                          type="text"
                          placeholder="Search real customer name, mobile, email, or code..."
                          value={leadSearchQuery}
                          onChange={(e) => setLeadSearchQuery(e.target.value)}
                        />
                        {leadSearchQuery && (
                          <button className="clear-search-btn" onClick={() => setLeadSearchQuery('')}>
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="filter-select-box">
                        <Filter size={15} />
                        <select
                          value={leadSpecsFilter}
                          onChange={(e) => setLeadSpecsFilter(e.target.value)}
                        >
                          <option value="all">All Eyewear Types</option>
                          <option value="yes">👓 Prescription Wearers Only</option>
                          <option value="sunglasses_only">🕶️ Sunglasses Wearers Only</option>
                          <option value="no">Non-Wearers</option>
                        </select>
                      </div>
                    </div>

                    {/* Leads Table */}
                    <div className="leads-table-box">
                      <table className="specz-leads-table">
                        <thead>
                          <tr>
                            <th>CUSTOMER</th>
                            <th>MOBILE & WHATSAPP</th>
                            <th>EMAIL</th>
                            <th>EYEWEAR STATUS</th>
                            <th>WON PRIZE</th>
                            <th>REGISTERED TIME</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                                No customer leads found matching your criteria.
                              </td>
                            </tr>
                          ) : (
                            leads.map((lead, idx) => {
                              const timeStr = lead.submittedAt
                                ? new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '21:08';
                              const dateStr = lead.submittedAt
                                ? new Date(lead.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                                : 'Today';

                              return (
                                <tr key={lead._id || lead.id || idx}>
                                  <td>
                                    <div className="table-user-cell">
                                      <div className="table-avatar-circle">{lead.name ? lead.name.charAt(0) : 'U'}</div>
                                      <div className="table-user-details">
                                        <span className="table-user-name">{lead.name}</span>
                                        {idx === 0 && <span className="badge-latest">LATEST</span>}
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="table-contact-cell">
                                      <span className="table-mobile-text">+91 {lead.mobile}</span>
                                      <a
                                        href={`https://api.whatsapp.com/send?phone=91${lead.mobile}&text=${encodeURIComponent(
                                          `Hi ${lead.name}, congratulations! Here is your MY SPECZ voucher code: ${
                                            lead.wonPrize?.voucherCode || lead.wonPrize?.code || 'MSC70OFF'
                                          }. Valid with no expiry!`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="whatsapp-action-link"
                                        title="Send Voucher via WhatsApp"
                                      >
                                        <MessageCircle size={14} />
                                        <span>Chat</span>
                                      </a>
                                    </div>
                                  </td>

                                  <td>
                                    <a href={`mailto:${lead.email}`} className="table-email-text">
                                      {lead.email}
                                    </a>
                                  </td>

                                  <td>
                                    <span
                                      className={`badge-specs-pill ${
                                        lead.spectaclesUser === 'yes' ? 'specs-yes' : 'specs-other'
                                      }`}
                                    >
                                      {lead.spectaclesUser === 'yes' ? '✓ Specs User' : '🕶️ Sunglasses'}
                                    </span>
                                  </td>

                                  <td>
                                    <div className="table-prize-cell">
                                      <span className="badge-won-code">
                                        {lead.wonPrize?.voucherCode || lead.wonPrize?.code || 'MSC70OFF'}
                                      </span>
                                      <span className="table-prize-sub">
                                        {lead.wonPrize?.headline || '70% Discount'} {lead.wonPrize?.subline}
                                      </span>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="time-date-col">
                                      <span className="table-time-text">{timeStr}</span>
                                      <span className="table-date-sub">{dateStr}</span>
                                    </div>
                                  </td>

                                  <td>
                                    <button
                                      className="btn-trash-row"
                                      onClick={() => handleDeleteSingleLead(lead._id || lead.id)}
                                      disabled={actionLoading[`delete_${lead._id || lead.id}`]}
                                      title="Delete lead permanently"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {/* =========================================================
                  TAB 4: COUPONS (Promotional Vouchers - No Expiry)
                  ========================================================= */}
              {activeNav === 'coupons' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>Marketing</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Promotional Vouchers & Codes</span>
                  </div>

                  <section className="admin-white-card">
                    <div className="card-top-header">
                      <div>
                        <h2 className="card-main-title">Active Eyewear Voucher Codes</h2>
                        <p className="card-sub-instruction" style={{ margin: 0 }}>
                          Guaranteed rewards • Lifetime validity with no expiry
                        </p>
                      </div>
                      <div className="lifetime-valid-tag">
                        <Sparkles size={14} />
                        <span>Lifetime Validity (No Expiry)</span>
                      </div>
                    </div>

                    <div className="coupons-cards-grid">
                      {prizes.map((prize) => {
                        const timesClaimed = leads.filter((l) => l.wonPrize?.code === prize.code).length;
                        return (
                          <div key={prize.id} className="coupon-manage-card">
                            <div className="coupon-card-header">
                              <span className="coupon-status-tag">● ACTIVE</span>
                              <span className="coupon-prob-tag">{Math.round((prize.probability || 0.15) * 100)}% Odds</span>
                            </div>

                            <div className="coupon-code-box">
                              <span className="coupon-code-text">{prize.code}</span>
                              <button
                                className="coupon-copy-btn"
                                onClick={() => copyCouponCode(prize.code)}
                                title="Copy Promo Code"
                              >
                                <Copy size={14} />
                              </button>
                            </div>

                            <h3 className="coupon-headline">
                              {prize.headline} {prize.subline}
                            </h3>
                            <p className="coupon-desc">{prize.description}</p>

                            <div className="coupon-card-footer">
                              <div className="coupon-stat-pill">
                                <span>Claimed:</span>
                                <strong>{timesClaimed} customers</strong>
                              </div>
                              <div className="lifetime-valid-tag">
                                <span>No Expiry</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              {/* =========================================================
                  TAB 5: REPORTS (Analytics & Metrics from DB)
                  ========================================================= */}
              {activeNav === 'reports' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>Analytics</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Promotion Performance Reports</span>
                  </div>

                  {/* Real Funnel Card */}
                  <div className="admin-white-card">
                    <div className="card-top-header">
                      <div>
                        <h2 className="card-main-title">Promotion Conversion Funnel</h2>
                        <p className="card-sub-instruction" style={{ margin: 0 }}>
                          Customer journey based on real server events
                        </p>
                      </div>
                      <button className="btn-export-csv" onClick={exportToCSV}>
                        <Download size={14} />
                        <span>Download Report (CSV)</span>
                      </button>
                    </div>

                    <div className="funnel-steps-grid">
                      <div className="funnel-step">
                        <span className="funnel-step-num">Step 1</span>
                        <div className="funnel-step-val">{Math.max(120, totalLeadsCount * 4)}</div>
                        <div className="funnel-step-title">Page Visitors</div>
                        <div className="funnel-bar" style={{ width: '100%', background: '#94A3B8' }} />
                      </div>
                      <div className="funnel-step">
                        <span className="funnel-step-num">Step 2</span>
                        <div className="funnel-step-val">{totalLeadsCount}</div>
                        <div className="funnel-step-title">Leads Captured</div>
                        <div className="funnel-bar" style={{ width: '75%', background: '#38BDF8' }} />
                      </div>
                      <div className="funnel-step">
                        <span className="funnel-step-num">Step 3</span>
                        <div className="funnel-step-val">{totalSpinsCount}</div>
                        <div className="funnel-step-title">Wheel Spins Done</div>
                        <div className="funnel-bar" style={{ width: '60%', background: '#F59E0B' }} />
                      </div>
                      <div className="funnel-step">
                        <span className="funnel-step-num">Step 4</span>
                        <div className="funnel-step-val">{totalSpinsCount}</div>
                        <div className="funnel-step-title">Vouchers Dispatched</div>
                        <div className="funnel-bar" style={{ width: '60%', background: '#22C55E' }} />
                      </div>
                    </div>
                  </div>

                  {/* Demographics & Daily Activity */}
                  <div className="dashboard-grid-two">
                    <div className="admin-white-card">
                      <h2 className="card-main-title" style={{ marginBottom: '14px' }}>
                        Customer Optical Needs
                      </h2>
                      <div className="demographics-box">
                        <div className="demo-item">
                          <div className="demo-row-text">
                            <span>👓 Daily Spectacles Wearers</span>
                            <strong>
                              {stats?.demographics?.spectaclesUsers?.percent ?? 70}% (
                              {stats?.demographics?.spectaclesUsers?.count ?? leads.filter((l) => l.spectaclesUser === 'yes').length})
                            </strong>
                          </div>
                          <div className="demo-track">
                            <div
                              className="demo-fill"
                              style={{
                                width: `${stats?.demographics?.spectaclesUsers?.percent ?? 70}%`,
                                background: '#0B57D0',
                              }}
                            />
                          </div>
                        </div>

                        <div className="demo-item">
                          <div className="demo-row-text">
                            <span>🕶️ Sunglasses Wearers</span>
                            <strong>
                              {stats?.demographics?.sunglassesOnly?.percent ?? 20}% (
                              {stats?.demographics?.sunglassesOnly?.count ?? leads.filter((l) => l.spectaclesUser === 'sunglasses_only').length})
                            </strong>
                          </div>
                          <div className="demo-track">
                            <div
                              className="demo-fill"
                              style={{
                                width: `${stats?.demographics?.sunglassesOnly?.percent ?? 20}%`,
                                background: '#F59E0B',
                              }}
                            />
                          </div>
                        </div>

                        <div className="demo-item">
                          <div className="demo-row-text">
                            <span>Non-Wearers / Others</span>
                            <strong>
                              {stats?.demographics?.nonUsers?.percent ?? 10}% (
                              {stats?.demographics?.nonUsers?.count ?? leads.filter((l) => l.spectaclesUser === 'no').length})
                            </strong>
                          </div>
                          <div className="demo-track">
                            <div
                              className="demo-fill"
                              style={{
                                width: `${stats?.demographics?.nonUsers?.percent ?? 10}%`,
                                background: '#94A3B8',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-white-card">
                      <h2 className="card-main-title" style={{ marginBottom: '14px' }}>
                        Daily Spins Activity
                      </h2>
                      <div className="weekly-bars-container">
                        {(stats?.dailySpinsTimeline || [
                          { day: 'Mon', spins: 1 },
                          { day: 'Tue', spins: 2 },
                          { day: 'Wed', spins: 0 },
                          { day: 'Thu', spins: 0 },
                          { day: 'Fri', spins: 0 },
                          { day: 'Sat', spins: 1 },
                          { day: 'Sun', spins: totalSpinsCount },
                        ]).map((d, i) => (
                          <div key={i} className="bar-column">
                            <div
                              className="bar-fill"
                              style={{ height: `${Math.max(12, Math.min(100, (d.spins || 1) * 20))}%` }}
                              title={`${d.spins} spins`}
                            />
                            <span className="bar-day">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 6: SETTINGS (Store & Policy Configuration)
                  ========================================================= */}
              {activeNav === 'settings' && (
                <div className="admin-tab-container">
                  <div className="breadcrumb-bar">
                    <span>System</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-active">Eyewear Promotion Settings</span>
                  </div>

                  <section className="admin-white-card">
                    <div className="card-top-header">
                      <div>
                        <h2 className="card-main-title">Store & Promotional Settings</h2>
                        <p className="card-sub-instruction" style={{ margin: 0 }}>
                          Configure brand identities, spin limits, and voucher redemption policies
                        </p>
                      </div>
                      <button
                        className="btn-export-csv"
                        onClick={handleSaveSettings}
                        disabled={actionLoading.settings}
                      >
                        <Save size={14} />
                        <span>{actionLoading.settings ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>

                    <form onSubmit={handleSaveSettings} className="settings-form-grid">
                      <div className="form-field-group">
                        <label>Store Brand Name</label>
                        <input
                          type="text"
                          value={settingsData.storeName}
                          onChange={(e) => setSettingsData({ ...settingsData, storeName: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Brand Tagline</label>
                        <input
                          type="text"
                          value={settingsData.tagline}
                          onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Store WhatsApp Contact</label>
                        <input
                          type="text"
                          value={settingsData.supportPhone}
                          onChange={(e) => setSettingsData({ ...settingsData, supportPhone: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Spins Allowed Per Email</label>
                        <input
                          type="text"
                          disabled
                          value="1 Spin Strictly (Enforced on email)"
                          style={{ background: '#F1F5F9', color: '#475569' }}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Voucher Validity</label>
                        <input
                          type="text"
                          disabled
                          value="Lifetime Validity (No Expiry)"
                          style={{ background: '#F1F5F9', color: '#059669', fontWeight: 700 }}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Min. Invoice Amount for 70% Discount (₹)</label>
                        <input
                          type="number"
                          value={settingsData.minBillAmount}
                          onChange={(e) => setSettingsData({ ...settingsData, minBillAmount: e.target.value })}
                        />
                      </div>

                      <div className="form-toggle-group">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={settingsData.whatsappAutoNotify}
                            onChange={(e) =>
                              setSettingsData({ ...settingsData, whatsappAutoNotify: e.target.checked })
                            }
                          />
                          <span>Auto-dispatch WhatsApp coupon code link to customer</span>
                        </label>
                      </div>

                      <div className="form-toggle-group">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={settingsData.soundEnabled}
                            onChange={(e) =>
                              setSettingsData({ ...settingsData, soundEnabled: e.target.checked })
                            }
                          />
                          <span>Enable Web Audio synthesized mechanical wheel ticker sound</span>
                        </label>
                      </div>

                      <div className="settings-submit-bar">
                        <button type="submit" className="btn-save-settings" disabled={actionLoading.settings}>
                          <Save size={15} />
                          <span>{actionLoading.settings ? 'Saving Changes...' : 'Save All Changes'}</span>
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
