import React, { useState } from 'react';
import { X, LogIn, LogOut, CheckCircle, ShieldCheck, User, Sparkles, Car } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onGoogleSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onGoogleSignIn,
  onSignOut
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await onGoogleSignIn();
      onClose();
    } catch (err: any) {
      console.warn("Sign in error:", err);
      setErrorMsg("Log masuk Google gagal atau disekat oleh sekatan pelayar iframe. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await onSignOut();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#141822] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <img 
                src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} 
                alt={user.displayName} 
                className="w-full h-full rounded-full object-cover border-4 border-orange-500/30 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#141822] flex items-center justify-center text-white text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white">{user.displayName || 'Pengguna AutoKira'}</h3>
            <p className="text-xs text-orange-400 font-mono mt-0.5">{user.email}</p>

            <div className="mt-4 p-3 rounded-2xl bg-[#1b202c] border border-white/5 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Disahkan dengan Google Account</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Semua data kenderaan, servis, dan tuntutan mileage disegerakkan terus ke awan Firebase.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#1e2432] hover:bg-red-500/20 hover:text-red-400 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Keluar Akaun</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 mx-auto flex items-center justify-center mb-3">
              <Car className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-white">Log Masuk AutoKira</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Sambungkan akaun Google anda untuk menyegerak profil kenderaan & rekod perbelanjaan.
            </p>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-[11px] text-left">
                {errorMsg}
              </div>
            )}

            <div className="mt-6 space-y-2.5">
              {/* Google Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loading ? 'Menyambung...' : 'Log Masuk Dengan Google'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
