import React from 'react';

// Header 3D Gift Box + Wheel illustration
export const HeaderGiftGraphic = () => (
  <div className="header-gift-graphic">
    <svg viewBox="0 0 160 120" className="header-gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glow filters */}
        <filter id="giftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="wheelBackGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#EAB308" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A303C" />
          <stop offset="100%" stopColor="#111622" />
        </linearGradient>
        <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <linearGradient id="wheelRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="30%" stopColor="#FACC15" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>

      {/* Background radiant aura */}
      <circle cx="80" cy="55" r="48" fill="url(#wheelBackGlow)" filter="url(#giftGlow)" opacity="0.6" />

      {/* Mini Lucky Wheel behind gift box */}
      <g transform="translate(80, 50)">
        {/* Outer Wheel Rim */}
        <circle cx="0" cy="0" r="42" stroke="url(#wheelRimGrad)" strokeWidth="4" fill="#141A28" />
        {/* 8 wheel spoke lights */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            <circle cx="0" cy="-38" r="2.2" fill="#FEF08A" filter="url(#giftGlow)" />
            <line x1="0" y1="0" x2="0" y2="-36" stroke={i % 2 === 0 ? '#EAB308' : '#B90B1E'} strokeWidth="1.2" strokeOpacity="0.5" />
          </g>
        ))}
        {/* Center metallic hub */}
        <circle cx="0" cy="0" r="10" fill="url(#goldRibbonGrad)" />
      </g>

      {/* Floating golden confetti petals */}
      <path d="M 28 32 Q 32 25 38 29" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="22" r="2" fill="#FEF08A" />
      <circle cx="125" cy="26" r="2.5" fill="#FACC15" />
      <path d="M 122 38 Q 130 35 127 45" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
      <circle cx="138" cy="52" r="1.8" fill="#FEF08A" />

      {/* 3D Luxury Gift Box Container */}
      <g transform="translate(48, 52)">
        {/* Shadow */}
        <ellipse cx="32" cy="56" rx="36" ry="7" fill="#000000" opacity="0.75" />

        {/* Box Base (Dark metallic Charcoal) */}
        <rect x="6" y="24" width="52" height="32" rx="4" fill="url(#goldBoxGrad)" stroke="#384357" strokeWidth="1" />
        
        {/* Vertical Gold Ribbon */}
        <rect x="27" y="24" width="10" height="32" fill="url(#goldRibbonGrad)" />
        {/* Horizontal Gold Ribbon */}
        <rect x="6" y="36" width="52" height="8" fill="url(#goldRibbonGrad)" />

        {/* Box Lid (slight overhang) */}
        <rect x="3" y="16" width="58" height="11" rx="3" fill="url(#goldBoxGrad)" stroke="#4A5568" strokeWidth="1" />
        {/* Lid Ribbon */}
        <rect x="27" y="16" width="10" height="11" fill="url(#goldRibbonGrad)" />

        {/* Large 3D Gold Ribbon Bow on top */}
        {/* Left Loop */}
        <path
          d="M 29 16 C 16 4, 12 10, 28 15 Z"
          fill="url(#goldRibbonGrad)"
          stroke="#FEF08A"
          strokeWidth="0.8"
        />
        {/* Right Loop */}
        <path
          d="M 35 16 C 48 4, 52 10, 36 15 Z"
          fill="url(#goldRibbonGrad)"
          stroke="#FEF08A"
          strokeWidth="0.8"
        />
        {/* Center Ribbon Knot */}
        <ellipse cx="32" cy="16" rx="5" ry="4" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="0.8" />

        {/* Golden Glint Sparkles */}
        <circle cx="28" cy="8" r="1.5" fill="#FFFFFF" />
        <circle cx="36" cy="10" r="1.2" fill="#FFFFFF" />
      </g>
    </svg>
  </div>
);

// Prize #1: Spectacles on Golden Pedestal
export const PrizeVisual1 = () => (
  <div className="prize-visual-wrapper">
    <img
      src="/images/prize_spectacles_pedestal_1793547702372.jpg"
      alt="70% Discount on Spectacle"
      className="prize-photo-img"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    {/* SVG Fallback */}
    <svg viewBox="0 0 160 110" className="prize-svg-fallback" style={{ display: 'none' }}>
      <ellipse cx="80" cy="88" rx="60" ry="14" fill="#D97706" opacity="0.4" />
      <ellipse cx="80" cy="84" rx="54" ry="12" fill="url(#pedestalGrad)" />
      {/* Spectacles outline */}
      <circle cx="55" cy="55" r="22" stroke="#FACC15" strokeWidth="3.5" fill="rgba(255,255,255,0.06)" />
      <circle cx="105" cy="55" r="22" stroke="#FACC15" strokeWidth="3.5" fill="rgba(255,255,255,0.06)" />
      <path d="M 77 52 Q 80 48 83 52" stroke="#FACC15" strokeWidth="3.5" fill="none" />
    </svg>
  </div>
);

