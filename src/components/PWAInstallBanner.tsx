import React, { useState } from 'react';
import { Download, Sparkles, X, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await installPWA();
    if (!success && !isInstallable) {
      setShowAndroidInstructions(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#1a2233] via-[#1f293d] to-[#1a2233] border-b border-orange-500/30 px-3.5 py-2.5 flex items-center justify-between gap-2.5 text-xs text-white shadow-md relative z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white truncate text-[11px] sm:text-xs">Pasang Aplikasi AutoKira (PWA)</span>
              <span className="text-[9px] font-extrabold bg-orange-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider">Android</span>
            </div>
            <p className="text-[10px] text-slate-300 truncate">Akses pantas terus dari skrin utama telefon & sokongan offline</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang Sekarang</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Tutup banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Android / iOS Manual Instruction Dialog */}
      {showAndroidInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141822] border border-orange-500/30 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-sm text-white">Cara Pasang pada Telefon</h3>
              </div>
              <button
                onClick={() => setShowAndroidInstructions(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-[#1b212f] p-3 rounded-2xl border border-white/5 space-y-1.5">
                <p className="font-bold text-orange-400">Untuk Pengguna Android (Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                  <li>Tekan ikon <strong>tiga titik (⋮)</strong> di bahagian atas kanan browser Chrome.</li>
                  <li>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong>.</li>
                  <li>Tekan <strong>"Install"</strong> untuk simpan AutoKira ke skrin utama.</li>
                </ol>
              </div>

              <div className="bg-[#1b212f] p-3 rounded-2xl border border-white/5 space-y-1.5">
                <p className="font-bold text-orange-400">Untuk Pengguna iOS / iPhone (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                  <li>Tekan butang <strong>Share</strong> (ikon kotak dengan anak panah atas).</li>
                  <li>Skrol ke bawah dan pilih <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tekan <strong>"Add"</strong>.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidInstructions(false)}
              className="w-full py-2.5 bg-orange-500 text-white font-extrabold rounded-xl text-xs hover:bg-orange-600 transition-colors"
            >
              Faham & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
