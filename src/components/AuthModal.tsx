import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  ShieldCheck, 
  User, 
  Sparkles, 
  Car, 
  Database,
  Smartphone,
  Trash2
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onGoogleSignIn: (customEmail?: string) => Promise<void>;
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

  const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
  const mainLogoUrl = "https://lh3.googleusercontent.com/d/1GIRN_j3cMTDYDhfKbNocxUb7_ZCO2uHq";

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

            {/* Storage Mode Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Storan Tempatan (Local Storage)</span>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-[#1b202c] border border-white/5 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Status Akaun Google Aktif</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Semua rekod kos petrol, jadual servis, tuntutan mileage, dan profil kenderaan disimpan secara terasing dan selamat dalam Storan Tempatan (Local Storage) peranti ini.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#1e2432] hover:bg-red-500/20 hover:text-red-400 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Keluar Akaun</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#181d28] border border-white/10 mx-auto flex items-center justify-center mb-3 overflow-hidden p-2 shadow-inner">
              <img 
                src={mainLogoUrl} 
                alt="AutoKira Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="text-lg font-extrabold text-white">Log Masuk AutoKira</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Sambungkan akaun Google anda untuk mula merekod kos dan penyelenggaraan kenderaan.
            </p>

            <div className="mt-6">
              <button
                onClick={() => onGoogleSignIn()}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98 cursor-pointer"
              >
                <span>Log Masuk Dengan Google</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
