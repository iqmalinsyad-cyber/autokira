import React, { useState } from 'react';
import { 
  Sparkles, 
  Car, 
  Fuel, 
  Wrench, 
  Navigation, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Gauge,
  Smartphone,
  Download,
  X
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface LoginPageProps {
  onGoogleSignIn: (customEmail?: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoogleSignIn,
  isLoading = false
}) => {
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  const mainLogoUrl = "https://lh3.googleusercontent.com/d/1GIRN_j3cMTDYDhfKbNocxUb7_ZCO2uHq";

  const handleInstallClick = async () => {
    const success = await installPWA();
    if (!success && !isInstallable) {
      setShowInstallGuide(true);
    }
  };

  const handleStandardSignIn = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      await onGoogleSignIn();
    } catch (err: any) {
      console.warn("Sign-in attempt notice:", err);
      setErrorNotice("Sila pastikan sambungan internet anda aktif dan cuba sekali lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#080a0f] text-slate-100 flex flex-col justify-between items-center px-4 sm:px-6 py-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center items-center z-10 my-auto">
        
        {/* Logo Section */}
        <div className="text-center mb-5 relative">
          <div className="relative inline-block group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#1b202c] via-[#222838] to-[#161a24] p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-white/10 mx-auto transition-transform duration-300 group-hover:scale-105">
              <img 
                src={mainLogoUrl} 
                alt="AutoKira Logo" 
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_5px_15px_rgba(249,115,22,0.3)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('logo-login-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-login-fallback" className="hidden w-full h-full rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 items-center justify-center text-white font-black text-2xl">
                AK
              </div>
            </div>
            
            <div className="absolute -bottom-2 -right-2 bg-[#0d1017] border border-orange-500/30 p-1.5 rounded-xl shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-orange-400" />
              <span>Automotive Engine OS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Kira</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              Sistem Pengurusan Kos & Penyelenggaraan Kenderaan Pintar
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full bg-[#11141d]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl mb-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#181d28] border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Fuel className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Kos Petrol</p>
                <p className="text-[9px] text-slate-400 truncate">7 Jenama Stesen</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#181d28] border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Rekod Servis</p>
                <p className="text-[9px] text-slate-400 truncate">Peringatan KM</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#181d28] border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Profil Garaj</p>
                <p className="text-[9px] text-slate-400 truncate">Kereta & Motorsikal</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#181d28] border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Tuntutan KM</p>
                <p className="text-[9px] text-slate-400 truncate">RM 0.70 / KM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification if any */}
        {errorNotice && (
          <div className="w-full mb-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Makluman</p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">{errorNotice}</p>
            </div>
          </div>
        )}

        {/* EXCLUSIVE GOOGLE SIGN-IN BUTTON & PWA INSTALL */}
        <div className="w-full space-y-3">
          <button
            onClick={handleStandardSignIn}
            disabled={loading || isLoading}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.25)] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading || isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <span className="tracking-wide">Menyambung ke Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google G SVG */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="tracking-wide">Log Masuk Dengan Google</span>
              </>
            )}
          </button>

          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-2xl bg-[#181d28] hover:bg-[#222836] border border-orange-500/30 hover:border-orange-500 text-orange-400 font-extrabold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Pasang Aplikasi (Install App)</span>
            </button>
          )}
        </div>

      </div>

      {/* Manual Install Guide Modal for iOS & Android */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141822] border border-orange-500/30 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-sm text-white">Panduan Pasang Aplikasi</h3>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-[#1b212f] p-3.5 rounded-2xl border border-white/5 space-y-1.5">
                <p className="font-bold text-orange-400">Pengguna Android (Google Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                  <li>Tekan ikon <strong>tiga titik (⋮)</strong> di penjuru atas browser.</li>
                  <li>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong>.</li>
                  <li>Tekan <strong>"Install"</strong> untuk simpan ke skrin utama telefon.</li>
                </ol>
              </div>

              <div className="bg-[#1b212f] p-3.5 rounded-2xl border border-white/5 space-y-1.5">
                <p className="font-bold text-orange-400">Pengguna iPhone / iOS (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                  <li>Tekan butang <strong>Share</strong> (ikon kotak & anak panah atas).</li>
                  <li>Tatal ke bawah dan pilih <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tekan <strong>"Add"</strong> di penjuru atas kanan.</li>
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

      {/* Footer Branding */}
      <footer className="w-full max-w-md mx-auto text-center pt-3 border-t border-white/5 z-10">
        <p className="text-[10px] text-slate-500 font-medium">
          AutoKira Automotive Engine • Hak Cipta Terpelihara
        </p>
      </footer>

    </div>
  );
};
