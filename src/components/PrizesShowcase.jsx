import React from 'react';
import {
  Trophy,
  Gift,
  CreditCard,
  Sparkles,
  Glasses,
  Shield,
  Ticket,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  HeaderGiftGraphic,
  PrizeVisual1,
  PrizeVisual2,
  PrizeVisual3,
  PrizeVisual4,
  PrizeVisual5,
  PrizeVisual6,
  PrizeVisual7,
} from './PrizeIllustrations';

export const PrizesShowcase = ({ wonPrizeId = null }) => {
  return (
    <section className="guaranteed-prizes-section" id="guaranteed-prizes">
      {/* Top Header Row: 3D Gift Box + Headline */}
      <div className="section-hero-header">
        <HeaderGiftGraphic />
        <div className="section-hero-text">
          <div className="section-title-wrap">
            <h2 className="section-main-title">
              Guaranteed Prizes on <span className="highlight-wheel-text">Wheel</span>
              <span className="title-sparkle-burst">
                <Sparkles size={20} className="sparkle-icon-svg" />
              </span>
            </h2>
          </div>
          <p className="section-main-subtext">
            Spin the wheel and win exciting rewards on your eyewear purchase!
          </p>
        </div>
      </div>

      {/* Row 1: 4 Cards */}
      <div className="prizes-row-grid row-four-cols">
        {/* Card 1: 70% Discount on Spectacle */}
        <div
          className={`prize-card card-gold ${
            wonPrizeId === 'msc-70-off' ? 'won-active-glow' : ''
          }`}
        >
          {/* Top Floating Golden Crown Badge */}
          <div className="floating-crown-badge" title="Grand Prize">
            <span className="crown-emoji">👑</span>
          </div>

          <div className="card-top-bar">
            <div className="badge-pill badge-pill-gold-solid">
              <Trophy size={13} className="badge-icon" />
              <span>PRIZE #1</span>
            </div>
            <div className="code-pill code-pill-gold-dashed">MSC70OFF</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">70% Discount</span>
                <span className="headline-sub">on Spectacle</span>
              </h3>
              <p className="card-description">
                Get a massive 70% discount on complete spectacle frames & standard prescription lenses.
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual1 />
            </div>
          </div>
        </div>

        {/* Card 2: Get Powered Sunglasses Free */}
        <div
          className={`prize-card card-red ${
            wonPrizeId === 'msc-sun-free' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-red-dark">
              <Gift size={13} className="badge-icon" />
              <span>PRIZE #2</span>
            </div>
            <div className="code-pill code-pill-red-dashed">MSCSUNFREE</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">Get Powered</span>
                <span className="headline-sub">Sunglasses Free</span>
                <span className="headline-micro">on Your Specz Purchase</span>
              </h3>
              <p className="card-description">
                Complimentary UV-400 powered sunglasses with any premium spectacles purchase!
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual2 />
            </div>
          </div>
        </div>

        {/* Card 3: 10% Hot Cash Back */}
        <div
          className={`prize-card card-cyan ${
            wonPrizeId === 'msc-hot-10' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-cyan-dark">
              <CreditCard size={13} className="badge-icon" />
              <span>PRIZE #3</span>
            </div>
            <div className="code-pill code-pill-cyan-dashed">MSCHOT10</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">10% Hot</span>
                <span className="headline-sub">Cash Back</span>
              </h3>
              <p className="card-description">
                Direct 10% instant cashback credited to your wallet or deducted at billing.
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual3 />
            </div>
          </div>
        </div>

        {/* Card 4: 1st Lens or 1st Frame Free */}
        <div
          className={`prize-card card-crimson ${
            wonPrizeId === 'msc-1st-free' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-crimson-dark">
              <Gift size={13} className="badge-icon" />
              <span>PRIZE #4</span>
            </div>
            <div className="code-pill code-pill-orange-dashed">MSC1STFREE</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">1st Lens or</span>
                <span className="headline-sub">1st Frame Free</span>
              </h3>
              <p className="card-description">
                Buy one complete pair and get your 1st lens or 1st frame completely FREE!
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual4 />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 3 Cards */}
      <div className="prizes-row-grid row-three-cols">
        {/* Card 5: Spectacle Kit Free */}
        <div
          className={`prize-card card-ice-blue ${
            wonPrizeId === 'msc-kit-free' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-blue-dark">
              <Sparkles size={13} className="badge-icon" />
              <span>PRIZE #5</span>
            </div>
            <div className="code-pill code-pill-cyan-dashed">MSCKITFREE</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">Spectacle</span>
                <span className="headline-sub">Kit Free</span>
              </h3>
              <p className="card-description">
                Free deluxe cleaning kit including anti-fog microfiber cloth, screwdriver tool & lens spray.
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual5 />
            </div>
          </div>
        </div>

        {/* Card 6: Sunglasses Free on Contact Lenses* */}
        <div
          className={`prize-card card-gold ${
            wonPrizeId === 'msc-sun-on-cl' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-gold-dark">
              <Glasses size={13} className="badge-icon" />
              <span>PRIZE #6</span>
            </div>
            <div className="code-pill code-pill-gold-dashed">MSCSUNONCL</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">Sunglasses Free</span>
                <span className="headline-sub">on Contact Lenses*</span>
              </h3>
              <p className="card-description">
                Trendy designer sunglasses complimentary with any contact lens purchase of 2 boxes or more.
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual6 />
            </div>
          </div>
        </div>

        {/* Card 7: Extra Mileage (2nd Option) */}
        <div
          className={`prize-card card-steel-blue ${
            wonPrizeId === 'msc-extra-mileage' ? 'won-active-glow' : ''
          }`}
        >
          <div className="card-top-bar">
            <div className="badge-pill badge-pill-steel-dark">
              <Shield size={13} className="badge-icon" />
              <span>PRIZE #7</span>
            </div>
            <div className="code-pill code-pill-gold-dashed">MSCXM2</div>
          </div>

          <div className="card-content-body">
            <div className="card-text-col">
              <h3 className="card-headline">
                <span className="headline-lead">Extra Mileage</span>
                <span className="headline-sub">(2nd Option)</span>
              </h3>
              <p className="card-description">
                Extended 1-Year Coating Warranty + free replacement guarantee on secondary pair.
              </p>
            </div>
            <div className="card-visual-col">
              <PrizeVisual7 />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Strip */}
      <div className="trust-strip-pill-container">
        <div className="trust-strip-item">
          <div className="trust-strip-icon-box">
            <Glasses size={22} className="trust-yellow-icon" />
          </div>
          <span className="trust-strip-label">
            100% Genuine Prescription Lenses
          </span>
        </div>

        <div className="trust-strip-divider" />

        <div className="trust-strip-item">
          <div className="trust-strip-icon-box">
            <Ticket size={22} className="trust-yellow-icon" />
          </div>
          <span className="trust-strip-label">
            Instant Coupon Code on WhatsApp / SMS
          </span>
        </div>

        <div className="trust-strip-divider" />

        <div className="trust-strip-item">
          <div className="trust-strip-icon-box">
            <MapPin size={22} className="trust-yellow-icon" />
          </div>
          <span className="trust-strip-label">
            Redeemable at all Store Locations & Online
          </span>
        </div>
      </div>
    </section>
  );
};
