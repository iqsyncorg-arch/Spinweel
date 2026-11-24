import React, { useState, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { LeadModal } from './components/LeadModal';
import { PrizeModal } from './components/PrizeModal';
import { Header } from './components/Header';
import { AdminDrawer } from './components/AdminDrawer';
import { PrizesShowcase } from './components/PrizesShowcase';
import { AdminPage } from './pages/AdminPage';
import { PRIZES } from './data/prizes';
import { sound } from './utils/audio';
import { api } from './services/api';
import {
  LOCAL_STORAGE_LEADS_KEY,
  LOCAL_STORAGE_CURRENT_LEAD_KEY,
  LOCAL_STORAGE_TARGET_KEY,
  INITIAL_LEAD,
  getStoredLeads,
  getStoredTargetIndex,
} from './data/leadsConfig';
import { Sparkles, CheckCircle } from 'lucide-react';
import './App.css';

export function App() {
  // Page Routing: check if current URL pathname is /admin
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname.toLowerCase().startsWith('/admin') ? '/admin' : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase().startsWith('/admin') ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [leads, setLeads] = useState(() => getStoredLeads());

  const [currentLead, setCurrentLead] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CURRENT_LEAD_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [targetPrizeIndex, setTargetPrizeIndex] = useState(() => getStoredTargetIndex());
  const [bannerNotice, setBannerNotice] = useState(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitError, setLeadSubmitError] = useState(null);

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Sync currentLead to localStorage
  useEffect(() => {
    try {
      if (currentLead) {
        localStorage.setItem(LOCAL_STORAGE_CURRENT_LEAD_KEY, JSON.stringify(currentLead));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_LEAD_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentLead]);

  // Keep targetPrizeIndex synced from localStorage in case changed on /admin
  useEffect(() => {
    const syncTarget = () => {
      setTargetPrizeIndex(getStoredTargetIndex());
      setLeads(getStoredLeads());
    };
    window.addEventListener('storage', syncTarget);
    return () => window.removeEventListener('storage', syncTarget);
  }, []);

  // Background auto-sync lead status from backend (ensures claimed voucher is in sync)
  useEffect(() => {
    if (currentLead?.email || currentLead?.mobile) {
      const syncLeadStatus = async () => {
        try {
          const res = await api.getLeads({ search: currentLead.email || currentLead.mobile });
          if (res?.data && res.data.length > 0) {
            const matched = res.data.find(
              (l) =>
                (currentLead.email && l.email?.toLowerCase() === currentLead.email.toLowerCase()) ||
                (currentLead.mobile && l.mobile === currentLead.mobile.replace(/\D/g, ''))
            );
            if (matched && matched.wonPrize && !currentLead.wonPrize) {
              const updated = {
                ...currentLead,
                ...matched,
                wonPrize: matched.wonPrize,
                voucherCode: matched.voucherCode || matched.wonPrize?.code,
              };
              setCurrentLead(updated);
              setWonPrize(matched.wonPrize);
            }
          }
        } catch (e) {
          // ignore background sync error
        }
      };
      syncLeadStatus();
    }
  }, []);

  const handleOpenReward = () => {
    sound.playClick();
    if (currentLead?.wonPrize) {
      setWonPrize(currentLead.wonPrize);
    }
    setIsPrizeModalOpen(true);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  // Called before wheel starts spinning (Strict rule: each email spins only once!)
  const handleSpinStart = () => {
    if (!currentLead) {
      setIsLeadModalOpen(true);
      return false;
    }

    if (currentLead.wonPrize) {
      setBannerNotice(
        `ℹ️ ${currentLead.email} has already claimed a reward! Showing your lifetime voucher code.`
      );
      if (currentLead.wonPrize) setWonPrize(currentLead.wonPrize);
      setIsPrizeModalOpen(true);
      return false; // Blocks spinning again with same email
    }

    return true;
  };

  // Called when lead form is submitted - integrates with real backend
  const handleLeadSubmit = async (leadData) => {
    setIsSubmittingLead(true);
    setLeadSubmitError(null);

    try {
      const res = await api.createLead(leadData);

      if (res.alreadySpun && res.data?.wonPrize) {
        // Customer with this email already spun
        setCurrentLead(res.data);
        setWonPrize(res.data.wonPrize);
        setIsLeadModalOpen(false);
        setIsPrizeModalOpen(true);
        setBannerNotice(`ℹ️ ${leadData.email} has already claimed a voucher! Showing your code.`);
      } else {
        const savedLead = res.data || leadData;
        setCurrentLead(savedLead);
        setLeads((prev) => [savedLead, ...prev]);
        setIsLeadModalOpen(false);
        setBannerNotice(`Ready to spin! Good luck, ${leadData.name.split(' ')[0]}! 🎯`);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setCurrentLead(leadData);
      setLeads((prev) => [leadData, ...prev]);
      setIsLeadModalOpen(false);
      setBannerNotice(`Ready to spin! Good luck, ${leadData.name.split(' ')[0]}! 🎯`);
    } finally {
      setIsSubmittingLead(false);
      setTimeout(() => setBannerNotice(null), 5000);
    }
  };

  // Called when wheel spin finishes - save to backend
  const handleSpinEnd = async (prize) => {
    setWonPrize(prize);

    if (currentLead) {
      try {
        const spinRes = await api.executeSpin({
          leadId: currentLead._id || currentLead.id,
          name: currentLead.name,
          email: currentLead.email,
          mobile: currentLead.mobile,
          spectaclesUser: currentLead.spectaclesUser,
          prize: prize,
          prizeCode: prize.code,
          prizeId: prize.id,
          voucherCode: prize.code,
          forceIndex: targetPrizeIndex,
        });

        const updatedLead = spinRes.lead || {
          ...currentLead,
          wonPrize: prize,
          voucherCode: prize.code,
        };
        setCurrentLead(updatedLead);
        setLeads((prev) => [
          updatedLead,
          ...prev.filter((l) => (l._id || l.id) !== (updatedLead._id || updatedLead.id)),
        ]);
        if (spinRes.prize) setWonPrize(spinRes.prize);
      } catch (err) {
        console.error('Error recording spin to server:', err);
        const updatedLead = { ...currentLead, wonPrize: prize, voucherCode: prize.code };
        setCurrentLead(updatedLead);
        setLeads((prev) => [
          updatedLead,
          ...prev.filter((l) => (l._id || l.id) !== (updatedLead._id || updatedLead.id)),
        ]);
      }
    }

    setIsPrizeModalOpen(true);
  };

  // Reset for a fresh spin or new visitor
  const handleResetForNewCustomer = () => {
    sound.playClick();
    setCurrentLead(null);
    setWonPrize(null);
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_LEAD_KEY);
    setIsPrizeModalOpen(false);
    setIsLeadModalOpen(true);
  };

  // Clear current user
  const handleClearUser = async () => {
    sound.playClick();
    if (currentLead) {
      try {
        await api.clearLeadSpin({
          leadId: currentLead._id || currentLead.id,
          email: currentLead.email,
          mobile: currentLead.mobile,
        });
      } catch (err) {
        console.warn('Could not clear backend lead spin:', err.message);
      }
    }
    setCurrentLead(null);
    setWonPrize(null);
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_LEAD_KEY);
    setBannerNotice('User cleared. Enter your details to spin the wheel!');
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // If path is /admin, render dedicated AdminPage
  if (currentPath === '/admin') {
    return <AdminPage onNavigateHome={() => navigateTo('/')} />;
  }

  // Public Spin Wheel Page
  return (
    <div className="app-root">
      {/* Top Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        userLead={currentLead}
        onEditLead={() => setIsLeadModalOpen(true)}
        onClearLead={handleClearUser}
        onSeeReward={handleOpenReward}
      />

      {/* Main Container */}
      <main className="main-content">
        {/* Floating Notification Banner */}
        {bannerNotice && (
          <div className="banner-toast">
            <CheckCircle size={18} />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* Hero Title & Offer Intro */}
        <div className="hero-section">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>SPECTACLE & EYEWEAR FESTIVAL 2026</span>
          </div>
          <h1 className="hero-headline">
            Spin the Golden Wheel & <span className="gold-text">Win Big!</span>
          </h1>
          <p className="hero-subtext">
            Every spin wins guaranteed rewards: <strong>70% OFF</strong>, Free Sunglasses, 1st Lens Free, Cashback & more!
          </p>

          {!currentLead ? (
            <div className="lead-prompt-pill" onClick={() => setIsLeadModalOpen(true)}>
              <span className="lead-prompt-bullet">1</span>
              <span>Fill your details</span>
              <span className="arrow">➔</span>
              <span className="lead-prompt-bullet">2</span>
              <span>Spin the wheel</span>
              <span className="arrow">➔</span>
              <span className="lead-prompt-bullet">3</span>
              <span>Claim your voucher instantly!</span>
            </div>
          ) : (
            <>
              <div className="lead-verified-pill">
                <CheckCircle size={16} className="verified-icon" />
                <span className="lead-verified-details">
                  Playing as <strong>{currentLead.name}</strong> (+91 {currentLead.mobile})
                  {currentLead.spectaclesUser === 'yes' ? ' • 👓 Spectacles User' : ''}
                </span>
                <div className="lead-pill-actions">
                  {currentLead.wonPrize && (
                    <>
                      <button
                        className="see-reward-link"
                        onClick={handleOpenReward}
                        title="View your claimed voucher code"
                      >
                        🎁 (See Reward)
                      </button>
                      <span className="pill-action-sep">•</span>
                    </>
                  )}
                  <button
                    className="change-lead-link"
                    onClick={() => setIsLeadModalOpen(true)}
                    title="Change details"
                  >
                    (Change)
                  </button>
                  <span className="pill-action-sep">•</span>
                  <button
                    className="clear-lead-link"
                    onClick={handleClearUser}
                    title="Clear user"
                  >
                    (Clear)
                  </button>
                </div>
              </div>

              {/* Prominent Claimed Reward Spotlight Card */}
              {currentLead.wonPrize && (
                <div
                  className="claimed-reward-spotlight"
                  onClick={handleOpenReward}
                  role="button"
                  tabIndex={0}
                  title="Click to view voucher code & share on WhatsApp"
                >
                  <div className="spotlight-top-badge">
                    <span className="spotlight-badge-dot" />
                    <span>EXCLUSIVE REWARD CLAIMED • LIFETIME VALIDITY</span>
                  </div>
                  <div className="spotlight-body">
                    <div className="spotlight-gift-icon">🎁</div>
                    <div className="spotlight-info">
                      <div className="spotlight-headline">
                        {currentLead.wonPrize.headline || currentLead.wonPrize.name}
                      </div>
                      <div className="spotlight-voucher-row">
                        <span className="spotlight-voucher-label">Promo Code:</span>
                        <span className="spotlight-voucher-code">
                          {currentLead.voucherCode || currentLead.wonPrize.code}
                        </span>
                        <span className="spotlight-validity">No Expiry</span>
                      </div>
                    </div>
                    <button
                      className="btn-see-reward-spotlight"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReward();
                      }}
                    >
                      <span>See Reward</span>
                      <span className="spotlight-arrow">➔</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Wheel & Visual Arena */}
        <div className="wheel-arena">
          <Wheel
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            targetPrizeIndex={targetPrizeIndex}
            hasWon={!!currentLead?.wonPrize}
            wonPrize={currentLead?.wonPrize}
            onSeeReward={handleOpenReward}
          />
        </div>

        {/* Guaranteed Prizes on Wheel Showcase & Trust Strip */}
        <PrizesShowcase wonPrizeId={wonPrize?.id} />
      </main>

      {/* Lead Capture Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
        isSubmitting={isSubmittingLead}
        submissionError={leadSubmitError}
      />

      {/* Prize Won Modal */}
      <PrizeModal
        isOpen={isPrizeModalOpen}
        prize={wonPrize}
        userLead={currentLead}
        onClose={() => setIsPrizeModalOpen(false)}
        onReset={handleResetForNewCustomer}
      />

      {/* Admin Leads & Test Drawer (Fallback) */}
      <AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        leads={leads}
        onClearLeads={() => {
          setLeads([INITIAL_LEAD]);
          setCurrentLead(INITIAL_LEAD);
          localStorage.removeItem(LOCAL_STORAGE_LEADS_KEY);
          localStorage.removeItem(LOCAL_STORAGE_CURRENT_LEAD_KEY);
        }}
        targetPrizeIndex={targetPrizeIndex}
        onSelectTargetPrize={setTargetPrizeIndex}
      />
    </div>
  );
}

export default App;
