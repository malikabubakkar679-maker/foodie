import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Gift,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z.string().min(7, 'Please enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMessage,
    login,
    loginSocial,
    register,
    isLoading,
  } = useAuthStore();
  const { showToast } = useNotificationStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
    reset: resetRegForm,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  if (!isAuthModalOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FFC107', '#FFA000', '#FF6B00', '#10B981', '#FFFFFF'],
      });
    } catch {
      // ignore if canvas not available
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setAuthError('');
    try {
      const user = await login(data.email, data.password);
      showToast({
        title: `Welcome back, ${user.fullName.split(' ')[0]}! 👋`,
        message: 'You have signed in to Foodie successfully.',
        type: 'auth_prompt',
        icon: '🍔',
      });
      resetLoginForm();
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid email or password. Please try again.');
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setAuthError('');
    try {
      const user = await register(data.fullName, data.email, data.phone, data.password);
      triggerCelebration();
      showToast({
        title: `Welcome to Foodie, ${user.fullName.split(' ')[0]}! 🎉`,
        message: 'Your fresh account has been created successfully.',
        type: 'welcome',
        icon: '🎁',
      });
      resetRegForm();
    } catch (err: any) {
      setAuthError(err?.message || 'Could not create account. Please check your details.');
    }
  };

  const handleSocialSignIn = async (provider: 'Google' | 'Apple' | 'Facebook') => {
    setAuthError('');
    try {
      const user = await loginSocial(provider);
      triggerCelebration();
      showToast({
        title: `Connected with ${provider}! 👋`,
        message: `Welcome, ${user.fullName}! Your account is ready.`,
        type: 'welcome',
        icon: '✨',
      });
      resetLoginForm();
      resetRegForm();
    } catch (err: any) {
      setAuthError(err?.message || `Could not sign in with ${provider}.`);
    }
  };

  const fillDemoAccount = () => {
    setMode('login');
    setAuthError('');
    setLoginValue('email', 'alex@foodie.com');
    setLoginValue('password', 'password123');
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 5000);
  };

  const handleClose = () => {
    setAuthError('');
    setForgotSent(false);
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-4 select-none">
        {/* FROSTED GLASS BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-xl"
        />

        {/* AMBIENT GLOW ORBS */}
        <div className="fixed top-1/4 left-1/3 w-80 h-80 bg-foodie-yellow/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-foodie-orange/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        {/* CENTER LUXURY AUTH CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-7 overflow-hidden"
        >
          {/* TOP CLOSE BUTTON */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-foodie-app hover:bg-foodie-yellow/30 border border-foodie-border text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all active:scale-90"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* CARD HEADER */}
          <div className="text-center space-y-1.5 pt-0.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-foodie-yellow-soft to-amber-100 border border-foodie-yellow/40 text-[11px] font-black text-foodie-amber-dark shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark" />
              <span>Foodie Official Auth</span>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal tracking-tight flex items-center justify-center gap-1.5">
                <span>Foodie</span>
                <span className="text-foodie-orange leading-none">.</span>
              </h2>
              <p className="text-xs text-foodie-muted max-w-xs mx-auto font-medium">
                {authModalMessage ||
                  (mode === 'login'
                    ? 'Sign in to access saved addresses, wallet & fast orders.'
                    : 'Create your fresh account to start placing delicious orders.')}
              </p>
            </div>
          </div>

          {/* SLICK SEGMENTED TAB SWITCHER */}
          <div className="mt-4 p-1 bg-foodie-app/90 rounded-2xl border border-foodie-border flex relative">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setAuthError('');
              }}
              className={cn(
                'relative flex-1 py-2.5 text-xs font-black rounded-xl transition-all select-none text-center',
                mode === 'login' ? 'text-foodie-charcoal' : 'text-foodie-muted hover:text-foodie-charcoal'
              )}
            >
              {mode === 'login' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-foodie-border/60"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setAuthError('');
              }}
              className={cn(
                'relative flex-1 py-2.5 text-xs font-black rounded-xl transition-all select-none text-center flex items-center justify-center gap-1',
                mode === 'register' ? 'text-foodie-charcoal' : 'text-foodie-muted hover:text-foodie-charcoal'
              )}
            >
              {mode === 'register' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-foodie-border/60"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">Create Account</span>
              <Gift className="w-3 h-3 text-foodie-amber-dark relative z-10 hidden sm:inline" />
            </button>
          </div>

          {/* ERROR ALERT BANNER */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-2xl bg-red-50 text-foodie-red text-xs font-bold flex items-center gap-2 border border-red-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{authError}</span>
            </motion.div>
          )}

          {/* FORGOT PASSWORD SUCCESS TOAST */}
          {forgotSent && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password reset instructions sent to your email!</span>
            </motion.div>
          )}

          {/* FORMS CONTAINER (TOP SECTION) */}
          <div className="mt-3.5">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                /* ================= SIGN IN FORM ================= */
                <motion.form
                  key="login-view"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit(onLogin)}
                  className="space-y-3"
                >
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-foodie-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        {...loginRegister('email')}
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:bg-white transition-all',
                          loginErrors.email
                            ? 'border-foodie-red focus:ring-2 focus:ring-red-100'
                            : 'border-foodie-border focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/25'
                        )}
                      />
                    </div>
                    {loginErrors.email && (
                      <span className="text-[10px] font-bold text-foodie-red block pl-1">
                        {loginErrors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-foodie-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...loginRegister('password')}
                        className={cn(
                          'w-full pl-10 pr-10 py-2.5 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:bg-white transition-all',
                          loginErrors.password
                            ? 'border-foodie-red focus:ring-2 focus:ring-red-100'
                            : 'border-foodie-border focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/25'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foodie-muted hover:text-foodie-charcoal p-1 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <span className="text-[10px] font-bold text-foodie-red block pl-1">
                        {loginErrors.password.message}
                      </span>
                    )}
                  </div>

                  {/* Remember & Forgot options */}
                  <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                    <label className="flex items-center gap-2 text-foodie-muted cursor-pointer select-none hover:text-foodie-charcoal transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-foodie-yellow w-3.5 h-3.5 rounded"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-foodie-amber-dark hover:underline font-bold text-[11px]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Primary CTA */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-foodie-yellow via-[#FFB800] to-foodie-amber-dark text-foodie-charcoal font-black text-sm rounded-2xl shadow-foodie-glow hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-70 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-foodie-charcoal" />
                    ) : (
                      <span>Sign In to Foodie 🍔</span>
                    )}
                  </motion.button>

                  {/* 1-Click Quick Demo Pill */}
                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={fillDemoAccount}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-[11px] font-bold text-foodie-amber-dark transition-colors"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Fill Demo Credentials (1-Click)</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* ================= CREATE ACCOUNT FORM ================= */
                <motion.form
                  key="register-view"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegSubmit(onRegister)}
                  className="space-y-2.5"
                >
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-foodie-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Alex Johnson"
                        {...regRegister('fullName')}
                        className={cn(
                          'w-full pl-10 pr-4 py-2 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:bg-white transition-all',
                          regErrors.fullName
                            ? 'border-foodie-red focus:ring-2 focus:ring-red-100'
                            : 'border-foodie-border focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/25'
                        )}
                      />
                    </div>
                    {regErrors.fullName && (
                      <span className="text-[10px] font-bold text-foodie-red block pl-1">
                        {regErrors.fullName.message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-foodie-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        {...regRegister('email')}
                        className={cn(
                          'w-full pl-10 pr-4 py-2 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:bg-white transition-all',
                          regErrors.email
                            ? 'border-foodie-red focus:ring-2 focus:ring-red-100'
                            : 'border-foodie-border focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/25'
                        )}
                      />
                    </div>
                    {regErrors.email && (
                      <span className="text-[10px] font-bold text-foodie-red block pl-1">
                        {regErrors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-foodie-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 234-5678"
                        {...regRegister('phone')}
                        className={cn(
                          'w-full pl-10 pr-4 py-2 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted/70 focus:outline-none focus:bg-white transition-all',
                          regErrors.phone
                            ? 'border-foodie-red focus:ring-2 focus:ring-red-100'
                            : 'border-foodie-border focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/25'
                        )}
                      />
                    </div>
                    {regErrors.phone && (
                      <span className="text-[10px] font-bold text-foodie-red block pl-1">
                        {regErrors.phone.message}
                      </span>
                    )}
                  </div>

                  {/* Passwords in 2 columns */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...regRegister('password')}
                          className={cn(
                            'w-full pl-3 pr-7 py-2 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted focus:outline-none focus:bg-white transition-all',
                            regErrors.password
                              ? 'border-foodie-red'
                              : 'border-foodie-border focus:border-foodie-yellow'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-foodie-muted hover:text-foodie-charcoal p-0.5"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black uppercase text-foodie-charcoal tracking-wide block">
                        Confirm
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...regRegister('confirmPassword')}
                          className={cn(
                            'w-full pl-3 pr-7 py-2 bg-foodie-app/80 rounded-2xl border text-xs font-bold text-foodie-charcoal placeholder:text-foodie-muted focus:outline-none focus:bg-white transition-all',
                            regErrors.confirmPassword
                              ? 'border-foodie-red'
                              : 'border-foodie-border focus:border-foodie-yellow'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-foodie-muted hover:text-foodie-charcoal p-0.5"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {(regErrors.password || regErrors.confirmPassword) && (
                    <span className="text-[10px] font-bold text-foodie-red block pl-1">
                      {regErrors.password?.message || regErrors.confirmPassword?.message}
                    </span>
                  )}

                  {/* Fresh Account Badge */}
                  <div className="p-2 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-center gap-2 text-[10px] font-bold text-amber-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-foodie-amber-dark shrink-0" />
                    <span>Fresh Foodie Account • Fast Delivery • 100% Secure</span>
                  </div>

                  {/* Register CTA */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-foodie-yellow via-[#FFB800] to-foodie-amber-dark text-foodie-charcoal font-black text-sm rounded-2xl shadow-foodie-glow hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-0.5 disabled:opacity-70 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-foodie-charcoal" />
                    ) : (
                      <span>Create Free Account ✨</span>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* SOCIAL ACCOUNTS WITH ICONS (PLACED AT BOTTOM BELOW LOGIN FIELDS) */}
          <div className="mt-4 space-y-2.5">
            {/* Modern Divider */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-foodie-border" />
              </div>
              <span className="relative bg-white px-3 text-[10px] text-foodie-muted font-black uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Buttons Row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Google */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSocialSignIn('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-foodie-app/80 hover:bg-white border border-foodie-border hover:border-foodie-yellow/60 shadow-xs hover:shadow-md transition-all group"
                title="Continue with Google"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs font-black text-foodie-charcoal group-hover:text-amber-900">
                  Google
                </span>
              </motion.button>

              {/* Apple */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSocialSignIn('Apple')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-foodie-app/80 hover:bg-white border border-foodie-border hover:border-foodie-yellow/60 shadow-xs hover:shadow-md transition-all group"
                title="Continue with Apple"
              >
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-foodie-charcoal group-hover:text-black"
                  viewBox="0 0 170 170"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-5.77-8.87-10.36-19.12-13.78-30.76-3.41-11.64-5.12-22.75-5.12-33.32 0-14.77 3.56-27.18 10.68-37.23 7.12-10.05 16.5-15.17 28.16-15.37 5.17 0 10.97 1.34 17.38 4.02 6.42 2.68 10.42 4.07 12 4.07 1.35 0 5.48-1.42 12.38-4.27 6.9-2.85 12.73-4.14 17.5-3.87 13.51.68 24.31 5.62 32.38 14.82-11.83 7.17-17.61 16.9-17.34 29.21.27 9.8 4.09 17.96 11.45 24.48 7.37 6.53 16.21 10.15 26.54 10.86-2.22 6.64-4.88 13.06-7.98 19.26zM119.22 33.16c0-7.39 2.66-14.32 7.97-20.78 5.31-6.47 11.95-10.59 19.92-12.38.54 1.77.81 3.55.81 5.34 0 7.4-2.81 14.54-8.43 21.43-5.62 6.9-12.37 10.98-20.27 12.24z" />
                </svg>
                <span className="text-xs font-black text-foodie-charcoal group-hover:text-black">
                  Apple
                </span>
              </motion.button>

              {/* Facebook */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSocialSignIn('Facebook')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-foodie-app/80 hover:bg-white border border-foodie-border hover:border-foodie-yellow/60 shadow-xs hover:shadow-md transition-all group"
                title="Continue with Facebook"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs font-black text-foodie-charcoal group-hover:text-[#1877F2]">
                  Facebook
                </span>
              </motion.button>
            </div>
          </div>

          {/* BOTTOM TOGGLE PROMPT */}
          <div className="mt-4 text-center text-xs text-foodie-muted pt-2.5 border-t border-foodie-border/70 flex items-center justify-center gap-1">
            <span>
              {mode === 'login' ? "Don't have an account yet?" : 'Already have a Foodie account?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-foodie-amber-dark font-black hover:underline transition-all"
            >
              {mode === 'login' ? 'Create One Free' : 'Sign In Here'}
            </button>
          </div>

          {/* ENCRYPTION BADGE FOOTER */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-foodie-muted/70 font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>256-Bit Encrypted • Safe & Secure</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
