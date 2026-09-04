import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Fuel, 
  Car, 
  Navigation, 
  Wrench, 
  Calendar, 
  Layers,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import { ExpenseRecord, ServiceRecord, MileageRecord, Vehicle } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'expenses' | 'services' | 'mileage';
  vehicle: Vehicle | null;
  expenses?: ExpenseRecord[];
  services?: ServiceRecord[];
  mileage?: MileageRecord[];
  currentSelectedMonth?: string; // YYYY-MM or 'all'
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  type,
  vehicle,
  expenses = [],
  services = [],
  mileage = [],
  currentSelectedMonth = 'all'
}) => {
  // Common share options
  const [periodOption, setPeriodOption] = useState<'current_month' | 'all'>('current_month');
  const [copied, setCopied] = useState(false);

  // Expense specific filters: Minyak, Tol, Parking
  const [includeMinyak, setIncludeMinyak] = useState(true);
  const [includeTol, setIncludeTol] = useState(true);
  const [includeParking, setIncludeParking] = useState(true);

  if (!isOpen) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentMonthName = now.toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' });

  // Filter vehicle specific records if vehicle is active
  const filterByVeh = (recordVehId?: string) => {
    if (!vehicle) return true;
    return !recordVehId || recordVehId === vehicle.id;
  };

  const isCurrentMonth = (timestampOrDate: number) => {
    const d = new Date(timestampOrDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  };

  // Generate shareable text and stats based on type
  let title = 'Kongsi Ringkasan';
  let formattedText = '';
  let summaryCards: { label: string; value: string; color: string }[] = [];

  const vehName = vehicle ? `${vehicle.plateNumber} (${vehicle.brand} ${vehicle.model})` : 'Semua Kenderaan';

  if (type === 'expenses') {
    title = 'Kongsi Rekod Perbelanjaan Harian';

    const selectedCategories: string[] = [];
    if (includeMinyak) selectedCategories.push('Minyak');
    if (includeTol) selectedCategories.push('Tol');
    if (includeParking) selectedCategories.push('Parking');

    const filtered = expenses.filter(item => {
      if (!filterByVeh(item.vehicleId)) return false;
      if (!selectedCategories.includes(item.category)) return false;
      if (periodOption === 'current_month') {
        return isCurrentMonth(item.timestamp);
      }
      return true;
    }).sort((a, b) => a.timestamp - b.timestamp);

    let totalMinyak = 0;
    let totalLiters = 0;
    let totalTol = 0;
    let totalParking = 0;

    filtered.forEach(item => {
      const amt = Number(item.amount) || 0;
      if (item.category === 'Minyak') {
        totalMinyak += amt;
        if (item.liters) totalLiters += Number(item.liters);
      }
      if (item.category === 'Tol') totalTol += amt;
      if (item.category === 'Parking') totalParking += amt;
    });

    const grandTotal = totalMinyak + totalTol + totalParking;
    const periodLabel = periodOption === 'current_month' ? `Bulan ${currentMonthName}` : 'Keseluruhan Rekod';

    summaryCards = [
      { label: 'Jumlah Keseluruhan', value: `RM ${grandTotal.toFixed(2)}`, color: 'text-orange-400' },
      { label: 'Bilangan Rekod', value: `${filtered.length} Transaksi`, color: 'text-slate-200' },
    ];

    if (includeMinyak) summaryCards.push({ label: 'Minyak', value: `RM ${totalMinyak.toFixed(2)} (${totalLiters.toFixed(1)}L)`, color: 'text-emerald-400' });
    if (includeTol) summaryCards.push({ label: 'Tol', value: `RM ${totalTol.toFixed(2)}`, color: 'text-amber-400' });
    if (includeParking) summaryCards.push({ label: 'Parking', value: `RM ${totalParking.toFixed(2)}`, color: 'text-indigo-400' });

    let lines = [
      `📊 *LAPORAN PERBELANJAAN KENDERAAN - AUTOKIRA*`,
      `🚗 Kenderaan: ${vehName}`,
      `📅 Tempoh: ${periodLabel}`,
      `🏷️ Kategori: ${selectedCategories.join(', ') || 'Tiada'}`,
      `---------------------------------`,
      `💰 *RINGKASAN KOS:*`,
    ];

    if (includeMinyak) lines.push(`• Minyak: RM ${totalMinyak.toFixed(2)} (${totalLiters.toFixed(2)} Liter)`);
    if (includeTol) lines.push(`• Tol: RM ${totalTol.toFixed(2)}`);
    if (includeParking) lines.push(`• Parking: RM ${totalParking.toFixed(2)}`);

    lines.push(`➡️ *JUMLAH KESELURUHAN: RM ${grandTotal.toFixed(2)}*`);
    lines.push(`---------------------------------`);
    lines.push(`📝 *SENARAI TRANSAKSI (${filtered.length}):*`);

    if (filtered.length === 0) {
      lines.push(`(Tiada rekod untuk pilihan ini)`);
    } else {
      filtered.forEach((item, idx) => {
        const d = new Date(item.timestamp).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const extra = item.category === 'Minyak' ? ` [${item.fuelBrand || 'Petrol'} • ${item.liters || 0}L]` : '';
        lines.push(`${idx + 1}. ${d} | ${item.category} | RM ${Number(item.amount).toFixed(2)}${extra} (${item.tripType || '-'})`);
      });
    }

    lines.push(`---------------------------------`);
    lines.push(`_Dijana secara automatik melalui Aplikasi AutoKira_`);

    formattedText = lines.join('\n');

  } else if (type === 'services') {
    title = 'Kongsi Rekod Servis & Penyelenggaraan';

    const filtered = services.filter(item => {
      if (!filterByVeh(item.vehicleId)) return false;
      if (periodOption === 'current_month') {
        return isCurrentMonth(item.serviceDate || item.timestamp);
      }
      return true;
    }).sort((a, b) => (a.serviceDate || a.timestamp) - (b.serviceDate || b.timestamp));

    const totalCost = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const periodLabel = periodOption === 'current_month' ? `Bulan ${currentMonthName}` : 'Keseluruhan Rekod';

    summaryCards = [
      { label: 'Jumlah Kos Servis', value: `RM ${totalCost.toFixed(2)}`, color: 'text-indigo-400' },
      { label: 'Bilangan Servis', value: `${filtered.length} Rekod`, color: 'text-slate-200' },
    ];

    let lines = [
      `🔧 *REKOD PENYELENGGARAAN & SERVIS - AUTOKIRA*`,
      `🚗 Kenderaan: ${vehName}`,
      `📅 Tempoh: ${periodLabel}`,
      `⚙️ Odometer Semasa: ${vehicle?.currentOdometer ? vehicle.currentOdometer.toLocaleString() + ' KM' : '-'}`,
      `🎯 Sasaran Servis Seterusnya: ${vehicle?.targetNextServiceKm ? vehicle.targetNextServiceKm.toLocaleString() + ' KM' : '-'}`,
      `---------------------------------`,
      `💰 *JUMLAH KOS SERVIS: RM ${totalCost.toFixed(2)}*`,
      `---------------------------------`,
      `📝 *SENARAI REKOD SERVIS (${filtered.length}):*`,
    ];

    if (filtered.length === 0) {
      lines.push(`(Tiada rekod servis untuk pilihan ini)`);
    } else {
      filtered.forEach((item, idx) => {
        const d = new Date(item.serviceDate || item.timestamp).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const odo = item.mileage ? `${item.mileage.toLocaleString()} KM` : 'N/A';
        lines.push(`${idx + 1}. ${d} | RM ${Number(item.amount).toFixed(2)} | Odo: ${odo}`);
        lines.push(`   📍 Bengkel: ${item.location || 'Pusat Servis'}`);
        if (item.notes) lines.push(`   📝 Nota: ${item.notes}`);
      });
    }

    lines.push(`---------------------------------`);
    lines.push(`_Dijana secara automatik melalui Aplikasi AutoKira_`);

    formattedText = lines.join('\n');

  } else if (type === 'mileage') {
    title = 'Kongsi Tuntutan Mileage (KM)';

    const filtered = mileage.filter(item => {
      if (!filterByVeh(item.vehicleId)) return false;
      if (periodOption === 'current_month') {
        return isCurrentMonth(item.date || item.timestamp);
      }
      return true;
    }).sort((a, b) => (a.date || a.timestamp) - (b.date || b.timestamp));

    let totalKM = 0;
    let totalClaim = 0;

    filtered.forEach(item => {
      totalKM += Number(item.km) || 0;
      totalClaim += Number(item.amount) || 0;
    });

    const periodLabel = periodOption === 'current_month' ? `Bulan ${currentMonthName}` : 'Keseluruhan Rekod';

    summaryCards = [
      { label: 'Jumlah Tuntutan', value: `RM ${totalClaim.toFixed(2)}`, color: 'text-rose-400' },
      { label: 'Jumlah Jarak', value: `${totalKM.toLocaleString()} KM`, color: 'text-white' },
      { label: 'Bilangan Perjalanan', value: `${filtered.length} Trip`, color: 'text-slate-300' },
    ];

    let lines = [
      `🚗 *BORANG TUNTUTAN ELAUN PERJALANAN / MILEAGE*`,
      `🚙 Kenderaan: ${vehName}`,
      `📅 Tempoh Tuntutan: ${periodLabel}`,
      `🛣️ Jumlah Jarak: ${totalKM.toLocaleString()} KM`,
      `💵 *JUMLAH TUNTUTAN: RM ${totalClaim.toFixed(2)}*`,
      `---------------------------------`,
      `📝 *BUTIRAN PERJALANAN RASMI (${filtered.length}):*`,
    ];

    if (filtered.length === 0) {
      lines.push(`(Tiada rekod perjalanan untuk pilihan ini)`);
    } else {
      filtered.forEach((item, idx) => {
        const d = new Date(item.date || item.timestamp).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const rateDisplay = item.ratePerKm ? ` (Kadar: RM${item.ratePerKm}/KM)` : '';
        lines.push(`${idx + 1}. ${d} | ${item.km} KM ➡️ RM ${Number(item.amount).toFixed(2)}${rateDisplay}`);
        lines.push(`   📍 Lokasi: ${item.location || '-'}`);
        lines.push(`   🎯 Tujuan: ${item.reason || '-'}`);
      });
    }

    lines.push(`---------------------------------`);
    lines.push(`_Dijana secara automatik melalui Aplikasi AutoKira_`);

    formattedText = lines.join('\n');
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(formattedText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: formattedText,
        });
      } catch (err) {
        console.log('Share dismissed or failed', err);
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#141822] border border-white/10 rounded-t-[2.5rem] sm:rounded-3xl max-h-[90dvh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 flex justify-center">
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{vehName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1e2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Period Selector (Bulan Semasa vs Jumlah Keseluruhan) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. Pilih Tempoh Rekod
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#1b202c] border border-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPeriodOption('current_month')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  periodOption === 'current_month'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Bulan Semasa ({currentMonthName})</span>
              </button>
              <button
                type="button"
                onClick={() => setPeriodOption('all')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  periodOption === 'all'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Jumlah Keseluruhan</span>
              </button>
            </div>
          </div>

          {/* If Expense: Category Checkboxes (Minyak, Tol, Parking) */}
          {type === 'expenses' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                2. Pilih Kategori Perbelanjaan Untuk Dikongsi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeMinyak(!includeMinyak)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeMinyak
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Fuel className="w-4 h-4" />
                  <span>Minyak</span>
                  <span className="text-[10px] font-semibold">{includeMinyak ? '✓ Aktif' : 'Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeTol(!includeTol)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeTol
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Tol</span>
                  <span className="text-[10px] font-semibold">{includeTol ? '✓ Aktif' : 'Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeParking(!includeParking)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeParking
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Parking</span>
                  <span className="text-[10px] font-semibold">{includeParking ? '✓ Aktif' : 'Off'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Pill Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {summaryCards.map((sc, i) => (
              <div key={i} className="bg-[#1b202c] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {sc.label}
                </span>
                <span className={`text-sm font-extrabold ${sc.color} mt-0.5 block truncate`}>
                  {sc.value}
                </span>
              </div>
            ))}
          </div>

          {/* Formatted Report Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pratonton Format Teks Ringkasan
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Telah Disalin!' : 'Salin Teks'}</span>
              </button>
            </div>
            <div className="bg-[#0e1118] border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto select-all leading-relaxed shadow-inner">
              {formattedText}
            </div>
          </div>
        </div>

        {/* Footer Share Action Buttons */}
        <div className="p-4 border-t border-white/5 flex gap-2.5 bg-[#141822]">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          {'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex-1 py-3 px-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kongsi</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyText}
            className="py-3 px-4 rounded-2xl bg-[#1e2432] hover:bg-[#283142] text-slate-200 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Disalin' : 'Salin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
