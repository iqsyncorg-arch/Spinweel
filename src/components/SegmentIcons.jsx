import React from 'react';

export const SegmentIcon = ({ type, size = 64 }) => {
  switch (type) {
    case 'spectacles': // Segment 0: Black frame spectacles
      return (
        <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="none">
          {/* Left Lens Rim */}
          <rect x="6" y="8" width="38" height="34" rx="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="5.5" />
          {/* Right Lens Rim */}
          <rect x="56" y="8" width="38" height="34" rx="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="5.5" />
          {/* Bridge */}
          <path d="M44 20 Q50 15 56 20" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Temples */}
          <path d="M6 18 L1 15" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
          <path d="M94 18 L99 15" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
          {/* Lens reflection glares */}
          <path d="M12 18 Q20 12 34 16" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 18 Q70 12 84 16" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Yellow spark dots */}
          <circle cx="2" cy="8" r="2.5" fill="#F59E0B" />
          <circle cx="98" cy="8" r="2.5" fill="#F59E0B" />
        </svg>
      );

    case 'sunglasses': // Segment 1: Wayfarer dark sunglasses
      return (
        <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="none">
          <defs>
            <linearGradient id="lensGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D3748" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          {/* Brow Bar & Frame Body */}
          <path
            d="M5 14 Q25 10 50 13 Q75 10 95 14 Q97 22 93 38 Q88 47 62 47 Q53 47 50 34 Q47 47 38 47 Q12 47 7 38 Q3 22 5 14 Z"
            fill="url(#frameGrad)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Left Lens */}
          <path
            d="M12 18 Q28 15 44 19 Q43 40 36 41 Q20 42 13 36 Z"
            fill="url(#lensGrad)"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Right Lens */}
          <path
            d="M56 19 Q72 15 88 18 Q87 36 80 41 Q73 42 57 40 Z"
            fill="url(#lensGrad)"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* White Gloss Highlights */}
          <path d="M16 22 L38 24" stroke="white" strokeWidth="2.5" strokeOpacity="0.75" strokeLinecap="round" />
          <path d="M60 22 L82 24" stroke="white" strokeWidth="2.5" strokeOpacity="0.75" strokeLinecap="round" />
          {/* Warm decorative rays */}
          <path d="M3 33 L-2 36" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M97 33 L102 36" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cashback': // Segment 2: Gold coins stack with Rupee symbol ₹
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 85 70" fill="none">
          <defs>
            <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="goldEdgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Back Left Coin Stack */}
          <g transform="translate(14, 20)">
            <ellipse cx="18" cy="22" rx="18" ry="9" fill="url(#goldEdgeGrad)" />
            <ellipse cx="18" cy="18" rx="18" ry="9" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1" />
            <ellipse cx="18" cy="13" rx="18" ry="9" fill="url(#goldEdgeGrad)" />
            <ellipse cx="18" cy="9" rx="18" ry="9" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1" />
            <ellipse cx="18" cy="4" rx="18" ry="9" fill="url(#goldEdgeGrad)" />
            <ellipse cx="18" cy="0" rx="18" ry="9" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1" />
          </g>
          {/* Front Main Big Coin */}
          <g transform="translate(36, 12)">
            <circle cx="24" cy="24" r="23" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="2" />
            <circle cx="24" cy="24" r="19" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Rupee Symbol ₹ */}
            <text
              x="24"
              y="32"
              textAnchor="middle"
              fill="#78350F"
              fontFamily="Outfit, sans-serif"
              fontWeight="900"
              fontSize="24"
            >
              ₹
            </text>
          </g>
          {/* Sparkles */}
          <path d="M12 12 L14 7 L16 12 L21 14 L16 16 L14 21 L12 16 L7 14 Z" fill="#FDE047" />
          <path d="M72 8 L73.5 4 L75 8 L79 9.5 L75 11 L73.5 15 L72 11 L68 9.5 Z" fill="#FDE047" />
        </svg>
      );

    case 'glasses_outline': // Segment 3: White outline spectacles with sparkles
      return (
        <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="none">
          {/* Left Lens Rim (white outline) */}
          <rect x="7" y="9" width="37" height="33" rx="14" fill="none" stroke="#FFFFFF" strokeWidth="5.5" />
          {/* Right Lens Rim */}
          <rect x="56" y="9" width="37" height="33" rx="14" fill="none" stroke="#FFFFFF" strokeWidth="5.5" />
          {/* Bridge */}
          <path d="M44 22 Q50 16 56 22" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Temples */}
          <path d="M7 20 L2 17" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M93 20 L98 17" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          {/* Yellow spark rays */}
          <path d="M-1 9 L5 12" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          <path d="M1 28 L-4 32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          <path d="M99 9 L93 12" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          <path d="M97 28 L102 32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'gift_kit': // Segment 4: Red gift box with golden ribbon & sparkles
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 80 70" fill="none">
          <defs>
            <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="lidGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Box Body */}
          <rect x="15" y="28" width="50" height="36" rx="4" fill="url(#boxGrad)" />
          {/* Lid */}
          <rect x="11" y="20" width="58" height="12" rx="3" fill="url(#lidGrad)" />
          {/* Vertical Ribbon */}
          <rect x="34" y="20" width="12" height="44" fill="url(#ribbonGrad)" />
          {/* Horizontal Ribbon on Lid */}
          <rect x="11" y="24" width="58" height="4" fill="url(#ribbonGrad)" />
          {/* Golden Bow Knots */}
          <path
            d="M33 20 C22 10 20 2 35 12 C38 15 40 19 40 20 C40 19 42 15 45 12 C60 2 58 10 47 20 Z"
            fill="url(#ribbonGrad)"
            stroke="#92400E"
            strokeWidth="1"
          />
          <circle cx="40" cy="18" r="4.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
          {/* Sparkles */}
          <path d="M8 12 L10 6 L12 12 L18 14 L12 16 L10 22 L8 16 L2 14 Z" fill="#FDE047" />
          <path d="M68 14 L70 8 L72 14 L78 16 L72 18 L70 24 L68 18 L62 16 Z" fill="#FDE047" />
        </svg>
      );

    case 'contact_lenses': // Segment 5: Aqua blue contact lens pair
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 90 55" fill="none">
          <defs>
            <linearGradient id="lensCupGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="lensCupGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Left Lens Cup */}
          <path
            d="M8 26 C8 15 22 15 30 18 C38 21 44 32 38 41 C32 47 14 45 8 26 Z"
            fill="url(#lensCupGrad1)"
            stroke="#E0F2FE"
            strokeWidth="2.5"
          />
          {/* Left Lens Glare */}
          <path d="M14 26 C15 20 23 18 28 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Lens Cup */}
          <path
            d="M44 24 C44 13 58 13 66 16 C74 19 82 30 76 39 C70 46 50 44 44 24 Z"
            fill="url(#lensCupGrad2)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Right Lens Glare */}
          <path d="M50 24 C52 18 60 16 66 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Yellow spark marks */}
          <path d="M4 14 L-1 11" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M84 14 L89 11" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'speedometer': // Segment 6: Red speedometer / gauge with motion dashes
      return (
        <svg width={size} height={size * 0.65} viewBox="0 0 95 60" fill="none">
          {/* Speed motion lines on the left */}
          <path d="M6 22 L20 22" stroke="#B90B1E" strokeWidth="3" strokeLinecap="round" />
          <path d="M12 28 L24 28" stroke="#B90B1E" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M4 35 L18 35" stroke="#B90B1E" strokeWidth="3" strokeLinecap="round" />
          {/* Speedometer Arc */}
          <path
            d="M32 45 A 28 28 0 1 1 82 45"
            stroke="#B90B1E"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tick marks */}
          <line x1="37" y1="40" x2="41" y2="38" stroke="#B90B1E" strokeWidth="2.5" />
          <line x1="45" y1="26" x2="48" y2="30" stroke="#B90B1E" strokeWidth="2.5" />
          <line x1="57" y1="20" x2="57" y2="25" stroke="#B90B1E" strokeWidth="3" />
          <line x1="69" y1="26" x2="66" y2="30" stroke="#B90B1E" strokeWidth="2.5" />
          <line x1="77" y1="40" x2="73" y2="38" stroke="#B90B1E" strokeWidth="2.5" />
          {/* Needle Center Hub */}
          <circle cx="57" cy="45" r="5" fill="#B90B1E" />
          {/* Needle pointing high towards 70-80% */}
          <line x1="57" y1="45" x2="73" y2="28" stroke="#B90B1E" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
};
