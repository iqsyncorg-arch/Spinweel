import React from 'react';
import { Volume2, VolumeX, UserCheck, X, Gift } from 'lucide-react';

export const Header = ({
  isMuted,
  onToggleMute,
  userLead,
  onEditLead,
  onClearLead,
  onSeeReward,
}) => {
  const displayName = userLead?.name ? userLead.name.split(' ')[0] : null;

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

        {/* Right Action Controls: User Chip (with Clear option) | Sound Toggle */}
        <div className="header-actions">
          {userLead ? (
            <div className="user-chip-group">
              <button
                className="user-profile-chip"
                onClick={userLead.wonPrize && onSeeReward ? onSeeReward : onEditLead}
                title={userLead.wonPrize ? "Click to view your claimed reward" : "Click to view/edit details"}
              >
                <UserCheck size={16} className="user-chip-icon" />
                <div className="user-chip-text">
                  <span className="user-chip-name">{displayName}</span>
                  <span className="user-chip-badge">
                    {userLead.wonPrize ? 'Won 🎁' : 'Eligible'}
                  </span>
                </div>
              </button>

              {userLead.wonPrize && onSeeReward && (
                <button
                  className="chip-see-reward-btn"
                  onClick={onSeeReward}
                  title="View your claimed voucher code"
                  aria-label="See reward"
                >
                  <Gift size={13} className="reward-icon" />
                  <span className="chip-reward-text">See Reward</span>
                </button>
              )}

              {onClearLead && (
                <button
                  className="chip-clear-btn"
                  onClick={onClearLead}
                  title="Clear this user"
                  aria-label="Clear user"
                >
                  <X size={13} className="clear-icon" />
                  <span className="chip-clear-text">Clear</span>
                </button>
              )}
            </div>
          ) : (
            <button
              className="user-profile-chip guest-chip"
              onClick={onEditLead}
              title="Click to enter your details to spin"
            >
              <UserCheck size={16} className="user-chip-icon" />
              <div className="user-chip-text">
                <span className="user-chip-name">Guest</span>
                <span
                  className="user-chip-badge"
                  style={{ background: 'rgba(234, 179, 8, 0.25)', color: '#FDE047' }}
                >
                  Tap to Enter
                </span>
              </div>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            className={`sound-toggle-btn ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
};
