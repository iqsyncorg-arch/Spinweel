import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PRIZES } from '../data/prizes';
import { SegmentIcon } from './SegmentIcons';
import { sound } from '../utils/audio';

// 7 segments
const NUM_SEGMENTS = PRIZES.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS; // ~51.4286 deg

export const Wheel = ({ onSpinEnd, isSpinning, setIsSpinning, targetPrizeIndex = null, onSpinStart }) => {
  const wheelRef = useRef(null);
  const currentRotationRef = useRef(0);
  const animFrameRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const lastTickSegmentRef = useRef(-1);

  // Calculate slice path for an angle
  // Segments centered around 0 degrees at 12 o'clock (straight up = -90 deg)
  const getSlicePath = (index, radius = 265) => {
    const halfAngle = (SEGMENT_ANGLE / 2) * (Math.PI / 180);
    const startAngle = -halfAngle - Math.PI / 2;
    const endAngle = halfAngle - Math.PI / 2;

    const x1 = 300 + radius * Math.cos(startAngle);
    const y1 = 300 + radius * Math.sin(startAngle);
    const x2 = 300 + radius * Math.cos(endAngle);
    const y2 = 300 + radius * Math.sin(endAngle);

    return `M 300 300 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  const spin = useCallback(() => {
    if (isSpinning) return;

    if (onSpinStart && !onSpinStart()) {
      return; // Pre-conditions not met (e.g. form not filled)
    }

    setIsSpinning(true);
    sound.playClick();

    // Determine target index
    let winningIndex;
    if (targetPrizeIndex !== null && targetPrizeIndex >= 0 && targetPrizeIndex < NUM_SEGMENTS) {
      winningIndex = targetPrizeIndex;
    } else {
      // Pick based on probabilities
      const rand = Math.random();
      let cumulative = 0;
      winningIndex = 0;
      for (let i = 0; i < PRIZES.length; i++) {
        cumulative += PRIZES[i].probability;
        if (rand <= cumulative) {
          winningIndex = i;
          break;
        }
      }
    }

    // Number of full rotations (between 5 and 8 full spins for excitement)
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const spinDuration = 5200; // ms

    // Segment 0 is at 12 o'clock initially (0 deg).
    // Segment i is at i * SEGMENT_ANGLE clockwise.
    // When wheel rotates by R deg clockwise, the slice that lands at 12 o'clock is:
    // (360 - (R % 360)) / SEGMENT_ANGLE.
    // So to land on winningIndex:
    // R % 360 = (360 - winningIndex * SEGMENT_ANGLE) % 360
    // Add small random offset inside the segment (within ±35% of half-angle)
    const jitter = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.55);
    const targetRemainder = (360 - winningIndex * SEGMENT_ANGLE + jitter + 360) % 360;

    // Current normalized rotation
    const currentRot = currentRotationRef.current;
    const currentMod = ((currentRot % 360) + 360) % 360;

    let delta = targetRemainder - currentMod;
    if (delta <= 0) {
      delta += 360;
    }
    const totalRotationDelta = fullSpins * 360 + delta;
    const startRotation = currentRot;
    const targetTotalRotation = startRotation + totalRotationDelta;

    const startTime = performance.now();

    // Cubic ease-out function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3.2);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / spinDuration);
      const easedProgress = easeOutCubic(progress);

      const currentAngle = startRotation + totalRotationDelta * easedProgress;
      currentRotationRef.current = currentAngle;
      setRotation(currentAngle);

      // Sound tick detection: detect every time a segment peg passes 12 o'clock
      const currentSegment = Math.floor((((currentAngle % 360) + 360) % 360) / SEGMENT_ANGLE);
      if (currentSegment !== lastTickSegmentRef.current) {
        lastTickSegmentRef.current = currentSegment;
        const velocity = 1 - progress; // gets slower
        sound.playTick(velocity);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        sound.playWin();
        if (onSpinEnd) {
          onSpinEnd(PRIZES[winningIndex], winningIndex);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, onSpinEnd, onSpinStart, setIsSpinning, targetPrizeIndex]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="wheel-wrapper">
      {/* Outer Glow Effect */}
      <div className="wheel-ambient-glow" />

      {/* Main SVG Wheel Container */}
      <div className="wheel-stage">
        {/* Top Gold Indicator Pointer */}
        <div className="pointer-container">
          <svg className="pointer-svg" viewBox="0 0 54 68" fill="none">
            <defs>
              <linearGradient id="pointerGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#EAB308" />
                <stop offset="70%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>
              <linearGradient id="pointerEdge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#713F12" />
              </linearGradient>
              <filter id="pointerShadow" x="-30%" y="-20%" width="160%" height="160%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.55" />
              </filter>
            </defs>
            {/* Pointer Body */}
            <g filter="url(#pointerShadow)">
              <path
                d="M4 6 L50 6 L30 62 Q27 67 24 62 L4 6 Z"
                fill="url(#pointerGold)"
                stroke="url(#pointerEdge)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Highlight Bevel */}
              <path d="M27 10 L27 58" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="27" cy="18" r="4.5" fill="#FEF08A" stroke="#854D0E" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* The Rotating Wheel */}
        <div
          ref={wheelRef}
          className="wheel-disc"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg
            className="wheel-svg"
            viewBox="0 0 600 600"
            width="100%"
            height="100%"
          >
            <defs>
              {/* Gold Gradients */}
              <linearGradient id="goldRimOuter" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF099" />
                <stop offset="25%" stopColor="#EAB308" />
                <stop offset="50%" stopColor="#A16207" />
                <stop offset="75%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>

              <linearGradient id="goldBevel" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CA8A04" />
                <stop offset="35%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              <radialGradient id="centerGoldRadial" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="65%" stopColor="#CA8A04" />
                <stop offset="90%" stopColor="#854D0E" />
                <stop offset="100%" stopColor="#582900" />
              </radialGradient>

              {/* Red Slice Gradients */}
              <linearGradient id="redSliceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C40D22" />
                <stop offset="100%" stopColor="#A00516" />
              </linearGradient>

              {/* White Slice Gradients */}
              <linearGradient id="whiteSliceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFF9F5" />
              </linearGradient>

              {/* Gold Wheel Edge Shadow */}
              <filter id="goldShine" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FDE047" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Outer Gold Rim Layer 1 (Outer Edge) */}
            <circle cx="300" cy="300" r="294" fill="url(#goldRimOuter)" />
            {/* Outer Gold Rim Layer 2 (Bevel Groove) */}
            <circle cx="300" cy="300" r="286" fill="url(#goldBevel)" stroke="#78350F" strokeWidth="2" />
            {/* Inner Gold Rim Step */}
            <circle cx="300" cy="300" r="270" fill="url(#goldRimOuter)" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="266" fill="#78350F" />

            {/* 7 Segment Wedges */}
            <g id="wheel-segments">
              {PRIZES.map((prize, index) => {
                const angle = index * SEGMENT_ANGLE;
                const isRed = prize.bgType === 'red';

                return (
                  <g key={prize.id} transform={`rotate(${angle} 300 300)`}>
                    {/* Slice Wedge Path */}
                    <path
                      d={getSlicePath(index, 265)}
                      fill={isRed ? 'url(#redSliceGrad)' : 'url(#whiteSliceGrad)'}
                      stroke="#EAB308"
                      strokeWidth="2.5"
                    />

                    {/* Segment Inner Content Container */}
                    <g transform="translate(300, 300)">
                      {/* Subtitle & Headline Group (Towards Outer Rim) */}
                      {index === 0 && (
                        // Segment 0: 70% Discount on Spectacle
                        <g transform="translate(0, -195)">
                          <text
                            x="0"
                            y="-14"
                            textAnchor="middle"
                            fill="#B90B1E"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="36"
                            letterSpacing="-0.5"
                          >
                            70%
                          </text>
                          <text
                            x="0"
                            y="10"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="13.5"
                          >
                            Discount on
                          </text>
                          <text
                            x="0"
                            y="25"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="14.5"
                          >
                            Spectacle
                          </text>
                        </g>
                      )}

                      {index === 1 && (
                        // Segment 1: Get Powered Sunglasses Free on Your Specz Purchase
                        <g transform="translate(0, -192)">
                          <text
                            x="0"
                            y="-20"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="13"
                          >
                            Get Powered
                          </text>
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="12.5"
                          >
                            Sunglasses Free
                          </text>
                          <text
                            x="0"
                            y="11"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="12"
                          >
                            on Your Specz
                          </text>
                          <text
                            x="0"
                            y="26"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="13"
                          >
                            Purchase
                          </text>
                        </g>
                      )}

                      {index === 2 && (
                        // Segment 2: 10% Hot Cash Back
                        <g transform="translate(0, -186)">
                          <text
                            x="0"
                            y="-14"
                            textAnchor="middle"
                            fill="#B90B1E"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="38"
                            letterSpacing="-0.5"
                          >
                            10%
                          </text>
                          <text
                            x="0"
                            y="14"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="14.5"
                          >
                            Hot Cash Back
                          </text>
                        </g>
                      )}

                      {index === 3 && (
                        // Segment 3: 1st Lens or 1st Frame Free
                        <g transform="translate(0, -185)">
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="15.5"
                          >
                            1st Lens or
                          </text>
                          <text
                            x="0"
                            y="16"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="15"
                          >
                            1st Frame Free
                          </text>
                        </g>
                      )}

                      {index === 4 && (
                        // Segment 4: Spectacle Kit Free
                        <g transform="translate(0, -185)">
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="16.5"
                          >
                            Spectacle
                          </text>
                          <text
                            x="0"
                            y="17"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="16"
                          >
                            Kit Free
                          </text>
                        </g>
                      )}

                      {index === 5 && (
                        // Segment 5: Sunglasses Free on Contact Lenses*
                        <g transform="translate(0, -185)">
                          <text
                            x="0"
                            y="-8"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="13.5"
                          >
                            Sunglasses Free
                          </text>
                          <text
                            x="0"
                            y="10"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="12.5"
                          >
                            on Contact
                          </text>
                          <text
                            x="0"
                            y="25"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="800"
                            fontSize="13"
                          >
                            Lenses*
                          </text>
                        </g>
                      )}

                      {index === 6 && (
                        // Segment 6: Extra Mileage (2nd Option)
                        <g transform="translate(0, -188)">
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="16.5"
                          >
                            Extra
                          </text>
                          <text
                            x="0"
                            y="15"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="900"
                            fontSize="16"
                          >
                            Mileage
                          </text>
                          <text
                            x="0"
                            y="31"
                            textAnchor="middle"
                            fill="#1E293B"
                            fontFamily="Outfit, sans-serif"
                            fontWeight="700"
                            fontSize="11.5"
                          >
                            (2nd Option)
                          </text>
                        </g>
                      )}

                      {/* Promo Code Pill Badge */}
                      <g transform="translate(0, -132)">
                        <rect
                          x="-46"
                          y="-10"
                          width="92"
                          height="20"
                          rx="10"
                          fill={prize.pillBg}
                          stroke={prize.pillBorder || '#FFFFFF'}
                          strokeWidth="1.6"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={prize.pillText}
                          fontFamily="Outfit, sans-serif"
                          fontWeight="800"
                          fontSize="10.5"
                          letterSpacing="0.4"
                        >
                          {prize.code}
                        </text>
                      </g>

                      {/* Graphic Icon (Near Inner Center) */}
                      <g transform="translate(0, -82)">
                        <SegmentIcon type={prize.icon} size={48} />
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Inner Golden Rim Over Segments */}
            <circle cx="300" cy="300" r="265" fill="none" stroke="url(#goldRimOuter)" strokeWidth="4" />

            {/* 7 Golden Rivets on Wheel Edge */}
            {Array.from({ length: 14 }).map((_, idx) => {
              const rivetAngle = (idx * (360 / 14) * Math.PI) / 180;
              const rx = 300 + 278 * Math.cos(rivetAngle);
              const ry = 300 + 278 * Math.sin(rivetAngle);
              return (
                <circle
                  key={idx}
                  cx={rx}
                  cy={ry}
                  r="3.5"
                  fill="#FEF08A"
                  stroke="#78350F"
                  strokeWidth="1"
                />
              );
            })}

            {/* Center Golden Medallion Hub */}
            <g id="center-hub">
              {/* Outer Golden Ring */}
              <circle cx="300" cy="300" r="48" fill="url(#goldRimOuter)" stroke="#78350F" strokeWidth="2" />
              {/* Radial Metallic Center */}
              <circle cx="300" cy="300" r="42" fill="url(#centerGoldRadial)" />
              {/* Inner Groove */}
              <circle cx="300" cy="300" r="32" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeOpacity="0.8" />
              <circle cx="300" cy="300" r="16" fill="url(#centerGoldRadial)" stroke="#78350F" strokeWidth="1" />
              {/* Center Specular Glint */}
              <circle cx="293" cy="292" r="5" fill="#FFFFFF" fillOpacity="0.5" />
            </g>
          </svg>
        </div>

        {/* Center Interactive Spin Button Overlay */}
        <button
          className={`center-spin-button ${isSpinning ? 'spinning' : ''}`}
          onClick={spin}
          disabled={isSpinning}
          title="Click to Spin the Wheel"
        >
          <span className="spin-btn-shine" />
          <span className="spin-btn-text">
            {isSpinning ? 'LUCKY...' : 'SPIN'}
          </span>
        </button>
      </div>

      {/* Main Action Spin CTA Button */}
      <div className="wheel-action-bar">
        <button
          className={`big-spin-btn ${isSpinning ? 'disabled' : ''}`}
          onClick={spin}
          disabled={isSpinning}
        >
          <span className="btn-icon">🎯</span>
          <span>{isSpinning ? 'Wheel is Spinning...' : 'SPIN THE WHEEL NOW'}</span>
        </button>
      </div>
    </div>
  );
};
