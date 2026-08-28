import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFoodStore } from '@/store/useFoodStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const THRESHOLD = 65; // px to trigger refresh (TikTok/Snapchat feel)
const MAX_PULL = 115; // max elastic stretch

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasTriggeredHapticRef = useRef(false);

  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = useFoodStore((s) => s.fetchData);
  const initializeSession = useAuthStore((s) => s.initializeSession);
  const user = useAuthStore((s) => s.user);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const executeRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hasTriggeredHapticRef.current = false;
    const startTime = performance.now();

    try {
      // Real network call and data refresh
      await Promise.all([
        fetchData(),
        initializeSession(),
        fetchOrders(user?.id),
      ]);

      const elapsed = performance.now() - startTime;
      // Minimum smooth spin time (350ms) for pleasant visual cadence
      if (elapsed < 350) {
        await new Promise((r) => setTimeout(r, 350 - elapsed));
      }

      // Haptic tick on complete
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.([10, 20]);
        } catch {
          // ignore
        }
      }

      // Increment refreshKey to trigger smooth content refresh re-render
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.warn('Pull-to-refresh sync error:', err);
    } finally {
      setIsRefreshing(false);
      setPullY(0);
    }
  }, [fetchData, initializeSession, fetchOrders, user?.id]);

  // Touch Handlers (Mobile - TikTok/Snapchat Physics)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startYRef.current = e.touches[0].clientY;
      isDraggingRef.current = true;
      hasTriggeredHapticRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isDraggingRef.current = false;
      setPullY(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      // Clear any accidental text selection
      window.getSelection()?.removeAllRanges();

      // TikTok/Snapchat cubic logarithmic resistance
      const resistedPull = Math.min(MAX_PULL, Math.pow(deltaY, 0.85) * 0.72);
      setPullY(resistedPull);

      // Light haptic tick when crossing threshold
      if (resistedPull >= THRESHOLD && !hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = true;
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.(12);
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
      setPullY(50);
      executeRefresh();
    } else {
      setPullY(0);
    }
  };

  // Mouse Handlers (Desktop Testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.scrollY <= 0 && !isRefreshing && e.button === 0) {
      startYRef.current = e.clientY;
      isDraggingRef.current = true;
      hasTriggeredHapticRef.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isDraggingRef.current = false;
      setPullY(0);
      return;
    }

    const currentY = e.clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      window.getSelection()?.removeAllRanges();
      const resistedPull = Math.min(MAX_PULL, Math.pow(deltaY, 0.85) * 0.72);
      setPullY(resistedPull);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (pullY >= THRESHOLD && !isRefreshing) {
      setPullY(50);
      executeRefresh();
    } else {
      setPullY(0);
    }
  };

  // Trackpad two-finger pull-down support at top of page
  useEffect(() => {
    let wheelDelta = 0;
    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0 && !isRefreshing) {
        wheelDelta += Math.abs(e.deltaY) * 0.45;
        const currentPull = Math.min(MAX_PULL, Math.pow(wheelDelta, 0.85) * 0.72);
        setPullY(currentPull);

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (wheelDelta >= THRESHOLD && !isRefreshing) {
            setPullY(50);
            executeRefresh();
          } else {
            setPullY(0);
          }
          wheelDelta = 0;
        }, 180);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [isRefreshing, executeRefresh]);

  const pullPercentage = Math.min(100, Math.round((pullY / THRESHOLD) * 100));

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
      {/* TIKTOK / SNAPCHAT STYLE CLEAN YELLOW CIRCULAR SPINNER */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none transition-all"
        style={{
          transform: `translateY(${Math.max(-12, pullY - 44)}px)`,
          opacity: pullY > 8 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_10px_28px_rgba(0,0,0,0.12)] flex items-center justify-center transition-transform duration-100 will-change-transform">
          {isRefreshing ? (
            /* Fast TikTok Yellow Spinner */
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="#FFC107"
                strokeWidth="3.2"
              />
              <path
                className="opacity-95"
                fill="#FFC107"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            /* Elastic Arc that fills and accelerates rotation as user pulls */
            <svg
              className="w-5 h-5 transition-transform duration-75"
              style={{
                transform: `rotate(${pullY * 4.8}deg) scale(${0.85 + (pullPercentage / 100) * 0.25})`,
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#F3F4F6"
                strokeWidth="2.5"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#FFC107"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="56.5"
                strokeDashoffset={56.5 - (56.5 * pullPercentage) / 100}
                transform="rotate(-90 12 12)"
              />
            </svg>
          )}
        </div>
      </div>

      {/* RUBBER-BAND SPRING ELASTIC TRANSFORM CONTAINER */}
      <motion.div
        key={`content-refresh-${refreshKey}`}
        animate={{
          y: isRefreshing ? 50 : pullY,
        }}
        transition={{
          type: 'spring',
          damping: isRefreshing ? 24 : 20,
          stiffness: 340,
          mass: 0.6,
        }}
        className="flex-1 flex flex-col will-change-transform animate-fade-in"
      >
        {children}
      </motion.div>
    </div>
  );
};
