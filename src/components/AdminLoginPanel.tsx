import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginPanelProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginPanel({ onLoginSuccess }: AdminLoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate verification
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'admin@urbanuk.co.uk' && password === 'admin') {
        onLoginSuccess();
      } else {
        setError('Invalid administrative credentials. Please verify and retry.');
      }
      setLoading(false);
    }, 600); // Quick professional loading simulation
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4" id="admin-login-wrapper">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs space-y-6" id="admin-login-card">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-xs" id="admin-icon-container">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Admin Portal Access</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please authenticate using your marketplace administrator credentials.
          </p>
        </div>

        {/* Credential Helper Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] text-gray-600 space-y-1" id="admin-credentials-hint">
          <span className="font-extrabold text-indigo-950 uppercase tracking-wider block mb-1">Demonstration Credentials:</span>
          <div className="flex justify-between">
            <span className="font-semibold">Admin Email:</span>
            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200/50 font-mono text-indigo-600">admin@urbanuk.co.uk</code>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Password:</span>
            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200/50 font-mono text-indigo-600">admin</code>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5" id="admin-login-error">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="admin-login-form">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="admin@urbanuk.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-600 font-medium text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Security Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-600 font-medium text-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-100 cursor-pointer flex items-center justify-center gap-2 ${
              loading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Authorize Connection</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
