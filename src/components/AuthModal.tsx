import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  MailCheck,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail,
  checkIsEmailVerified,
  resendVerificationEmail,
  logOut
} from '../utils/firebase';
import { validateEmail } from '../utils/emailValidator';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userEmail?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Email confirmation state for newly signed up accounts
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setSuccessMsg(null);
    setUnauthorizedDomain(null);
    setCopiedDomain(false);
    setAwaitingVerification(false);
    setPendingUser(null);
    setCheckingVerification(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCopyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  // Google Sign-In with AI / Bot email filtering
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setUnauthorizedDomain(null);
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      // Directly directed back to account without confirming
      setSuccessMsg(`Welcome, ${user.displayName || user.email || 'User'}!`);
      setTimeout(() => {
        onSuccess?.(user.email || undefined);
        handleClose();
      }, 700);
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : '';
        setUnauthorizedDomain(domain);
        setError(`This domain (${domain}) is not authorized in your Firebase Console yet.`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window was closed. Please complete the Google sign-in.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by browser. Please enable popups for this site.');
      } else {
        setError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();

    // 1. Strict validation of email (filters bots, invalid formats, disposable emails)
    const emailCheck = validateEmail(cleanEmail);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || 'Please enter a valid, legitimate email address.');
      return;
    }

    if (!cleanEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        // Sign Up requires email confirmation before continuing
        const user = await signUpWithEmail(cleanEmail, password, displayName.trim());
        setPendingUser(user);
        setAwaitingVerification(true);
        setResendCooldown(60);
        setSuccessMsg(`A verification link has been sent to ${cleanEmail}.`);
      } else {
        // Existing user Sign In: directly directed back to account without confirmation
        const user = await signInWithEmail(cleanEmail, password);
        setSuccessMsg(`Welcome back, ${user.displayName || user.email}!`);
        setTimeout(() => {
          onSuccess?.(user.email || undefined);
          handleClose();
        }, 700);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if user has confirmed their email
  const handleVerifyCheck = async () => {
    if (!pendingUser) return;
    setError(null);
    setCheckingVerification(true);
    try {
      const isVerified = await checkIsEmailVerified(pendingUser);
      if (isVerified) {
        setSuccessMsg('Email successfully confirmed! Welcome to Tubeflow.');
        setTimeout(() => {
          onSuccess?.(pendingUser.email || undefined);
          handleClose();
        }, 800);
      } else {
        setError('Email not confirmed yet. Please click the confirmation link in your inbox or spam folder, then try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not verify status. Please try again.');
    } finally {
      setCheckingVerification(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!pendingUser || resendCooldown > 0) return;
    setError(null);
    try {
      await resendVerificationEmail(pendingUser);
      setResendCooldown(60);
      setSuccessMsg('A fresh verification link has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Could not resend email. Please wait a moment and try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      id="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-[#101622] border border-[#242f44] shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        id="auth-modal-dialog"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-950/80 via-[#141d2c] to-blue-950/60 p-6 border-b border-[#242f44]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1f293d] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              {awaitingVerification ? <MailCheck className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white font-display">
                {awaitingVerification 
                  ? 'Confirm Your Email'
                  : mode === 'signin' 
                    ? 'Sign In to Tubeflow' 
                    : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {awaitingVerification
                  ? 'Verification link sent to your email inbox'
                  : mode === 'signin' 
                    ? 'Access your personal downloads, saved music & preferences'
                    : 'Join Tubeflow for a private, personal music streaming experience'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Notifications */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {unauthorizedDomain && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">How to Fix in Firebase Console (1 Minute):</p>
                  <p className="text-[11px] text-amber-200/90 mt-1 leading-relaxed">
                    Firebase blocks Google sign-in until your app's current domain is listed under <span className="font-semibold text-white">Authorized Domains</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  1. Copy this domain:
                </span>
                <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-xl bg-[#0b0f17] border border-amber-500/25 font-mono text-[11px] text-amber-100">
                  <span className="truncate select-all">{unauthorizedDomain}</span>
                  <button
                    type="button"
                    onClick={handleCopyDomain}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 flex items-center gap-1.5 shrink-0 font-sans text-xs cursor-pointer transition-colors"
                  >
                    {copiedDomain ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-amber-500/20 text-[11px]">
                <span className="text-slate-400">2. Paste it in Firebase Auth Settings:</span>
                <a
                  href="https://console.firebase.google.com/project/tubeflow-21845/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  Open Firebase Settings
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Verification Screen for New Signups */}
          {awaitingVerification ? (
            <div className="space-y-4 py-1" id="email-confirmation-view">
              <div className="p-4 rounded-2xl bg-[#141d2d] border border-cyan-500/25 text-slate-300 text-xs space-y-2.5">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Verify your email to continue</span>
                </p>
                <p className="leading-relaxed text-slate-300">
                  We sent a confirmation link to <span className="font-semibold text-cyan-300 select-all">{pendingUser?.email || email}</span>.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Open your email app, click the verification link, and then press the button below to finish setup.
                </p>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleVerifyCheck}
                disabled={checkingVerification}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                id="btn-confirm-email-done"
              >
                {checkingVerification ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Checking Confirmation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>I've Confirmed My Email</span>
                  </>
                )}
              </button>

              {/* Resend link & Back button */}
              <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
                <button
                  type="button"
                  onClick={async () => {
                    await logOut();
                    setAwaitingVerification(false);
                    setMode('signin');
                  }}
                  className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="text-cyan-400 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:no-underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend link (${resendCooldown}s)` : 'Resend Email'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Sign-In / Sign-Up Form */
            <>
              {/* Google OAuth Button */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 hover:scale-101 active:scale-99"
                  id="btn-google-signin"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>{mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#242f44] w-full" />
                <span className="bg-[#101622] px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  or with email
                </span>
                <div className="border-t border-[#242f44] w-full" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141a26] border border-[#242f44] text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141a26] border border-[#242f44] text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141a26] border border-[#242f44] text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Account & Confirm Email'}</span>
                </button>
              </form>

              {/* Toggle between Sign In and Sign Up */}
              <div className="pt-2 text-center text-xs text-slate-400">
                {mode === 'signin' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                      }}
                      className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Sign Up Free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setError(null);
                      }}
                      className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Security / Privacy Footer */}
        <div className="p-3.5 bg-[#0b0e14] border-t border-[#1e2638] flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured with Firebase Authentication & Bot Email Protection</span>
        </div>
      </div>
    </div>
  );
};
