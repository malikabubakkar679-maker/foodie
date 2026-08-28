import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFoodStore } from '@/store/useFoodStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const THRESHOLD = 62; // px required to trigger refresh
const MAX_PULL = 110; // max elastic distance

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const hasTriggeredHapticRef = useRef(false);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = useFoodStore((s) => s.fetchData);
  const initializeSession = useAuthStore((s) => s.initializeSession);
  const user = useAuthStore((s) => s.user);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  // Execute complete data refresh upon release
  const executeRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hasTriggeredHapticRef.current = false;
    const startTime = performance.now();

    try {
      await Promise.all([
        fetchData(),
        initializeSession(),
        fetchOrders(user?.id),
      ]);

      const elapsed = performance.now() - startTime;
      if (elapsed < 400) {
        await new Promise((r) => setTimeout(r, 400 - elapsed));
      }

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.([15, 30]);
        } catch {
          // ignore
        }
      }

      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.warn('Pull-to-refresh sync error:', err);
    } finally {
      setIsRefreshing(false);
      setIsPulling(false);
      setPullY(0);
    }
  }, [fetchData, initializeSession, fetchOrders, user?.id]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startYRef.current = e.touches[0].clientY;
      isDraggingRef.current = true;
      setIsPulling(true);
      hasTriggeredHapticRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isDraggingRef.current = false;
      setIsPulling(false);
      setPullY(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      window.getSelection()?.removeAllRanges();
      // Smooth logarithmic resistance
      const resistedPull = Math.min(MAX_PULL, Math.pow(deltaY, 0.84) * 0.76);
      setPullY(resistedPull);

      if (resistedPull >= THRESHOLD && !hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = true;
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.(14);
          } catch {
            // ignore
          }
        }
      }
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (pullY >= THRESHOLD && !isRefreshing) {
      setPullY(52);
      executeRefresh();
    } else {
      setIsPulling(false);
      setPullY(0);
    }
  };

  // Mouse drag handlers for desktop/testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.scrollY <= 0 && !isRefreshing && e.button === 0) {
      startYRef.current = e.clientY;
      isDraggingRef.current = true;
      setIsPulling(true);
      hasTriggeredHapticRef.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isDraggingRef.current = false;
      setIsPulling(false);
      setPullY(0);
      return;
    }

    const currentY = e.clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      window.getSelection()?.removeAllRanges();
      const resistedPull = Math.min(MAX_PULL, Math.pow(deltaY, 0.84) * 0.76);
      setPullY(resistedPull);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (pullY >= THRESHOLD && !isRefreshing) {
      setPullY(52);
      executeRefresh();
    } else {
      setIsPulling(false);
      setPullY(0);
    }
  };

  // Trackpad wheel pull down
  useEffect(() => {
    let wheelDelta = 0;
    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0 && !isRefreshing) {
        setIsPulling(true);
        wheelDelta += Math.abs(e.deltaY) * 0.45;
        const currentPull = Math.min(MAX_PULL, Math.pow(wheelDelta, 0.84) * 0.76);
        setPullY(currentPull);

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (wheelDelta >= THRESHOLD && !isRefreshing) {
            setPullY(52);
            executeRefresh();
          } else {
            setIsPulling(false);
            setPullY(0);
          }
          wheelDelta = 0;
        }, 220);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [isRefreshing, executeRefresh]);

  const pullPercentage = Math.min(100, Math.round((pullY / THRESHOLD) * 100));
  const isPastThreshold = pullY >= THRESHOLD;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative min-h-screen flex flex-col ${pullY > 0 ? 'select-none' : ''}`}
    >
      {/* LUXURY FLOATING PULL / REFRESH BADGE */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-75 ease-out"
        style={{
          transform: `translateY(${Math.max(-16, pullY - 42)}px)`,
          opacity: pullY > 6 || isRefreshing ? 1 : 0,
        }}
      >
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-2xl border shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-all duration-150 ${
            isPastThreshold || isRefreshing
              ? 'border-amber-400/80 shadow-[0_10px_28px_rgba(255,193,7,0.30)] scale-105'
              : 'border-white/90 scale-95'
          }`}
        >
          {isRefreshing ? (
            /* Active Fast Spinning Yellow Refresh */
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin text-foodie-amber-dark" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="opacity-95"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-[11px] font-black text-foodie-charcoal tracking-tight">
                Refreshing Kitchen... 🍕
              </span>
            </div>
          ) : (
            /* Active Interactive Pulling / Holding State */
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4 transition-transform duration-75"
                  style={{
                    transform: `rotate(${pullY * 4.5}deg)`,
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#E5E7EB"
                    strokeWidth="2.8"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#FFC107"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeDasharray="56.5"
                    strokeDashoffset={56.5 - (56.5 * pullPercentage) / 100}
                    transform="rotate(-90 12 12)"
                  />
                </svg>
              </div>

              <span className="text-[11px] font-black text-foodie-charcoal tracking-tight">
                {isPastThreshold ? 'Release to Refresh! ⚡' : 'Pull down to refresh'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RUBBER-BAND SPRING ELASTIC CONTENT CONTAINER */}
      <motion.div
        key={`content-refresh-${refreshKey}`}
        animate={{
          y: isRefreshing ? 52 : pullY,
        }}
        transition={{
          type: 'spring',
          damping: isRefreshing ? 24 : 19,
          stiffness: 350,
          mass: 0.55,
        }}
        className="flex-1 flex flex-col will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
