import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/store/useOrderStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import {
  Phone,
  MessageSquare,
  Check,
  Circle,
  Navigation,
  Clock,
  MapPin,
  Compass,
  ShieldCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Minus,
  FastForward,
  Heart,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const LiveTrackingModal: React.FC = () => {
  const navigate = useNavigate();
  const { isTrackingModalOpen, closeTrackingModal, activeTrackingOrder } = useOrderStore();
  const { showToast } = useNotificationStore();

  const [mapTheme, setMapTheme] = useState<'day' | 'night' | 'satellite'>('day');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showOrderItems, setShowOrderItems] = useState(false);
  const [riderProgress, setRiderProgress] = useState<number>(0.55); // 0 to 1 along the route
  const [etaSeconds, setEtaSeconds] = useState<number>(840); // 14 mins default
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Sync rider progress with order step
  useEffect(() => {
    if (!activeTrackingOrder) return;
    const step = activeTrackingOrder.step;
    if (step === 0) {
      setRiderProgress(0.08);
      setEtaSeconds(1320); // 22 mins
    } else if (step === 1) {
      setRiderProgress(0.25);
      setEtaSeconds(1020); // 17 mins
    } else if (step === 2) {
      setRiderProgress(0.68);
      setEtaSeconds(480); // 8 mins
    } else if (step === 3) {
      setRiderProgress(1.0);
      setEtaSeconds(0);
    }
  }, [activeTrackingOrder?.step]);

  // Live timer countdown
  useEffect(() => {
    if (!isTrackingModalOpen || etaSeconds <= 0) return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTrackingModalOpen, etaSeconds]);

  // Live micro-movement simulation for the courier
  useEffect(() => {
    if (!isTrackingModalOpen || activeTrackingOrder?.step === 3) return;
    const interval = setInterval(() => {
      setRiderProgress((prev) => {
        if (prev >= 0.98) return 0.98;
        return Math.min(0.98, prev + 0.003);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isTrackingModalOpen, activeTrackingOrder?.step]);

  // Route path geometry (Realistic curve through city)
  // Path: Start at (70, 240) -> Middle curves -> Destination at (680, 80)
  const routePoints = useMemo(
    () => [
      { x: 70, y: 240 },
      { x: 160, y: 240 },
      { x: 230, y: 170 },
      { x: 320, y: 170 },
      { x: 380, y: 260 },
      { x: 490, y: 260 },
      { x: 550, y: 140 },
      { x: 620, y: 140 },
      { x: 680, y: 80 },
    ],
    []
  );

  // Compute (x, y) along the multi-segment polyline path based on progress
  const getCoordinatesAlongPath = (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const totalSegments = routePoints.length - 1;
    const segmentProgress = clamped * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(segmentProgress));
    const subProgress = segmentProgress - segmentIndex;

    const p1 = routePoints[segmentIndex];
    const p2 = routePoints[segmentIndex + 1];

    const x = p1.x + (p2.x - p1.x) * subProgress;
    const y = p1.y + (p2.y - p1.y) * subProgress;

    // Angle calculation for scooter direction
    const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

    return { x, y, angle };
  };

  const riderCoord = getCoordinatesAlongPath(riderProgress);

  const steps = [
    { label: 'Confirmed', desc: 'Kitchen accepted your feast', time: '12:02 PM' },
    { label: 'In Kitchen Oven', desc: 'Chefs are baking handcrafted dough', time: '12:08 PM' },
    { label: 'Courier on Route', desc: 'Alex is cruising with heated thermal bag', time: '12:15 PM' },
    { label: 'Arrived at Door', desc: 'Hot & fresh delivery handed over', time: '12:24 PM' },
  ];

  const formatEta = (seconds: number) => {
    if (seconds <= 0) return 'Arrived!';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const remainingDistance = Math.max(0.2, (1 - riderProgress) * 2.8).toFixed(1);

  const handleCopyLink = () => {
    setLinkCopied(true);
    showToast({
      title: 'Tracking Link Copied! 🔗',
      message: 'Share live GPS route with family & friends.',
      type: 'deal',
      icon: '📍',
    });
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleTip = (amount: number) => {
    setTipAmount(amount);
    showToast({
      title: `$${amount}.00 Tip Added! ❤️`,
      message: `Thank you for tipping Courier ${activeTrackingOrder?.driverName || 'Alex'}!`,
      type: 'welcome',
      icon: '⭐',
    });
  };

  const handleSimulateNextStep = () => {
    if (!activeTrackingOrder) return;
    const currentStep = activeTrackingOrder.step;
    const nextStep = (currentStep + 1) % 4;
    useOrderStore.setState((state) => {
      const updated = state.orders.map((o) =>
        o.id === activeTrackingOrder.id ? { ...o, step: nextStep, status: steps[nextStep].label as any } : o
      );
      return {
        orders: updated,
        activeTrackingOrder: { ...activeTrackingOrder, step: nextStep, status: steps[nextStep].label as any },
      };
    });
  };

  return (
    <Modal
      isOpen={isTrackingModalOpen}
      onClose={closeTrackingModal}
      maxWidth="max-w-2xl"
      showCloseButton={true}
    >
      {activeTrackingOrder ? (
        <div className="space-y-4 select-none">
        {/* TOP STATUS & LIVE ETA HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 rounded-3xl border border-amber-300/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-foodie-yellow via-amber-400 to-foodie-orange flex items-center justify-center text-xl shadow-foodie-glow shrink-0">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-foodie-amber-dark">
                  Order #{activeTrackingOrder.orderNumber || activeTrackingOrder.id.slice(-6)}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live GPS
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-foodie-charcoal">
                {activeTrackingOrder.status}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/80 shadow-xs">
            <Clock className="w-4 h-4 text-foodie-amber-dark" />
            <div>
              <span className="text-[10px] font-bold text-foodie-muted block uppercase leading-tight">
                Est. Arrival
              </span>
              <strong className="text-sm font-black text-foodie-charcoal">
                {formatEta(etaSeconds)}
              </strong>
            </div>
          </div>
        </div>

        {/* REALISTIC HIGH-TECH VECTOR CITY GPS MAP */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-foodie-border/80 shadow-2xl bg-zinc-900">
          {/* MAP CANVAS (VECTOR SVG CITY ENGINE) */}
          <div
            className="w-full h-full transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 750 360"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Background Ground Color */}
              <rect
                width="750"
                height="360"
                fill={
                  mapTheme === 'night'
                    ? '#0F172A'
                    : mapTheme === 'satellite'
                    ? '#1E293B'
                    : '#F1EFE9'
                }
              />

              {/* City Blocks & Neighborhood Patches */}
              <g opacity={mapTheme === 'night' ? 0.35 : mapTheme === 'satellite' ? 0.25 : 0.6}>
                <rect x="20" y="20" width="130" height="90" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="180" y="20" width="180" height="90" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="390" y="20" width="150" height="80" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="20" y="140" width="100" height="80" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="260" y="200" width="100" height="120" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="390" y="290" width="180" height="50" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
                <rect x="600" y="170" width="130" height="150" rx="8" fill={mapTheme === 'day' ? '#E5E2D9' : '#1E293B'} />
              </g>

              {/* Central Green City Park */}
              <g>
                <rect
                  x="400"
                  y="120"
                  width="130"
                  height="120"
                  rx="16"
                  fill={mapTheme === 'night' ? '#064E3B' : mapTheme === 'satellite' ? '#14532D' : '#DCFCE7'}
                  stroke={mapTheme === 'night' ? '#047857' : '#86EFAC'}
                  strokeWidth="1.5"
                />
                <text
                  x="465"
                  y="180"
                  textAnchor="middle"
                  fill={mapTheme === 'night' ? '#34D399' : '#166534'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  opacity="0.85"
                >
                  🌳 Central Park
                </text>
              </g>

              {/* Blue River / Canal */}
              <path
                d="M 0 320 Q 200 350, 360 300 T 750 340"
                fill="none"
                stroke={mapTheme === 'night' ? '#0369A1' : '#38BDF8'}
                strokeWidth="28"
                opacity={mapTheme === 'night' ? 0.4 : 0.6}
              />
              <path
                d="M 0 320 Q 200 350, 360 300 T 750 340"
                fill="none"
                stroke={mapTheme === 'night' ? '#38BDF8' : '#7DD3FC'}
                strokeWidth="6"
                strokeDasharray="12,12"
                opacity="0.8"
              />

              {/* Grid Roads & Avenues */}
              <g stroke={mapTheme === 'night' ? '#334155' : '#FFFFFF'} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 0 130 L 750 130" />
                <path d="M 0 250 L 750 250" />
                <path d="M 160 0 L 160 360" />
                <path d="M 380 0 L 380 360" />
                <path d="M 560 0 L 560 360" />
              </g>

              {/* Road Asphalt Centers */}
              <g stroke={mapTheme === 'night' ? '#1E293B' : '#E2E8F0'} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 0 130 L 750 130" />
                <path d="M 0 250 L 750 250" />
                <path d="M 160 0 L 160 360" />
                <path d="M 380 0 L 380 360" />
                <path d="M 560 0 L 560 360" />
              </g>

              {/* Street Names / Labels */}
              <g fill={mapTheme === 'night' ? '#94A3B8' : '#64748B'} fontSize="9" fontWeight="800" letterSpacing="1">
                <text x="70" y="125">5TH AVENUE</text>
                <text x="440" y="245">MADISON BLVD</text>
                <text x="165" y="60" transform="rotate(90, 165, 60)">BROADWAY ST</text>
                <text x="385" y="60" transform="rotate(90, 385, 60)">GRAND PKWY</text>
              </g>

              {/* GPS DELIVERY ROUTE - Base Shadow Line */}
              <polyline
                points={routePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={mapTheme === 'night' ? '#451A03' : '#FDE68A'}
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* GPS DELIVERY ROUTE - Glowing Neon Polyline */}
              <polyline
                points={routePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8,8"
                className="animate-[dash_1.5s_linear_infinite]"
              />

              {/* Traveled Path (Solid gold) */}
              <polyline
                points={routePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#FF6B00"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />

              {/* 1. RESTAURANT PIN (ORIGIN) */}
              <g transform="translate(70, 240)">
                <circle r="22" fill="#FFC107" opacity="0.25" className="animate-ping" />
                <circle r="16" fill="#FFC107" stroke="#FFFFFF" strokeWidth="2.5" />
                <text y="5" textAnchor="middle" fontSize="14">🍔</text>
              </g>

              {/* 2. CUSTOMER PIN (DESTINATION) */}
              <g transform="translate(680, 80)">
                <circle r="24" fill="#10B981" opacity="0.3" className="animate-ping" />
                <circle r="17" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                <text y="5" textAnchor="middle" fontSize="13">🏠</text>
              </g>

              {/* 3. MOVING COURIER RIDER */}
              <g transform={`translate(${riderCoord.x}, ${riderCoord.y})`}>
                {/* Radar pulse wave */}
                <circle r="28" fill="#F59E0B" opacity="0.25" className="animate-ping" />
                <circle r="18" fill="#18181B" stroke="#FFC107" strokeWidth="3" className="drop-shadow-md" />
                {/* Rider emoji / icon */}
                <text y="5" textAnchor="middle" fontSize="15">🛵</text>
              </g>
            </svg>
          </div>

          {/* OVERLAY: RESTAURANT PILL */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/80 shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foodie-amber-dark animate-pulse" />
            <div>
              <strong className="text-[11px] font-black text-foodie-charcoal block leading-none">
                Foodie Kitchen
              </strong>
              <span className="text-[9px] text-foodie-muted font-medium">Order Picked Up</span>
            </div>
          </div>

          {/* OVERLAY: DESTINATION PILL */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/80 shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <strong className="text-[11px] font-black text-foodie-charcoal block leading-none truncate max-w-[120px]">
                {activeTrackingOrder.deliveryAddress || 'Your Address'}
              </strong>
              <span className="text-[9px] text-foodie-muted font-medium">
                {remainingDistance} km away
              </span>
            </div>
          </div>

          {/* OVERLAY: LIVE TELEMETRY CHIP */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/75 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/20 text-white shadow-xl">
            <Navigation className="w-3.5 h-3.5 text-foodie-yellow animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] font-black tracking-wide">32 km/h</span>
            <span className="text-[10px] text-zinc-400 font-bold">• Vespa 150</span>
          </div>

          {/* OVERLAY: MAP CONTROLS (THEME TOGGLE + ZOOM) */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/80 shadow-xl">
            <button
              onClick={() => setMapTheme(mapTheme === 'day' ? 'night' : mapTheme === 'night' ? 'satellite' : 'day')}
              className="w-7 h-7 rounded-xl bg-foodie-app hover:bg-foodie-yellow flex items-center justify-center text-foodie-charcoal transition-all text-xs"
              title="Toggle Map Style"
            >
              {mapTheme === 'day' ? <Sun className="w-3.5 h-3.5" /> : mapTheme === 'night' ? <Moon className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
            </button>
            <div className="w-px h-4 bg-foodie-border" />
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="w-7 h-7 rounded-xl bg-foodie-app hover:bg-foodie-yellow flex items-center justify-center text-foodie-charcoal transition-all text-xs"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.15))}
              className="w-7 h-7 rounded-xl bg-foodie-app hover:bg-foodie-yellow flex items-center justify-center text-foodie-charcoal transition-all text-xs"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* STEP PROGRESSION BAR (ANIMATED 4-STEP TIMELINE) */}
        <div className="bg-foodie-app/80 rounded-3xl p-4 border border-foodie-border/70 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark" />
              <span>Live Order Journey</span>
            </h4>

            {/* Step Simulator Button for Live Demo testing */}
            <button
              type="button"
              onClick={handleSimulateNextStep}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-[10px] font-black text-foodie-amber-dark transition-all active:scale-95 shadow-xs"
              title="Advance tracking state for test demo"
            >
              <FastForward className="w-3 h-3" />
              <span>Simulate Next Step</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeTrackingOrder.step;
              const isCurrent = idx === activeTrackingOrder.step;

              return (
                <div
                  key={step.label}
                  className={cn(
                    'p-2.5 rounded-2xl border transition-all',
                    isCurrent
                      ? 'bg-white border-foodie-yellow shadow-md ring-2 ring-foodie-yellow/20'
                      : isCompleted
                      ? 'bg-white/60 border-foodie-border'
                      : 'bg-transparent border-transparent opacity-45'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0',
                        isCompleted
                          ? 'bg-foodie-yellow text-foodie-charcoal'
                          : isCurrent
                          ? 'bg-foodie-amber-dark text-white animate-pulse'
                          : 'bg-zinc-200 text-zinc-500'
                      )}
                    >
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className="text-[10px] text-foodie-muted font-bold">{step.time}</span>
                  </div>
                  <strong className="text-xs font-black text-foodie-charcoal block truncate">
                    {step.label}
                  </strong>
                  <p className="text-[10px] text-foodie-muted line-clamp-1 mt-0.5">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* COURIER DRIVER CONTACT & TIP CARD */}
        <div className="bg-white/95 rounded-3xl p-4 border border-foodie-border/80 shadow-md space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-orange flex items-center justify-center text-2xl shadow-sm">
                  🛵
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] border-2 border-white shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-black text-foodie-charcoal">
                    {activeTrackingOrder.driverName || 'Alex Vance'}
                  </strong>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-black text-foodie-amber-dark border border-amber-200">
                    ⭐ 4.98 (240+)
                  </span>
                </div>
                <span className="text-[11px] text-foodie-muted font-medium flex items-center gap-1 mt-0.5">
                  <span>Plate: FD-8821</span>
                  <span>•</span>
                  <span>Vespa Sprint 150</span>
                </span>
              </div>
            </div>

            {/* Call & Chat Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeTrackingOrder.driverPhone || '+15552345678'}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-foodie-app hover:bg-foodie-yellow text-foodie-charcoal text-xs font-black transition-all shadow-xs active:scale-95"
                title="Call Driver"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  closeTrackingModal();
                  navigate('/chat');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-foodie-charcoal hover:bg-black text-white text-xs font-black transition-all shadow-xs active:scale-95"
                title="Message Driver"
              >
                <MessageSquare className="w-3.5 h-3.5 text-foodie-yellow" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-9 h-9 rounded-2xl bg-foodie-app hover:bg-foodie-yellow flex items-center justify-center text-foodie-charcoal transition-all shadow-xs active:scale-95"
                title="Share Live Tracking"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Tip Driver Pills */}
          <div className="pt-2 border-t border-foodie-border/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-bold text-foodie-muted flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>Tip courier Alex:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {[2, 3, 5].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleTip(amt)}
                  className={cn(
                    'px-3 py-1 rounded-xl text-xs font-black transition-all active:scale-95',
                    tipAmount === amt
                      ? 'bg-foodie-yellow text-foodie-charcoal shadow-xs'
                      : 'bg-foodie-app hover:bg-foodie-yellow/40 text-foodie-charcoal border border-foodie-border'
                  )}
                >
                  ${amt}.00
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE ORDER ITEMS PREVIEW */}
        <div className="bg-white/80 rounded-3xl border border-foodie-border/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOrderItems(!showOrderItems)}
            className="w-full p-3.5 flex items-center justify-between text-xs font-black text-foodie-charcoal hover:bg-foodie-app/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-foodie-amber-dark" />
              <span>Order Details ({activeTrackingOrder.items?.length || 1} items)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foodie-amber-dark font-black">
                ${activeTrackingOrder.total.toFixed(2)}
              </span>
              {showOrderItems ? <ChevronUp className="w-4 h-4 text-foodie-muted" /> : <ChevronDown className="w-4 h-4 text-foodie-muted" />}
            </div>
          </button>

          <AnimatePresence>
            {showOrderItems && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-3 space-y-2 border-t border-foodie-border/60"
              >
                {activeTrackingOrder.items && activeTrackingOrder.items.length > 0 ? (
                  activeTrackingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-foodie-yellow-soft flex items-center justify-center text-[10px] font-black text-foodie-charcoal">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-foodie-charcoal">{item.productName}</span>
                        <span className="text-[10px] text-foodie-muted">({item.size})</span>
                      </div>
                      <span className="font-black text-foodie-charcoal">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-foodie-muted py-1">
                    Double Pepperoni Artisan Pizza (Large, Stuffed Crust) - ${activeTrackingOrder.total.toFixed(2)}
                  </div>
                )}
                <div className="pt-2 border-t border-foodie-border/40 text-[11px] text-foodie-muted flex items-center justify-between">
                  <span>Delivery Address:</span>
                  <span className="font-bold text-foodie-charcoal truncate max-w-[200px]">
                    {activeTrackingOrder.deliveryAddress}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CLOSE BUTTON */}
        <Button onClick={closeTrackingModal} size="lg" className="w-full font-black text-sm shadow-foodie-glow">
          Done Viewing Live Tracking
        </Button>
      </div>
      ) : null}
    </Modal>
  );
};
