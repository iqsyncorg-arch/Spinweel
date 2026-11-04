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
      return saved ? JSON.parse(saved) : INITIAL_LEAD;
    } catch {
      return INITIAL_LEAD;
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

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  // Called before wheel starts spinning
  const handleSpinStart = () => {
    if (!currentLead) {
      setIsLeadModalOpen(true);
      return false;
    }
    return true;
  };

  // Called when lead form is submitted
  const handleLeadSubmit = (leadData) => {
    setCurrentLead(leadData);
    setLeads((prev) => [leadData, ...prev]);
    setIsLeadModalOpen(false);

    setBannerNotice(`Ready to spin! Good luck, ${leadData.name.split(' ')[0]}! 🎯`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Called when wheel spin finishes
  const handleSpinEnd = (prize) => {
    setWonPrize(prize);

    if (currentLead) {
      const updatedLead = { ...currentLead, wonPrize: prize };
      setCurrentLead(updatedLead);
      setLeads((prev) =>
        prev.map((item, idx) => (idx === 0 ? updatedLead : item))
      );
    }

    setIsPrizeModalOpen(true);
  };

  // Reset for a fresh spin or new visitor
  const handleResetForNewCustomer = () => {
    sound.playClick();
    setCurrentLead(INITIAL_LEAD);
    setWonPrize(null);
    setIsPrizeModalOpen(false);
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
        onOpenAdmin={() => navigateTo('/admin')}
        leadsCount={leads.length}
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
            <div className="lead-verified-pill">
              <CheckCircle size={16} className="verified-icon" />
              <span>
                Playing as <strong>{currentLead.name}</strong> (+91 {currentLead.mobile})
                {currentLead.spectaclesUser === 'yes' ? ' • 👓 Spectacles User' : ''}
              </span>
              <button
                className="change-lead-link"
                onClick={() => setIsLeadModalOpen(true)}
              >
                (Change)
              </button>
            </div>
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
        initialData={currentLead}
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
