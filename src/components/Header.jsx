import React from 'react';
import { Volume2, VolumeX, UserCheck, ShieldAlert } from 'lucide-react';

export const Header = ({
  isMuted,
  onToggleMute,
  userLead,
  onEditLead,
  onOpenAdmin,
  leadsCount = 1,
}) => {
  const displayName = userLead?.name ? userLead.name.split(' ')[0] : 'Sanjay';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo - MY SPECZ THE EYE LOVER */}
        <div className="brand-logo-group">
          <img
            src="/images/myspecz_logo_dark.png"
            alt="MY SPECZ - THE EYE LOVER"
            className="brand-logo-img"
            onError={(e) => {
              // Fallback to cropped logo if dark version has issues
              e.target.src = '/images/myspecz_logo_cropped.png';
              e.target.className = 'brand-logo-img logo-fallback-badge';
            }}
          />
        </div>

        {/* Right Action Controls: Sanjay (Eligible) | Sound Toggle | Leads (1) */}
        <div className="header-actions">
          {/* User lead status chip - Static fix: Sanjay / Eligible */}
          <button
            className="user-profile-chip"
            onClick={onEditLead}
            title="Click to view/edit details"
          >
            <UserCheck size={16} className="user-chip-icon" />
            <div className="user-chip-text">
              <span className="user-chip-name">{displayName}</span>
              <span className="user-chip-badge">Eligible</span>
            </div>
          </button>

          {/* Sound Toggle Button */}
          <button
            className={`sound-toggle-btn ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>

          {/* Admin / Leads Counter Button */}
          <button
            className="admin-toggle-btn"
            onClick={onOpenAdmin}
            title="View captured leads dashboard"
            aria-label="Admin settings"
          >
            <ShieldAlert size={18} />
            <span className="admin-btn-label">Leads ({leadsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