// Prize #2: Burgundy / Red Sunglasses
export const PrizeVisual2 = () => (
  <div className="prize-visual-wrapper">
    <img
      src="/images/prize_sunglasses_red_1793547722173.jpg"
      alt="Get Powered Sunglasses Free"
      className="prize-photo-img"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <svg viewBox="0 0 160 110" className="prize-svg-fallback" style={{ display: 'none' }}>
      <ellipse cx="80" cy="92" rx="45" ry="8" fill="#B90B1E" opacity="0.3" />
      <path d="M 32 46 L 75 48 L 72 74 C 55 76 35 70 32 46 Z" fill="#180306" stroke="#EF4444" strokeWidth="2.5" />
      <path d="M 85 48 L 128 46 L 125 70 C 105 76 88 74 85 48 Z" fill="#180306" stroke="#EF4444" strokeWidth="2.5" />
      <line x1="75" y1="48" x2="85" y2="48" stroke="#EF4444" strokeWidth="3" />
    </svg>
  </div>
);

// Prize #3: 10% Hot Cash Back (Blue Wallet with Rupee & Sync icon)
export const PrizeVisual3 = () => (
  <div className="prize-visual-wrapper">
    <img
      src="/images/prize_wallet_cashback_1793547762613.jpg"
      alt="10% Hot Cash Back"
      className="prize-photo-img"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <svg viewBox="0 0 160 110" className="prize-svg-fallback" style={{ display: 'none' }}>
      <rect x="40" y="30" width="80" height="55" rx="10" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
      <text x="65" y="65" fill="#FFFFFF" fontSize="24" fontWeight="bold">₹</text>
    </svg>
  </div>
);

// Prize #4: 1st Lens or 1st Frame Free (Curved Optical Lenses)
export const PrizeVisual4 = () => (
  <div className="prize-visual-wrapper">
    <img
      src="/images/prize_optical_lenses_1793547786717.jpg"
      alt="1st Lens or 1st Frame Free"
      className="prize-photo-img"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <svg viewBox="0 0 160 110" className="prize-svg-fallback" style={{ display: 'none' }}>
      <ellipse cx="65" cy="50" rx="28" ry="32" fill="none" stroke="#C084FC" strokeWidth="3" />
      <ellipse cx="102" cy="62" rx="24" ry="28" fill="none" stroke="#F472B6" strokeWidth="3" />
    </svg>
  </div>
);

