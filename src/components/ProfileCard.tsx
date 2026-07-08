"use client";

import Image from 'next/image';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 900,
  INITIAL_X_OFFSET: 40,
  INITIAL_Y_OFFSET: 40,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
} as const;

const clamp = (v: number, min = 0, max = 100): number => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3): number => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// Inject keyframes once
const KEYFRAMES_ID = 'pc-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

interface ProfileCardProps {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  iconMaskSize?: string;
  iconOpacity?: number;
  iconBrightness?: number;
  iconContrast?: number;
  iconSaturate?: number;
  iconBlendMode?: React.CSSProperties['mixBlendMode'];
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  company?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = '<Placeholder for avatar URL>',
  iconUrl = '<Placeholder for icon URL>',
  grainUrl = '<Placeholder for grain URL>',
  iconMaskSize = '220%',
  iconOpacity = 0.22,
  iconBrightness = 0.85,
  iconContrast = 1.05,
  iconSaturate = 0.15,
  iconBlendMode = 'soft-light',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  company,
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  // Taller card on sm+; compact height keeps card + contact panel visible on iPhone
  const isDesktopLayout = useMediaQuery('(min-width: 640px)');

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 42, 58)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 42, 58)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 10))}deg`,
        '--rotate-y': `${round(centerY / 8)}deg`
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number): void => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = (): void => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number): void {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number): void {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter(): void {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number): void {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel(): void {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, [enableTilt]);

  const getOffsets = (evt: PointerEvent, el: HTMLElement): { x: number; y: number } => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback((): void => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = (): void => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    shell.addEventListener('pointerenter', pointerEnterHandler);
    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const handleClick = (): void => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<string>;
      };
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation
  ]);

  // Touch devices skip tilt — initialize centered vars so the card paints without RAF
  useEffect(() => {
    if (enableTilt) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const centeredVars: Record<string, string> = {
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--background-x': '50%',
      '--background-y': '50%',
      '--pointer-from-center': '0',
      '--pointer-from-top': '0.5',
      '--pointer-from-left': '0.5',
      '--card-opacity': '1',
      '--rotate-x': '0deg',
      '--rotate-y': '0deg'
    };

    for (const [key, value] of Object.entries(centeredVars)) {
      wrap.style.setProperty(key, value);
    }
  }, [enableTilt]);

  const cardRadius = '30px';

  const cardStyle = useMemo(
    () => ({
      '--icon': iconUrl ? `url(${iconUrl})` : 'none',
      '--grain': grainUrl ? `url(${grainUrl})` : 'none',
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
      '--behind-glow-color': behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
      '--behind-glow-size': behindGlowSize ?? '50%',
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--pointer-from-center': '0',
      '--pointer-from-top': '0.5',
      '--pointer-from-left': '0.5',
      '--card-opacity': '0',
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--background-x': '50%',
      '--background-y': '50%',
      '--card-radius': cardRadius,
      '--sunpillar-1': 'hsl(2, 100%, 73%)',
      '--sunpillar-2': 'hsl(53, 100%, 69%)',
      '--sunpillar-3': 'hsl(93, 100%, 69%)',
      '--sunpillar-4': 'hsl(176, 100%, 76%)',
      '--sunpillar-5': 'hsl(228, 100%, 74%)',
      '--sunpillar-6': 'hsl(283, 100%, 73%)',
      '--sunpillar-clr-1': 'var(--sunpillar-1)',
      '--sunpillar-clr-2': 'var(--sunpillar-2)',
      '--sunpillar-clr-3': 'var(--sunpillar-3)',
      '--sunpillar-clr-4': 'var(--sunpillar-4)',
      '--sunpillar-clr-5': 'var(--sunpillar-5)',
      '--sunpillar-clr-6': 'var(--sunpillar-6)'
    }),
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize, cardRadius]
  );

  const handleContactClick = useCallback((): void => {
    onContactClick?.();
  }, [onContactClick]);

  // Complex styles that require CSS variables and can't be done with Tailwind
  const shineStyle: React.CSSProperties = {
    maskImage: 'var(--icon)',
    WebkitMaskImage: 'var(--icon)',
    maskMode: 'luminance',
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat',
    maskSize: iconMaskSize,
    WebkitMaskSize: iconMaskSize,
    maskPosition: 'top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))',
    WebkitMaskPosition:
      'top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))',
    filter: `brightness(${iconBrightness}) contrast(${iconContrast}) saturate(${iconSaturate}) opacity(${iconOpacity})`,
    animation: 'pc-holo-bg 18s linear infinite',
    animationPlayState: 'running',
    mixBlendMode: iconBlendMode,
    transform: 'translate3d(0, 0, 1px)',
    overflow: 'hidden',
    zIndex: 3,
    background: 'transparent',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--sunpillar-clr-1) 5%,
        var(--sunpillar-clr-2) 10%,
        var(--sunpillar-clr-3) 15%,
        var(--sunpillar-clr-4) 20%,
        var(--sunpillar-clr-5) 25%,
        var(--sunpillar-clr-6) 30%,
        var(--sunpillar-clr-1) 35%
      ),
      repeating-linear-gradient(
        -45deg,
        #0e152e 0%,
        hsl(180, 10%, 60%) 3.8%,
        hsl(180, 29%, 66%) 4.5%,
        hsl(180, 10%, 60%) 5.2%,
        #0e152e 10%,
        #0e152e 12%
      ),
      radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(0, 0%, 0%, 0.1) 12%,
        hsla(0, 0%, 0%, 0.15) 20%,
        hsla(0, 0%, 0%, 0.25) 120%
      )
    `.replace(/\s+/g, ' '),
    gridArea: '1 / -1',
    borderRadius: cardRadius,
    pointerEvents: 'none'
  };

  const glareStyle: React.CSSProperties = {
    transform: 'translate3d(0, 0, 1.1px)',
    overflow: 'hidden',
    opacity: 0.45,
    backgroundImage: `radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsl(248, 25%, 80%) 12%,
      hsla(207, 40%, 30%, 0.6) 90%
    )`,
    mixBlendMode: 'soft-light',
    filter: 'brightness(0.9) contrast(1.05)',
    zIndex: 4,
    gridArea: '1 / -1',
    borderRadius: cardRadius,
    pointerEvents: 'none'
  };

  return (
    <div
      ref={wrapRef}
      className={`relative w-full max-w-full ${enableTilt ? "touch-none" : "touch-pan-y"} ${className}`.trim()}
      style={{ perspective: '900px', transform: 'translate3d(0, 0, 0.1px)', ...cardStyle } as React.CSSProperties}
    >
      {behindGlowEnabled && (
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-200 ease-out"
          style={{
            background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
            filter: 'blur(28px) saturate(1.05)',
            opacity: 'calc(0.55 * var(--card-opacity))'
          }}
        />
      )}
      <div ref={shellRef} className="relative z-1 group/card">
        <section
          className="mx-auto grid relative overflow-hidden"
          style={{
            height: isDesktopLayout ? 'min(72svh, 480px)' : 'min(62svh, 420px)',
            maxHeight: isDesktopLayout ? '480px' : '420px',
            minHeight: 'min(58svh, 360px)',
            maxWidth: 'min(100%, 24rem)',
            aspectRatio: '0.718',
            isolation: 'isolate',
            borderRadius: cardRadius,
            backgroundBlendMode: enableTilt ? 'color-dodge, normal, normal, normal' : 'normal',
            boxShadow:
              'rgba(0, 0, 0, 0.6) calc((var(--pointer-from-left) * 4px) - 2px) calc((var(--pointer-from-top) * 8px) - 3px) 16px -4px',
            transition: 'transform 1s ease',
            transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)',
            background: 'rgba(0, 0, 0, 0.9)',
            backfaceVisibility: 'hidden'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transition = 'none';
            e.currentTarget.style.transform = 'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))';
          }}
          onMouseLeave={e => {
            const shell = shellRef.current;
            if (shell?.classList.contains('entering')) {
              e.currentTarget.style.transition = 'transform 180ms ease-out';
            } else {
              e.currentTarget.style.transition = 'transform 1s ease';
            }
            e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundImage: 'var(--inner-gradient)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderRadius: cardRadius,
              display: 'grid',
              gridArea: '1 / -1'
            }}
          >
            {/* Shine layer */}
            <div style={shineStyle} />

            {/* Glare layer */}
            <div style={glareStyle} />

            {/* Avatar content */}
            <div
              className="overflow-visible"
              style={{
                transform: 'translateZ(2px)',
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none',
                backfaceVisibility: 'hidden'
              }}
            >
              <Image
                className="w-full absolute left-1/2 -bottom-px will-change-transform transition-transform duration-120 ease-out"
                src={avatarUrl}
                alt={`${name || 'User'} avatar`}
                width={540}
                height={720}
                sizes="(max-width: 768px) 100vw, 540px"
                priority
                style={{
                  transformOrigin: '50% 100%',
                  transform:
                    'translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 2px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.008)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.004))',
                  borderRadius: cardRadius,
                  backfaceVisibility: 'hidden'
                }}
                onError={e => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                }}
              />
              {showUserInfo && (
                <div
                  className="group/footer absolute z-10 flex items-center justify-between border border-white/25 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 ease-out hover:border-white/45 hover:shadow-[0_12px_48px_rgba(0,0,0,0.75),0_0_28px_rgba(56,189,248,0.22)] hover:ring-white/25 group-hover/card:border-white/35 group-hover/card:shadow-[0_10px_40px_rgba(0,0,0,0.68),0_0_20px_rgba(56,189,248,0.14)]"
                  style={
                    {
                      '--ui-inset': 'clamp(10px, 4vw, 20px)',
                      '--ui-radius-bias': '6px',
                      bottom: 'var(--ui-inset)',
                      left: 'var(--ui-inset)',
                      right: 'var(--ui-inset)',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(15,23,42,0.82) 100%)',
                      borderRadius: 'calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)))',
                      padding: 'clamp(10px, 2.5vw, 14px) clamp(10px, 3vw, 16px)'
                    } as React.CSSProperties
                  }
                >
                  {/* Hover highlight overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/footer:opacity-100 group-hover/card:opacity-100"
                    style={{
                      borderRadius: 'inherit',
                      background:
                        'linear-gradient(135deg, rgba(56,189,248,0.14) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.1) 100%)'
                    }}
                  />
                  <div className="relative z-1 flex w-full min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2 transition-opacity duration-300 group-hover/footer:opacity-100 group-hover/card:opacity-100">
                      <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-white/25 bg-black shadow-sm transition-all duration-300 group-hover/footer:border-sky-400/55 group-hover/footer:shadow-[0_0_16px_rgba(56,189,248,0.55),0_0_6px_rgba(56,189,248,0.35)] group-hover/card:border-sky-400/45 group-hover/card:shadow-[0_0_12px_rgba(56,189,248,0.4),0_0_4px_rgba(56,189,248,0.25)]">
                        <Image
                          className="h-full w-full rounded-full object-contain p-1 transition-[filter] duration-300 group-hover/footer:brightness-110 group-hover/card:brightness-105"
                          src={miniAvatarUrl || avatarUrl}
                          alt={`${name || 'User'} mini avatar`}
                          width={48}
                          height={48}
                          style={{ display: 'block', gridArea: 'auto', borderRadius: '50%', pointerEvents: 'auto' }}
                          onError={e => {
                            const t = e.target as HTMLImageElement;
                            t.style.opacity = '0.5';
                            t.src = avatarUrl;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-none text-white transition-colors duration-300 group-hover/footer:text-white group-hover/card:text-slate-50">
                          @{handle}
                        </div>
                        <div className="mt-0.5 text-[11px] font-medium leading-none text-slate-300 transition-colors duration-300 group-hover/footer:text-slate-100 group-hover/card:text-slate-200">
                          {status}
                        </div>
                      </div>
                    </div>
                    <button
                      className="relative z-1 shrink-0 cursor-pointer rounded-lg border border-sky-400/40 bg-sky-500/25 px-3 py-2 text-[11px] font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-sky-300/70 hover:bg-sky-500/50 hover:shadow-[0_0_28px_rgba(56,189,248,0.45)] group-hover/footer:border-sky-300/55 group-hover/footer:bg-sky-500/35 group-hover/card:border-sky-400/50 group-hover/card:bg-sky-500/30"
                      onClick={handleContactClick}
                      style={{ pointerEvents: 'auto', display: 'block', gridArea: 'auto', borderRadius: '8px' }}
                      type="button"
                      aria-label={`Contact ${name || 'user'}`}
                    >
                      {contactText}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Details content — horizontal parallax only to avoid top gap */}
            <div
              className="max-h-full overflow-hidden text-center relative z-5"
              style={{
                transform:
                  'translate3d(calc(var(--pointer-from-left) * -2px + 1px), 0, 0.1px)',
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none'
              }}
            >
              {/* Dark scrim behind header text — clipped to card top radius */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-1 h-44 bg-linear-to-b from-black/75 via-black/40 to-transparent"
                style={{ borderRadius: `${cardRadius} ${cardRadius} 0 0` }}
              />
              <div className="absolute inset-x-0 top-0 z-2 flex flex-col items-center gap-1.5 px-6 pt-10 pb-4 text-center pointer-events-auto">
                <h3
                  className="m-0 max-w-[92%] font-semibold leading-none tracking-[-0.02em] text-white"
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5svh, 2.5rem)',
                    textShadow:
                      '0 2px 18px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.6), 0 0 32px rgba(56,189,248,0.12)'
                  }}
                >
                  {name}
                </h3>
                <div className="flex max-w-[92%] flex-col gap-1">
                  <p
                    className="m-0 text-sm font-medium leading-snug tracking-[0.01em] text-white/90 sm:text-[0.9375rem]"
                    style={{ textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
                  >
                    {title}
                  </p>
                  {company ? (
                    <p
                      className="m-0 text-xs font-normal leading-snug tracking-[0.035em] text-sky-100/80 sm:text-[0.8125rem]"
                      style={{ textShadow: '0 1px 10px rgba(0,0,0,0.75)' }}
                    >
                      {company}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
