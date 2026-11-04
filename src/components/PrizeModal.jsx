import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Share2, Sparkles, X, Gift, Clock, ExternalLink } from 'lucide-react';
import { sound } from '../utils/audio';

export const PrizeModal = ({ isOpen, prize, userLead, onClose, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    if (isOpen) {
      // Fire festive confetti cannon
      const count = 200;
      const defaults = {
        origin: { y: 0.65 },
        zIndex: 10000,
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#EAB308', '#B90B1E', '#FFFFFF'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#FDE047', '#DC2626', '#FEF08A'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#EAB308', '#991B1B', '#F59E0B'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Countdown timer simulation
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return prev;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !prize) return null;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(prize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    sound.playClick();
    const text = encodeURIComponent(
      `🎉 I just won "${prize.headline} ${prize.subline}" on MY SPECZ Lucky Wheel! Use voucher code *${prize.code}* at your nearest store!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="prize-modal-card">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        {/* Celebration Header */}
        <div className="prize-celebration-badge">
          <Sparkles size={18} />
          <span>LUCKY WINNER</span>
          <Sparkles size={18} />
        </div>

        <h2 className="prize-title">
          Congratulations{userLead?.name ? `, ${userLead.name.split(' ')[0]}` : ''}! 🎉
        </h2>
        <p className="prize-subtitle">You struck gold on the MY SPECZ Wheel!</p>

        {/* Winning Voucher Card */}
        <div className="voucher-card">
          <div className="voucher-ribbon">EXCLUSIVE REWARD</div>

          <div className="voucher-main">
            <div className="voucher-headline">{prize.headline}</div>
            <div className="voucher-subline">{prize.subline}</div>
            <p className="voucher-description">{prize.description}</p>
          </div>

          {/* Coupon Code Strip */}
          <div className="voucher-code-strip">
            <div className="code-label">PROMO VOUCHER CODE</div>
            <div className="code-box">
              <span className="code-text">{prize.code}</span>
              <button className="copy-code-btn" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Countdown & Expiry */}
          <div className="voucher-expiry-strip">
            <Clock size={15} />
            <span>
              Expires in:{' '}
              <strong>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </strong>
            </span>
          </div>
        </div>

        {/* Delivery status */}
        <div className="prize-delivery-box">
          <div className="delivery-icon">📱</div>
          <div className="delivery-text">
            <span>Sent code to: </span>
            <strong>+91 {userLead?.mobile || 'Registered Mobile'}</strong>
            <span className="delivery-badge">SMS & WhatsApp Dispatched</span>
          </div>
        </div>

        {/* Terms note */}
        <p className="voucher-terms">
          *Note: {prize.terms} Show this voucher on your phone at checkout.
        </p>

        {/* Action Buttons */}
        <div className="prize-actions-row">
          <button className="whatsapp-share-btn" onClick={shareToWhatsApp}>
            <Share2 size={18} />
            <span>Share via WhatsApp</span>
          </button>

          <button className="new-spin-btn" onClick={onReset}>
            <Gift size={18} />
            <span>New Customer Spin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
