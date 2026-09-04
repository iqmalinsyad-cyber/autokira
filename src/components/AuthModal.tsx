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
  Download,
  Trash2
} from 'lucide-react';
import { UserProfile } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

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
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  if (!isOpen) return null;

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

  const handleInstallClick = async () => {
    const success = await installPWA();
    if (!success && !isInstallable) {
      setShowInstallGuide(true);
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

            {/* PWA Install Button inside Profile */}
            {!isInstalled && (
              <div className="mt-4">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Pasang Aplikasi (Install App)</span>
                </button>
              </div>
            )}

            <div className="mt-4 space-y-2">
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

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => onGoogleSignIn()}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98 cursor-pointer"
              >
                <span>Log Masuk Dengan Google</span>
              </button>

              {!isInstalled && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#1e2432] hover:bg-[#283142] text-orange-400 font-bold text-xs flex items-center justify-center gap-2 border border-white/5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pasang Aplikasi (Install App)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Manual Install Guide */}
        {showInstallGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#141822] border border-orange-500/30 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-sm text-white">Cara Pasang pada Telefon</h3>
                </div>
                <button
                  onClick={() => setShowInstallGuide(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-[#1b212f] p-3 rounded-2xl border border-white/5 space-y-1.5">
                  <p className="font-bold text-orange-400">Pengguna Android (Chrome):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                    <li>Tekan ikon <strong>tiga titik (⋮)</strong> di sudut atas browser.</li>
                    <li>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong>.</li>
                    <li>Tekan <strong>"Install"</strong> untuk simpan ke skrin utama.</li>
                  </ol>
                </div>

                <div className="bg-[#1b212f] p-3 rounded-2xl border border-white/5 space-y-1.5">
                  <p className="font-bold text-orange-400">Pengguna iOS / iPhone (Safari):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                    <li>Tekan butang <strong>Share</strong> (ikon anak panah atas).</li>
                    <li>Pilih <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tekan <strong>"Add"</strong>.</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-2.5 bg-orange-500 text-white font-extrabold rounded-xl text-xs hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