// Prize #5: Spectacle Kit Free (Microfiber cloth, spray bottle, precision screwdriver)
export const PrizeVisual5 = () => (
  <div className="prize-visual-wrapper prize-visual-kit">
    <svg viewBox="0 0 160 110" className="kit-illustration-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Spray bottle gradient */}
        <linearGradient id="sprayBottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="40%" stopColor="#334155" />
          <stop offset="80%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        {/* Spray cap gradient */}
        <linearGradient id="sprayCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        {/* Cloth gradient */}
        <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="60%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        {/* Screwdriver metallic */}
        <linearGradient id="screwdriverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Global shadow */}
      <ellipse cx="80" cy="98" rx="65" ry="8" fill="#000000" opacity="0.6" />

      {/* 1. Folded Soft Microfiber Cloth (Left) */}
      <g transform="translate(18, 56) rotate(-8)">
        {/* Shadow under cloth */}
        <polygon points="4,28 42,28 46,36 0,36" fill="#000000" opacity="0.4" />
        {/* Layer 1 (Bottom Fold) */}
        <path
          d="M 2 12 Q 22 15 44 11 L 46 28 Q 24 32 0 27 Z"
          fill="#475569"
        />
        {/* Layer 2 (Middle Roll) */}
        <path
          d="M 4 8 Q 24 11 44 7 L 45 22 Q 24 26 2 21 Z"
          fill="#64748B"
        />
        {/* Layer 3 (Top Fold with realistic texture) */}
        <path
          d="M 6 4 Q 24 7 44 2 L 44 14 Q 24 19 4 14 Z"
          fill="url(#clothGrad)"
          stroke="#E2E8F0"
          strokeWidth="0.5"
        />
        {/* Cloth hem stitch lines */}
        <line x1="8" y1="6" x2="42" y2="4" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
      </g>

      {/* 2. Sleek Dark Lens Cleaner Spray Bottle (Center) */}
      <g transform="translate(74, 20)">
        {/* Bottle Body */}
        <rect x="6" y="28" width="22" height="46" rx="4" fill="url(#sprayBottleGrad)" stroke="#475569" strokeWidth="0.8" />
        {/* Vision Care Specs Logo on bottle */}
        <circle cx="13" cy="42" r="3.2" stroke="#94A3B8" strokeWidth="0.8" fill="none" />
        <circle cx="21" cy="42" r="3.2" stroke="#94A3B8" strokeWidth="0.8" fill="none" />
        <line x1="16.2" y1="42" x2="17.8" y2="42" stroke="#94A3B8" strokeWidth="0.8" />
        <text x="17" y="52" fill="#E2E8F0" fontSize="3.6" fontFamily="sans-serif" fontWeight="700" textAnchor="middle" letterSpacing="0.4">
          LENS CARE
        </text>
        <text x="17" y="58" fill="#94A3B8" fontSize="2.8" fontFamily="sans-serif" textAnchor="middle">
          ANTI-FOG
        </text>

        {/* Neck collar */}
        <rect x="10" y="22" width="14" height="6" rx="1.5" fill="url(#sprayCapGrad)" stroke="#64748B" strokeWidth="0.5" />
        {/* Pump Actuator */}
        <rect x="12" y="14" width="10" height="9" rx="1.5" fill="url(#sprayCapGrad)" stroke="#94A3B8" strokeWidth="0.5" />
        {/* Spray Nozzle Hole */}
        <rect x="8" y="16" width="4" height="3" rx="0.5" fill="#38BDF8" />
        {/* Transparent protective cap outline */}
        <path d="M 9 10 L 25 10 L 25 24 L 9 24 Z" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.7" rx="2" />
      </g>

      {/* 3. Mini Precision Keychain Optical Screwdriver (Right Foreground) */}
      <g transform="translate(98, 70) rotate(-18)">
        {/* Keychain ring */}
        <ellipse cx="46" cy="6" rx="5" ry="5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
        {/* Swivel cap */}
        <rect x="36" y="4" width="6" height="4" rx="1" fill="#475569" stroke="#94A3B8" strokeWidth="0.6" />
        {/* Ribbed Aluminum Body Handle */}
        <rect x="12" y="3" width="25" height="6" rx="1.5" fill="url(#screwdriverGrad)" stroke="#64748B" strokeWidth="0.6" />
        {/* Knurled grip grooves */}
        {[16, 19, 22, 25, 28, 31].map((pos) => (
          <line key={pos} x1={pos} y1="3" x2={pos} y2="9" stroke="#0F172A" strokeWidth="0.8" />
        ))}
        {/* Tapered Chuck */}
        <polygon points="12,3 7,4.5 7,7.5 12,9" fill="#94A3B8" />
        {/* Precision Steel Screwdriver Bit (Phillips) */}
        <rect x="0" y="5" width="7" height="2" fill="#E2E8F0" />
        <polygon points="0,5.2 -3,6 0,6.8" fill="#F8FAFC" />
      </g>
    </svg>
  </div>
);

