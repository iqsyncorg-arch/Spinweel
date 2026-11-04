import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { PRIZES } from '../data/prizes';
import { sound } from '../utils/audio';
import {
  LOCAL_STORAGE_LEADS_KEY,
  LOCAL_STORAGE_TARGET_KEY,
  INITIAL_LEAD,
  getStoredLeads,
  getStoredTargetIndex,
} from '../data/leadsConfig';
import './AdminPage.css';

const LOCAL_STORAGE_SETTINGS_KEY = 'myspecz_admin_settings_v1';

export const AdminPage = ({ onNavigateHome }) => {
  const [leads, setLeads] = useState(() => getStoredLeads());
  const [targetPrizeIndex, setTargetPrizeIndex] = useState(() => getStoredTargetIndex());
  const [activeNav, setActiveNav] = useState('promotions');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Leads Filter & Search State
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadSpecsFilter, setLeadSpecsFilter] = useState('all');

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      storeName: 'MY SPECZ',
      tagline: 'THE EYE LOVER',
      supportPhone: '+91 7868000645',
      spinsPerDay: '1',
      whatsappAutoNotify: true,
      soundEnabled: true,
      urgencyHours: '24',
      minBillAmount: '1999',
    };
  });

  // Sync targetPrizeIndex to localStorage
  const handleSelectTargetPrize = (index) => {
    sound.playClick();
    setTargetPrizeIndex(index);
    setIsDropdownOpen(false);
    if (index === null) {
      localStorage.removeItem(LOCAL_STORAGE_TARGET_KEY);
      showToast('🎲 Random Probability (Fair Distribution) enabled');
    } else {
      localStorage.setItem(LOCAL_STORAGE_TARGET_KEY, String(index));
      showToast(`🎯 Forced Outcome set to #${index + 1}: ${PRIZES[index].code}`);
    }
  };

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export to CSV spreadsheet
  const exportToCSV = () => {
    sound.playClick();
    if (leads.length === 0) {
      alert('No leads recorded yet!');
      return;
    }

    const headers = ['Name', 'Mobile', 'Email', 'Spectacles User', 'Won Prize', 'Voucher Code', 'Time', 'Submitted At'];
    const rows = leads.map((lead) => {
      const timeStr = lead.submittedAt
        ? new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '21:08';
      return [
        `"${lead.name || ''}"`,
        `"${lead.mobile || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.spectaclesUser === 'yes' ? 'Yes' : lead.spectaclesUser === 'sunglasses_only' ? 'Sunglasses' : 'No'}"`,
        `"${lead.wonPrize?.headline || ''} ${lead.wonPrize?.subline || ''}"`,
        `"${lead.wonPrize?.code || ''}"`,
        `"${timeStr}"`,
        `"${lead.submittedAt || ''}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `myspecz_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV spreadsheet successfully');
  };

  const handleClearLeads = () => {
    sound.playClick();
    if (confirm('Reset leads list to default record?')) {
      setLeads([INITIAL_LEAD]);
      localStorage.removeItem(LOCAL_STORAGE_LEADS_KEY);
      showToast('Leads reset to default record');
    }
  };

  const handleDeleteSingleLead = (indexToRemove) => {
    sound.playClick();
    setLeads((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    showToast('Lead record removed');
  };

  const handleAddTestLead = () => {
    sound.playClick();
    const testNames = ['Rahul Sharma', 'Pooja Patel', 'Vikram Mehta', 'Aisha Khan', 'Deepak Verma', 'Kavita Nair'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    const newLead = {
      id: `lead-${Date.now()}`,
      name: randomName,
      mobile: String(9000000000 + Math.floor(Math.random() * 999999999)),
      email: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      spectaclesUser: Math.random() > 0.3 ? 'yes' : 'sunglasses_only',
      whatsappUpdates: true,
      wonPrize: randomPrize,
      submittedAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Added test lead for ${randomName}`);
  };

  const copyCouponCode = (code) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    showToast(`Copied code: ${code}`);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      showToast('Settings saved successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const q = leadSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.mobile.includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.wonPrize?.code && lead.wonPrize.code.toLowerCase().includes(q));

    const matchesSpecs =
      leadSpecsFilter === 'all' ||
      (leadSpecsFilter === 'yes' && lead.spectaclesUser === 'yes') ||
      (leadSpecsFilter === 'sunglasses_only' && lead.spectaclesUser === 'sunglasses_only') ||
      (leadSpecsFilter === 'no' && lead.spectaclesUser === 'no');

    return matchesQuery && matchesSpecs;
  });

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
            <Glasses size={26} className="brand-glasses-svg" />
            <div className="brand-titles">
              <span className="brand-main">Specz Admin</span>
              <span className="brand-sub">Eyewear Promotions</span>
            </div>
          </div>
        </div>

        <div className="topbar-right">
          {/* Notification Bell */}
          <div className="bell-btn-wrap" title="Notifications">
            <Bell size={18} className="bell-icon" />
            <span className="bell-dot" />
          </div>

          {/* User Profile Menu */}
          <div className="user-profile-menu">
            <div className="user-avatar-circle">S</div>
            <div className="user-info-col">
              <span className="user-fullname">Sanjay S N</span>
              <span className="user-role-label">Admin</span>
            </div>
            <ChevronDown size={14} className="user-dropdown-arrow" />
          </div>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="specz-body-layout">
        {/* Left Sidebar */}
        <aside className="specz-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('dashboard')}
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'promotions' ? 'active' : ''}`}
              onClick={() => setActiveNav('promotions')}
            >
              <Gift size={18} className="nav-icon" />
              <span>Promotions</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveNav('leads')}
            >
              <Users size={18} className="nav-icon" />
              <span>Leads</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveNav('coupons')}
            >
              <Ticket size={18} className="nav-icon" />
              <span>Coupons</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveNav('reports')}
            >
              <BarChart3 size={18} className="nav-icon" />
              <span>Reports</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('settings')}
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

              {/* KPI Cards */}
              <div className="kpi-cards-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">TOTAL SPINS</span>
                    <span className="kpi-badge-green">+18% today</span>
                  </div>
                  <div className="kpi-value">{140 + leads.length}</div>
                  <div className="kpi-subtext">Across mobile & desktop visitors</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">LEADS CAPTURED</span>
                    <span className="kpi-badge-blue">100% Verified</span>
                  </div>
                  <div className="kpi-value">{leads.length}</div>
                  <div className="kpi-subtext">Phone & Email verified entries</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">ACTIVE PROMOTIONS</span>
                    <span className="kpi-badge-gold">7 Segments</span>
                  </div>
                  <div className="kpi-value">7 Prizes</div>
                  <div className="kpi-subtext">Guaranteed discount per spin</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">CLAIM RATE</span>
                    <span className="kpi-badge-purple">WhatsApp Dispatched</span>
                  </div>
                  <div className="kpi-value">84.2%</div>
                  <div className="kpi-subtext">High in-store redemption intent</div>
                </div>
              </div>

              {/* 2 Column Dashboard Section */}
              <div className="dashboard-grid-two">
                {/* Quick Actions & Recent Activity */}
                <div className="admin-white-card">
                  <div className="card-top-header">
                    <h2 className="card-main-title">Live Recent Activity</h2>
                    <span className="badge-live-pulse">● LIVE STREAM</span>
                  </div>
                  <div className="recent-activity-list">
                    {leads.slice(0, 5).map((l, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="activity-avatar">{l.name.charAt(0)}</div>
                        <div className="activity-info">
                          <strong>{l.name}</strong> won{' '}
                          <span className="activity-prize-tag">
                            {l.wonPrize?.headline || '70% OFF'} ({l.wonPrize?.code || 'MSC70OFF'})
                          </span>
                        </div>
                        <div className="activity-time">
                          {l.submittedAt
                            ? new Date(l.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '21:08'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="quick-actions-bar">
                    <button className="btn-quick-action" onClick={() => setActiveNav('promotions')}>
                      <span>🎯 Force Testing Mode</span>
                    </button>
                    <button className="btn-quick-action" onClick={() => setActiveNav('leads')}>
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
                    <span className="card-sub-instruction" style={{ margin: 0 }}>All 7 Offers</span>
                  </div>
                  <div className="prize-distribution-list">
                    {PRIZES.map((prize, idx) => {
                      const count = leads.filter((l) => l.wonPrize?.id === prize.id).length;
                      const pct = Math.round((prize.probability || 0.15) * 100);
                      return (
                        <div key={prize.id} className="prize-dist-item">
                          <div className="dist-title-row">
                            <span className="dist-name">
                              #{idx + 1} {prize.headline} {prize.subline}
                            </span>
                            <span className="dist-code">{prize.code} ({pct}%)</span>
                          </div>
                          <div className="dist-progress-track">
                            <div
                              className="dist-progress-fill"
                              style={{
                                width: `${Math.max(12, pct * 2)}%`,
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
              TAB 2: PROMOTIONS (Exact Reference Page)
              ========================================================= */}
          {activeNav === 'promotions' && (
            <div className="admin-tab-container">
              {/* Breadcrumb */}
              <div className="breadcrumb-bar">
                <span>Promotions</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-active">Force Outcome / Testing Mode</span>
              </div>

              {/* Card 1: Force Outcome / Testing Mode */}
              <section className="admin-white-card">
                <div className="card-top-header">
                  <div className="header-badge-title">
                    <span className="badge-developer-test">DEVELOPER TEST</span>
                    <h2 className="card-main-title">Force Outcome / Testing Mode</h2>
                  </div>

                  {/* Dropdown Selector */}
                  <div className="dropdown-wrapper">
                    <button
                      type="button"
                      className="dropdown-trigger-btn"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="dropdown-label">
                        {targetPrizeIndex === null
                          ? '🎲 Random Probability (Fair Distribution)'
                          : `🎯 #${targetPrizeIndex + 1} ${PRIZES[targetPrizeIndex].code}`}
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
                        {PRIZES.map((prize, idx) => (
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
                  Select which segment the wheel should land on to verify pointer accuracy and prizes.
                </p>

                {/* 2-Row Grid: Row 1 has 4 cards, Row 2 has 4 cards */}
                <div className="force-cards-grid">
                  {/* Card 0: Random Probability */}
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
                    <div className="segment-card-subline">Weighted Odds</div>
                  </div>

                  {/* Cards 1 to 7 */}
                  {PRIZES.map((prize, idx) => {
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

              {/* Card 2: Captured Leads (1) */}
              <section className="admin-white-card" id="captured-leads-card">
                <div className="card-top-header">
                  <div className="header-badge-title">
                    <Database size={20} className="database-icon" />
                    <h2 className="card-main-title">Captured Leads ({leads.length})</h2>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="leads-action-buttons">
                    <button className="btn-export-csv" onClick={exportToCSV} title="Export CSV spreadsheet">
                      <Download size={14} />
                      <span>Export CSV</span>
                    </button>

                    <button className="btn-add-lead" onClick={handleAddTestLead} title="Add simulated lead">
                      <Plus size={14} />
                      <span>Add Test Lead</span>
                    </button>

                    <button className="btn-reset-leads" onClick={handleClearLeads} title="Reset to initial test entry">
                      <Trash2 size={14} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="leads-table-box">
                  <table className="specz-leads-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>MOBILE</th>
                        <th>EMAIL</th>
                        <th>SPECTACLES USER</th>
                        <th>WON PRIZE</th>
                        <th>TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => {
                        const timeFormatted = lead.submittedAt
                          ? new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '21:08';

                        return (
                          <tr key={lead.id || i}>
                            {/* Name & Avatar */}
                            <td>
                              <div className="table-user-cell">
                                <div className="table-avatar-circle">{lead.name.charAt(0)}</div>
                                <div className="table-user-details">
                                  <span className="table-user-name">{lead.name}</span>
                                  {i === 0 && <span className="badge-latest">LATEST</span>}
                                </div>
                              </div>
                            </td>

                            {/* Mobile */}
                            <td>
                              <span className="table-mobile-text">+91 {lead.mobile}</span>
                            </td>

                            {/* Email */}
                            <td>
                              <span className="table-email-text" title={lead.email}>
                                {lead.email.length > 18 ? `${lead.email.slice(0, 14)}...` : lead.email}
                              </span>
                            </td>

                            {/* Spectacles User */}
                            <td>
                              <span
                                className={`badge-specs-pill ${
                                  lead.spectaclesUser === 'yes' ? 'specs-yes' : 'specs-other'
                                }`}
                              >
                                {lead.spectaclesUser === 'yes' ? '✓ Yes' : 'Sunglasses'}
                              </span>
                            </td>

                            {/* Won Prize */}
                            <td>
                              {lead.wonPrize ? (
                                <div className="table-prize-cell">
                                  <span className="badge-won-code">{lead.wonPrize.code}</span>
                                  <span className="table-prize-sub">
                                    {lead.wonPrize.headline} {lead.wonPrize.subline}
                                  </span>
                                </div>
                              ) : (
                                <span className="table-pending-pill">Pending Spin</span>
                              )}
                            </td>

                            {/* Time */}
                            <td>
                              <span className="table-time-text">{timeFormatted}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================
              TAB 3: LEADS (Full CRM View)
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
                      <h2 className="card-main-title">All Customer Leads ({filteredLeads.length})</h2>
                      <p className="card-sub-instruction" style={{ margin: 0 }}>
                        Real-time verified leads from promotional lucky wheel spins
                      </p>
                    </div>
                  </div>

                  <div className="leads-action-buttons">
                    <button className="btn-export-csv" onClick={exportToCSV}>
                      <Download size={14} />
                      <span>Export CSV</span>
                    </button>
                    <button className="btn-add-lead" onClick={handleAddTestLead}>
                      <Plus size={14} />
                      <span>+ Add Lead</span>
                    </button>
                    <button className="btn-reset-leads" onClick={handleClearLeads}>
                      <Trash2 size={14} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="leads-search-filter-row">
                  <div className="search-input-box">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by customer name, mobile, email, or code..."
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
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                            No customer leads found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead, idx) => {
                          const timeStr = lead.submittedAt
                            ? new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '21:08';
                          const dateStr = lead.submittedAt
                            ? new Date(lead.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                            : 'Today';

                          return (
                            <tr key={lead.id || idx}>
                              <td>
                                <div className="table-user-cell">
                                  <div className="table-avatar-circle">{lead.name.charAt(0)}</div>
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
                                      `Hi ${lead.name}, here is your voucher code: ${lead.wonPrize?.code || 'MSC70OFF'} for MY SPECZ!`
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
                                  {lead.spectaclesUser === 'yes' ? '✓ Specs User' : '🕶️ Sunglasses Only'}
                                </span>
                              </td>

                              <td>
                                <div className="table-prize-cell">
                                  <span className="badge-won-code">{lead.wonPrize?.code || 'MSC70OFF'}</span>
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
                                  onClick={() => handleDeleteSingleLead(idx)}
                                  title="Delete lead"
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
              TAB 4: COUPONS (Promotional Vouchers Manager)
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
                      All promotional discounts redeemable at MY SPECZ stores and website
                    </p>
                  </div>
                  <button className="btn-export-csv" onClick={() => showToast('All voucher codes are active on the wheel!')}>
                    <Sparkles size={14} />
                    <span>7 Codes Active</span>
                  </button>
                </div>

                <div className="coupons-cards-grid">
                  {PRIZES.map((prize, idx) => {
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
                            <strong>{timesClaimed} times</strong>
                          </div>
                          <div className="coupon-stat-pill">
                            <span>Valid:</span>
                            <strong>24 Hours</strong>
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
              TAB 5: REPORTS (Analytics & Metrics)
              ========================================================= */}
          {activeNav === 'reports' && (
            <div className="admin-tab-container">
              <div className="breadcrumb-bar">
                <span>Analytics</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-active">Promotion Performance Reports</span>
              </div>

              {/* Conversion Funnel Card */}
              <div className="admin-white-card">
                <div className="card-top-header">
                  <div>
                    <h2 className="card-main-title">Promotion Conversion Funnel</h2>
                    <p className="card-sub-instruction" style={{ margin: 0 }}>
                      Customer journey from landing to in-store purchase
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
                    <div className="funnel-step-val">1,280</div>
                    <div className="funnel-step-title">Page Impressions</div>
                    <div className="funnel-bar" style={{ width: '100%', background: '#94A3B8' }} />
                  </div>
                  <div className="funnel-step">
                    <span className="funnel-step-num">Step 2</span>
                    <div className="funnel-step-val">184</div>
                    <div className="funnel-step-title">Lead Form Opened</div>
                    <div className="funnel-bar" style={{ width: '75%', background: '#38BDF8' }} />
                  </div>
                  <div className="funnel-step">
                    <span className="funnel-step-num">Step 3</span>
                    <div className="funnel-step-val">{140 + leads.length}</div>
                    <div className="funnel-step-title">Lucky Spins Done</div>
                    <div className="funnel-bar" style={{ width: '60%', background: '#F59E0B' }} />
                  </div>
                  <div className="funnel-step">
                    <span className="funnel-step-num">Step 4</span>
                    <div className="funnel-step-val">108</div>
                    <div className="funnel-step-title">Vouchers Claimed</div>
                    <div className="funnel-bar" style={{ width: '45%', background: '#22C55E' }} />
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
                        <strong>74%</strong>
                      </div>
                      <div className="demo-track">
                        <div className="demo-fill" style={{ width: '74%', background: '#0B57D0' }} />
                      </div>
                    </div>
                    <div className="demo-item">
                      <div className="demo-row-text">
                        <span>🕶️ Sunglasses & Contact Lenses</span>
                        <strong>21%</strong>
                      </div>
                      <div className="demo-track">
                        <div className="demo-fill" style={{ width: '21%', background: '#F59E0B' }} />
                      </div>
                    </div>
                    <div className="demo-item">
                      <div className="demo-row-text">
                        <span>Family & Non-Wearers</span>
                        <strong>5%</strong>
                      </div>
                      <div className="demo-track">
                        <div className="demo-fill" style={{ width: '5%', background: '#94A3B8' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-white-card">
                  <h2 className="card-main-title" style={{ marginBottom: '14px' }}>
                    Daily Spins Timeline
                  </h2>
                  <div className="weekly-bars-container">
                    {[
                      { day: 'Mon', spins: 28 },
                      { day: 'Tue', spins: 34 },
                      { day: 'Wed', spins: 42 },
                      { day: 'Thu', spins: 38 },
                      { day: 'Fri', spins: 65 },
                      { day: 'Sat', spins: 88 },
                      { day: 'Sun (Today)', spins: 96 },
                    ].map((d, i) => (
                      <div key={i} className="bar-column">
                        <div className="bar-fill" style={{ height: `${d.spins}%` }} title={`${d.spins} spins`} />
                        <span className="bar-day">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 6: SETTINGS (System Configuration)
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
                  <button className="btn-export-csv" onClick={handleSaveSettings}>
                    <Save size={14} />
                    <span>Save Settings</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSettings} className="settings-form-grid">
                  {/* Store Name */}
                  <div className="form-field-group">
                    <label>Store Brand Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    />
                  </div>

                  {/* Brand Tagline */}
                  <div className="form-field-group">
                    <label>Brand Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    />
                  </div>

                  {/* Support Phone / WhatsApp */}
                  <div className="form-field-group">
                    <label>Store WhatsApp Contact</label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    />
                  </div>

                  {/* Max Spins per phone */}
                  <div className="form-field-group">
                    <label>Max Spins Per Customer Phone</label>
                    <select
                      value={settings.spinsPerDay}
                      onChange={(e) => setSettings({ ...settings, spinsPerDay: e.target.value })}
                    >
                      <option value="1">1 Spin per phone (Recommended)</option>
                      <option value="2">2 Spins per phone</option>
                      <option value="unlimited">Unlimited (Testing Mode)</option>
                    </select>
                  </div>

                  {/* Urgency Hours */}
                  <div className="form-field-group">
                    <label>Voucher Validity Duration (Hours)</label>
                    <input
                      type="number"
                      value={settings.urgencyHours}
                      onChange={(e) => setSettings({ ...settings, urgencyHours: e.target.value })}
                    />
                  </div>

                  {/* Minimum Bill Amount */}
                  <div className="form-field-group">
                    <label>Min. Invoice Amount for 70% Discount (₹)</label>
                    <input
                      type="number"
                      value={settings.minBillAmount}
                      onChange={(e) => setSettings({ ...settings, minBillAmount: e.target.value })}
                    />
                  </div>

                  {/* WhatsApp Notifications toggle */}
                  <div className="form-toggle-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.whatsappAutoNotify}
                        onChange={(e) => setSettings({ ...settings, whatsappAutoNotify: e.target.checked })}
                      />
                      <span>Auto-dispatch WhatsApp coupon code link to customer</span>
                    </label>
                  </div>

                  {/* Audio click toggle */}
                  <div className="form-toggle-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                      />
                      <span>Enable Web Audio synthesized mechanical wheel ticker sound</span>
                    </label>
                  </div>

                  <div className="settings-submit-bar">
                    <button type="submit" className="btn-save-settings">
                      <Save size={15} />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default AdminPage;
