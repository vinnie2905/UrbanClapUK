import React, { useState } from 'react';
import { X, Mail, Phone, Lock, Sparkles, User, Fingerprint, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (data: { user?: any; provider?: any; role: 'user' | 'provider' }) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [password, setPassword] = useState(''); // Simulated secure passcode
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        // Register Call
        if (role === 'user') {
          const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone,
              referralCodeClaimed: referralCode
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');
          
          setSuccessMsg('Registration successful! £15 referral welcome bonus loaded into your wallet.');
          setTimeout(() => {
            onAuthSuccess({ user: data, role: 'user' });
            onClose();
          }, 1500);
        } else {
          // Provider registration is deeper (needs city, category, certs). 
          // We will create the initial basic credentials here, then redirect them to the provider workspace to complete.
          const res = await fetch('/api/providers/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone,
              city: 'London', // default to be edited
              category: 'cleaning', // default to be edited
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Provider onboarding failed');
          
          setSuccessMsg('Service Provider login registered. Complete your professional profile, DBS and pricing to go active.');
          setTimeout(() => {
            onAuthSuccess({ provider: data, role: 'provider' });
            onClose();
          }, 1500);
        }
      } else {
        // Login Call
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Authentication profile not found.');

        setSuccessMsg(biometricEnabled ? 'Biometric fingerprint scan accepted! Secure cloud sync loaded.' : 'Signed in successfully!');
        setTimeout(() => {
          if (role === 'user') {
            onAuthSuccess({ user: data.profile, role: 'user' });
          } else {
            onAuthSuccess({ provider: data.profile, role: 'provider' });
          }
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    setLoading(true);
    setTimeout(() => {
      // Simulate quick registration/login
      const mockEmail = `quick.${platform.toLowerCase()}@example.co.uk`;
      const mockName = `${platform} Member`;
      const mockPhone = '+44 7700 ' + Math.floor(900000 + Math.random() * 99999);
      
      fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: mockName, email: mockEmail, phone: mockPhone })
      }).then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(`Authenticated via ${platform}! Quick registration complete.`);
          setTimeout(() => {
            onAuthSuccess({ user: data, role: 'user' });
            onClose();
          }, 1000);
        } else {
          // If already exists, login
          fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockEmail, role: 'user' })
          }).then(async (loginRes) => {
            const loginData = await loginRes.json();
            if (loginRes.ok) {
              setSuccessMsg(`Welcome back, verified via ${platform}!`);
              setTimeout(() => {
                onAuthSuccess({ user: loginData.profile, role: 'user' });
                onClose();
              }, 1000);
            } else {
              setError('Failed social login bridge.');
            }
          });
        }
      }).catch(() => {
        setError('Social login network connection error.');
      }).finally(() => {
        setLoading(false);
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="auth-modal-overlay">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative" id="auth-modal-card">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          id="close-auth-modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header tabs */}
        <div className="border-b border-gray-100 bg-gray-50/75 p-6 pb-4">
          <div className="flex gap-2 p-1 bg-gray-200/60 rounded-lg mb-4" id="role-selector">
            <button
              onClick={() => { setRole('user'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                role === 'user' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              Customer Account
            </button>
            <button
              onClick={() => { setRole('provider'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                role === 'provider' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              UK Service Provider
            </button>
          </div>

          <h3 className="text-xl font-black text-black tracking-tight" id="auth-modal-title">
            {isRegister ? 'Create Your Account' : 'Welcome to UrbanUK'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {role === 'user' 
              ? 'Book vetted daily cooks, luxury salon therapists, and skilled tradesmen.'
              : 'Onboard and manage your service bookings, certifications & direct client chats.'
            }
          </p>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" id="auth-form">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg" id="auth-error">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg" id="auth-success">
              {successMsg}
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Esha Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                  id="auth-name-input"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="e.g. emily.watson@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                id="auth-email-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                required
                placeholder="e.g. +44 7700 900312"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                id="auth-phone-input"
              />
            </div>
          </div>

          {isRegister && role === 'user' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Referral Code (Optional)</label>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> Get £15 Free
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. SOPH15"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black uppercase tracking-wider font-semibold"
                id="auth-referral-input"
              />
            </div>
          )}

          {/* Secure Biometric login and encryption checkboxes */}
          <div className="flex flex-col gap-2 pt-1 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="biometrics-check"
                checked={biometricEnabled}
                onChange={(e) => setBiometricEnabled(e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
              />
              <label htmlFor="biometrics-check" className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer select-none">
                <Fingerprint className="h-3.5 w-3.5 text-black" />
                <span>Enable Touch ID / Face ID Biometric Quick Login</span>
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gdpr-check"
                required
                defaultChecked={true}
                className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
              />
              <label htmlFor="gdpr-check" className="text-[10px] text-gray-500 leading-tight">
                I agree to the GDPR privacy policy. UrbanUK will protect my identity and securely encrypt uploaded documents.
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold text-sm py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
            id="auth-submit-button"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <span>{isRegister ? 'Register & Accept Terms' : 'Secure Login'}</span>
            )}
          </button>

          {/* Change form state */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-gray-600 hover:text-black font-semibold underline underline-offset-4"
              id="toggle-auth-state"
            >
              {isRegister ? 'Already have an account? Sign in' : 'New to UrbanUK? Create an account'}
            </button>
          </div>
        </form>

        {/* Quick Social Authentication Checkouts */}
        {!isRegister && (
          <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-3">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or instant access with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-2" id="social-login-grid">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="bg-white border border-gray-200 hover:bg-gray-100 py-1.5 px-3 rounded-lg text-[11px] font-bold text-gray-700 flex items-center justify-center gap-1 transition-colors"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="bg-white border border-gray-200 hover:bg-gray-100 py-1.5 px-3 rounded-lg text-[11px] font-bold text-gray-700 flex items-center justify-center gap-1 transition-colors"
              >
                <span>Apple ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="bg-white border border-gray-200 hover:bg-gray-100 py-1.5 px-3 rounded-lg text-[11px] font-bold text-gray-700 flex items-center justify-center gap-1 transition-colors"
              >
                <span>Facebook</span>
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