// Prize #6: Sunglasses on Golden Pedestal with "FREE" Starburst Badge
export const PrizeVisual6 = () => (
  <div className="prize-visual-wrapper prize-visual-pedestal-free">
    <svg viewBox="0 0 160 110" className="sunglasses-free-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Pedestal Gold Gradient */}
        <linearGradient id="pedestalGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#854D0E" />
          <stop offset="35%" stopColor="#EAB308" />
          <stop offset="50%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#713F12" />
        </linearGradient>
        <radialGradient id="pedestalTopGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </radialGradient>
        {/* Starburst badge gradient */}
        <radialGradient id="freeBadgeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </radialGradient>
      </defs>

      {/* Pedestal Shadow */}
      <ellipse cx="78" cy="94" rx="46" ry="10" fill="#000000" opacity="0.65" />

      {/* 3D Cylindrical Golden Pedestal */}
      {/* Pedestal Cylinder Body */}
      <path
        d="M 38 78 L 38 88 C 38 94, 118 94, 118 88 L 118 78 Z"
        fill="url(#pedestalGoldGrad)"
        stroke="#713F12"
        strokeWidth="0.8"
      />
      {/* Pedestal Top Oval */}
      <ellipse cx="78" cy="78" rx="40" ry="10" fill="url(#pedestalTopGrad)" stroke="#FEF08A" strokeWidth="1" />

      {/* Wayfarer Black Sunglasses Displayed on Pedestal */}
      <g transform="translate(38, 48)">
        {/* Sunglasses Cast Shadow */}
        <ellipse cx="40" cy="27" rx="36" ry="5" fill="#000000" opacity="0.5" />

        {/* Left Lens + Frame */}
        <path
          d="M 6 4 C 18 2, 34 3, 37 6 C 39 12, 36 24, 25 25 C 13 26, 4 22, 6 4 Z"
          fill="#090D16"
          stroke="#1E293B"
          strokeWidth="3.2"
        />
        {/* Left Lens Glint reflection */}
        <path d="M 12 8 Q 22 6 28 8" stroke="#FFFFFF" strokeWidth="1.4" strokeOpacity="0.45" strokeLinecap="round" />

        {/* Right Lens + Frame */}
        <path
          d="M 43 6 C 46 3, 62 2, 74 4 C 76 22, 67 26, 55 25 C 44 24, 41 12, 43 6 Z"
          fill="#090D16"
          stroke="#1E293B"
          strokeWidth="3.2"
        />
        {/* Right Lens Glint reflection */}
        <path d="M 52 8 Q 62 6 68 8" stroke="#FFFFFF" strokeWidth="1.4" strokeOpacity="0.45" strokeLinecap="round" />

        {/* Center Keyhole Bridge */}
        <path d="M 37 6 Q 40 4 43 6" stroke="#1E293B" strokeWidth="3" fill="none" />

        {/* Temple Arms (folds resting on pedestal) */}
        <path d="M 6 4 Q -3 10 2 24" stroke="#0F172A" strokeWidth="2.5" fill="none" />
        <path d="M 74 4 Q 83 10 78 24" stroke="#0F172A" strokeWidth="2.5" fill="none" />
      </g>

      {/* Vibrant Golden Starburst "FREE" Badge (Floating Top Right) */}
      <g transform="translate(122, 34)">
        {/* 16-point starburst badge */}
        <path
          d="M 0 -15 L 3 -11 L 8 -13 L 8 -8 L 13 -7 L 11 -2 L 15 2 L 11 5 L 13 10 L 8 9 L 7 14 L 3 11 L 0 15 L -3 11 L -7 14 L -8 9 L -13 10 L -11 5 L -15 2 L -11 -2 L -13 -7 L -8 -8 L -8 -13 L -3 -11 Z"
          fill="url(#freeBadgeGrad)"
          stroke="#CA8A04"
          strokeWidth="1.2"
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"
        />
        {/* Inner ring */}
        <circle cx="0" cy="0" r="10.5" fill="#FACC15" stroke="#A16207" strokeWidth="0.8" />
        <text
          x="0"
          y="3.5"
          fill="#451A03"
          fontSize="7.5"
          fontFamily="Outfit, sans-serif"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.2"
        >
          FREE
        </text>
      </g>
    </svg>
  </div>
);

// Prize #7: Extra Mileage (Golden 3D Metallic Shield with Checkmark)
export const PrizeVisual7 = () => (
  <div className="prize-visual-wrapper prize-visual-shield">
    <svg viewBox="0 0 160 110" className="shield-illustration-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Outer Shield Bevel */}
        <linearGradient id="shieldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="25%" stopColor="#FACC15" />
          <stop offset="50%" stopColor="#CA8A04" />
          <stop offset="75%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        {/* Inner Shield Body Gradient */}
        <linearGradient id="shieldBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="40%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        {/* Golden Checkmark Gradient */}
        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="80" cy="98" rx="35" ry="7" fill="#000000" opacity="0.65" />

      {/* Ambient Glow */}
      <ellipse cx="80" cy="55" rx="38" ry="38" fill="#FACC15" opacity="0.12" filter="blur(10px)" />

      {/* Outer 3D Shield Rim with Gold Bevel */}
      <path
        d="M 80 18 Q 112 18 116 34 C 116 62, 98 84, 80 94 C 62 84, 44 62, 44 34 Q 48 18 80 18 Z"
        fill="url(#shieldRimGrad)"
        stroke="#FEF08A"
        strokeWidth="1.2"
        filter="drop-shadow(0 6px 14px rgba(0,0,0,0.6))"
      />

      {/* Inner Dark Shield Inset */}
      <path
        d="M 80 23 Q 106 23 110 36 C 110 59, 95 78, 80 87 C 65 78, 50 59, 50 36 Q 54 23 80 23 Z"
        fill="url(#shieldBodyGrad)"
        stroke="#78350F"
        strokeWidth="1.5"
      />

      {/* Inner Golden Rim Line */}
      <path
        d="M 80 28 Q 100 28 103 38 C 103 56, 91 71, 80 79 C 69 71, 57 56, 57 38 Q 60 28 80 28 Z"
        fill="none"
        stroke="url(#shieldRimGrad)"
        strokeWidth="1"
        strokeOpacity="0.75"
      />

      {/* Golden 3D Checkmark */}
      <path
        d="M 68 53 L 76 62 L 95 42"
        stroke="url(#checkGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 2px 6px rgba(250, 204, 21, 0.45))"
      />

      {/* Checkmark Specular Glint */}
      <circle cx="76" cy="62" r="1.5" fill="#FFFFFF" />
      <circle cx="95" cy="42" r="1.8" fill="#FFFFFF" />
    </svg>
  </div>
);
