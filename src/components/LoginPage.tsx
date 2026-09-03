import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Fuel, 
  Wrench, 
  Navigation, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Gauge
} from 'lucide-react';

interface LoginPageProps {
  onGoogleSignIn: () => Promise<void>;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoogleSignIn,
  isLoading = false
}) => {
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const mainLogoUrl = "https://lh3.googleusercontent.com/d/1_01si5AB3HnnGTqYCzJibcuclz5emcyq";

  const handleSignInClick = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      await onGoogleSignIn();
    } catch (err: any) {
      console.warn("Sign-in attempt notice:", err);
      setErrorNotice("Sila pastikan pop-up pelayar dibenarkan atau teruskan dengan pengesahan Google.");
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
        <div className="text-center mb-6 relative">
          <div className="relative inline-block group">
            {/* Glowing ring around logo */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 rounded-3xl opacity-75 blur-md group-hover:opacity-100 transition duration-500"></div>
            
            {/* Main Logo Container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-[#141822] border-2 border-white/15 p-2.5 flex items-center justify-center shadow-2xl overflow-hidden">
              <img 
                src={mainLogoUrl} 
                alt="AutoKira Official Logo" 
                className="w-full h-full object-contain rounded-xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Graceful fallback if image load is blocked
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'fallback-icon flex flex-col items-center justify-center text-orange-400';
                    fallbackDiv.innerHTML = '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
                    parent.appendChild(fallbackDiv);
                  }
                }}
              />
            </div>

            {/* Online Pulse Indicator */}
            <div className="absolute -bottom-1 -right-1 bg-[#141822] p-1 rounded-full border border-white/10 shadow-lg">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block animate-pulse"></span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="mt-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Automotive Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Auto<span className="text-orange-500">Kira</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed font-medium">
              Sistem Pintar Penyelenggaraan, Kos Harian & Tuntutan Mileage Kenderaan
            </p>
          </div>
        </div>

        {/* Feature Highlights Bento Box */}
        <div className="w-full bg-[#131720]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl mb-6 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Ciri-ciri Utama</span>
            <span className="text-orange-400 font-extrabold">v2.5 Pro</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#181d28] border border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Multi-Kereta</p>
                <p className="text-[10px] text-slate-400 truncate">Pelbagai Profil</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#181d28] border border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Fuel className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Kos Minyak/Tol</p>
                <p className="text-[10px] text-slate-400 truncate">Rekod Terperinci</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#181d28] border border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Radar Servis</p>
                <p className="text-[10px] text-slate-400 truncate">Peringatan 10,000KM</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#181d28] border border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Mileage Claim</p>
                <p className="text-[10px] text-slate-400 truncate">Auto RM 0.70/KM</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Awan Firebase Firestore
            </span>
            <span>Segerak Automatik</span>
          </div>
        </div>

        {/* Error Notification if any */}
        {errorNotice && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Makluman Log Masuk</p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">{errorNotice}</p>
            </div>
          </div>
        )}

        {/* EXCLUSIVE GOOGLE SIGN-IN SECTION */}
        <div className="w-full space-y-3">
          <button
            onClick={handleSignInClick}
            disabled={loading || isLoading}
            className="w-full py-4 px-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm flex items-center justify-center gap-3.5 transition-all duration-200 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.25)] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading || isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <span className="tracking-wide">Menyambung ke Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google G SVG */}
                <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
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
                <span className="tracking-wide">Log Masuk Dengan Google</span>
              </>
            )}
          </button>

          {/* Security & Verification Notice */}
          <div className="flex items-center justify-center gap-2 text-center text-slate-400 text-xs py-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium">
              Pengesahan selamat melalui Google Account
            </span>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 border-t border-white/5 z-10">
        <p className="text-[11px] text-slate-400 font-medium">
          AutoKira Engine • Hak Cipta Terpelihara
        </p>
      </footer>

    </div>
  );
};
