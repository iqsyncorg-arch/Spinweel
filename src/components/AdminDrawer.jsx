import React from 'react';
import { X, Download, Trash2, Settings, Users, Check, RefreshCw } from 'lucide-react';
import { PRIZES } from '../data/prizes';
import { sound } from '../utils/audio';

export const AdminDrawer = ({
  isOpen,
  onClose,
  leads = [],
  onClearLeads,
  targetPrizeIndex,
  onSelectTargetPrize,
}) => {
  if (!isOpen) return null;

  const exportToCSV = () => {
    sound.playClick();
    if (leads.length === 0) {
      alert('No leads recorded yet!');
      return;
    }

    const headers = ['Name', 'Mobile', 'Email', 'Spectacles User', 'Prize Won', 'Voucher Code', 'Submitted At'];
    const rows = leads.map((lead) => [
      `"${lead.name || ''}"`,
      `"${lead.mobile || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.spectaclesUser || ''}"`,
      `"${lead.wonPrize?.headline || ''} ${lead.wonPrize?.subline || ''}"`,
      `"${lead.wonPrize?.code || ''}"`,
      `"${lead.submittedAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `myspecs_wheel_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Settings size={20} className="drawer-icon" />
            <div>
              <h3>Admin & Test Controls</h3>
              <p>Captured Customer Leads & Wheel Simulator</p>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Force Winning Segment / Testing Mode */}
          <section className="drawer-section">
            <div className="section-header">
              <span className="section-badge">DEVELOPER TEST</span>
              <h4>Force Outcome / Testing Mode</h4>
            </div>
            <p className="section-desc">
              Select which segment the wheel should land on to verify pointer accuracy and prizes:
            </p>

            <div className="prize-selector-grid">
              <button
                type="button"
                className={`prize-select-btn ${targetPrizeIndex === null ? 'active' : ''}`}
                onClick={() => onSelectTargetPrize(null)}
              >
                <span>🎲 Random Probability</span>
                {targetPrizeIndex === null && <Check size={16} />}
              </button>

              {PRIZES.map((prize, idx) => (
                <button
                  key={prize.id}
                  type="button"
                  className={`prize-select-btn ${targetPrizeIndex === idx ? 'active' : ''}`}
                  onClick={() => onSelectTargetPrize(idx)}
                >
                  <div className="prize-select-content">
                    <span className="prize-idx">#{idx + 1}</span>
                    <span className="prize-name">
                      {prize.headline} {prize.subline}
                    </span>
                    <span className="prize-code-tag">{prize.code}</span>
                  </div>
                  {targetPrizeIndex === idx && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>

          {/* Captured Leads Table */}
          <section className="drawer-section">
            <div className="section-header">
              <div className="header-left">
                <Users size={18} />
                <h4>Captured Leads ({leads.length})</h4>
              </div>
              <div className="header-actions-row">
                <button
                  className="export-csv-btn"
                  onClick={exportToCSV}
                  disabled={leads.length === 0}
                  title="Export to CSV Spreadsheet"
                >
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
                <button
                  className="clear-btn"
                  onClick={() => {
                    if (confirm('Clear all stored leads?')) {
                      onClearLeads();
                    }
                  }}
                  disabled={leads.length === 0}
                  title="Clear all leads"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="empty-leads-box">
                <p>No leads captured yet. Spin the wheel to test lead registration!</p>
              </div>
            ) : (
              <div className="leads-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Spectacles User</th>
                      <th>Won Prize</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i}>
                        <td className="lead-name-cell">
                          <strong>{lead.name}</strong>
                        </td>
                        <td>{lead.mobile}</td>
                        <td className="lead-email-cell">{lead.email}</td>
                        <td>
                          <span
                            className={`spec-badge ${
                              lead.spectaclesUser === 'yes'
                                ? 'badge-yes'
                                : lead.spectaclesUser === 'sunglasses_only'
                                ? 'badge-sun'
                                : 'badge-no'
                            }`}
                          >
                            {lead.spectaclesUser === 'yes'
                              ? '👓 Yes'
                              : lead.spectaclesUser === 'sunglasses_only'
                              ? '🕶️ Sunglasses'
                              : 'No'}
                          </span>
                        </td>
                        <td>
                          {lead.wonPrize ? (
                            <span className="won-badge">{lead.wonPrize.code}</span>
                          ) : (
                            <span className="pending-badge">Pending Spin</span>
                          )}
                        </td>
                        <td className="time-cell">
                          {lead.submittedAt ? new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
