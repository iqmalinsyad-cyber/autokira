import React from 'react';
import { 
  Sparkles, 
  Car, 
  ShieldCheck, 
  Fuel, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  X,
  HelpCircle,
  Wrench
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSetup: () => void;
  userName?: string;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartSetup,
  userName = 'Pengguna'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#141822] border border-white/10 rounded-t-[2.5rem] sm:rounded-3xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 flex justify-center">
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Panduan Pengguna Baru</h3>
              <p className="text-[11px] text-orange-400 font-bold">Selamat Datang ke AutoKira, {userName}!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1e2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tutorial Steps Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Welcome Alert Card */}
          <div className="bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30 rounded-2xl p-4">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-400" />
              Sistem Sedia Untuk Kenderaan Anda
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Segala data permulaan ditetapkan kepada <span className="font-bold text-orange-400">"0"</span>. Sila lengkapkan maklumat kenderaan pertama anda di bawah untuk memulakan pengiraan kos minyak, servis, dan mileage secara automatik.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Langkah Mudah Memulakan:
            </span>

            {/* Step 1 */}
            <div className="flex items-start gap-3.5 bg-[#1b202c] border border-white/5 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 font-extrabold text-xs">
                1
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-extrabold text-white">Daftar Kenderaan Pertama</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Pilih sama ada <strong>Kereta</strong> atau <strong>Motorsikal</strong>, masukkan No. Plat, Jenama, Model, dan Odometer (KM) semasa.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 bg-[#1b202c] border border-white/5 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-extrabold text-xs">
                2
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-extrabold text-white">Tetapkan Insurans & Cukai Jalan</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Masukkan tarikh luput Roadtax dan polisi Insurans untuk mendapatkan peringatan countdown sebelum tarikh tamat.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 bg-[#1b202c] border border-white/5 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-extrabold text-xs">
                3
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-extrabold text-white">Mula Rekod & Pantau Kos</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Catat kos Minyak, Tol, Parking harian, jadual Servis akan datang, dan tuntutan Mileage rasmi (kadar automatik / manual).
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5 bg-[#1b202c] border border-white/5 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-extrabold text-xs">
                4
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-extrabold text-white">Kongsi Laporan & Infografik</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Jana ringkasan laporan teks ke WhatsApp atau muat turun kad <strong>Infografik Media Sosial</strong> untuk dikongsi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 border-t border-white/5 bg-[#141822] flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onStartSetup}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(249,115,22,0.4)] active:scale-98 cursor-pointer"
          >
            <span>Lengkapkan Profil Kenderaan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl bg-[#1b202c] hover:bg-[#222836] text-slate-400 hover:text-white font-bold text-xs transition-colors text-center cursor-pointer"
          >
            Tutup / Nanti Dahulu
          </button>
        </div>
      </div>
    </div>
  );
};
