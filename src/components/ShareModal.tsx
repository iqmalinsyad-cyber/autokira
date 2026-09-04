import React, { useState, useRef } from 'react';
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
  Download,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { toPng } from 'html-to-image';
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
  // Share mode: 'text' or 'infographic'
  const [shareMode, setShareMode] = useState<'text' | 'infographic'>('text');
  
  // Common share options
  const [periodOption, setPeriodOption] = useState<'current_month' | 'all'>('current_month');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSuccessMsg, setImageSuccessMsg] = useState<string | null>(null);

  // Expense specific filters: Minyak, Tol, Parking
  const [includeMinyak, setIncludeMinyak] = useState(true);
  const [includeTol, setIncludeTol] = useState(true);
  const [includeParking, setIncludeParking] = useState(true);

  const infographicRef = useRef<HTMLDivElement>(null);

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
  let grandTotal = 0;
  let periodLabel = periodOption === 'current_month' ? `Bulan ${currentMonthName}` : 'Keseluruhan Rekod';

  let totalMinyak = 0;
  let totalLiters = 0;
  let totalTol = 0;
  let totalParking = 0;
  let totalKM = 0;
  let totalClaim = 0;
  let totalServiceCost = 0;

  let expenseItemsCount = 0;
  let recentItems: any[] = [];

  const vehName = vehicle ? `${vehicle.plateNumber} (${vehicle.brand} ${vehicle.model})` : 'Semua Kenderaan';
  const vehPlate = vehicle ? vehicle.plateNumber : 'SEMUA';
  const vehModelName = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Semua Kenderaan';

  if (type === 'expenses') {
    title = 'Kongsi Perbelanjaan Harian';

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

    filtered.forEach(item => {
      const amt = Number(item.amount) || 0;
      if (item.category === 'Minyak') {
        totalMinyak += amt;
        if (item.liters) totalLiters += Number(item.liters);
      }
      if (item.category === 'Tol') totalTol += amt;
      if (item.category === 'Parking') totalParking += amt;
    });

    grandTotal = totalMinyak + totalTol + totalParking;
    expenseItemsCount = filtered.length;
    recentItems = filtered.slice(-4).reverse();

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
    lines.push(`_Dijana secara pantas melalui Aplikasi AutoKira_`);

    formattedText = lines.join('\n');

  } else if (type === 'services') {
    title = 'Kongsi Rekod Servis Kenderaan';

    const filtered = services.filter(item => {
      if (!filterByVeh(item.vehicleId)) return false;
      if (periodOption === 'current_month') {
        return isCurrentMonth(item.serviceDate || item.timestamp);
      }
      return true;
    }).sort((a, b) => (a.serviceDate || a.timestamp) - (b.serviceDate || b.timestamp));

    totalServiceCost = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    grandTotal = totalServiceCost;
    recentItems = filtered.slice(-4).reverse();

    summaryCards = [
      { label: 'Jumlah Kos Servis', value: `RM ${totalServiceCost.toFixed(2)}`, color: 'text-indigo-400' },
      { label: 'Bilangan Servis', value: `${filtered.length} Rekod`, color: 'text-slate-200' },
    ];

    let lines = [
      `🔧 *REKOD PENYELENGGARAAN & SERVIS - AUTOKIRA*`,
      `🚗 Kenderaan: ${vehName}`,
      `📅 Tempoh: ${periodLabel}`,
      `⚙️ Odometer Semasa: ${vehicle?.currentOdometer ? vehicle.currentOdometer.toLocaleString() + ' KM' : '-'}`,
      `🎯 Sasaran Servis Seterusnya: ${vehicle?.targetNextServiceKm ? vehicle.targetNextServiceKm.toLocaleString() + ' KM' : '-'}`,
      `---------------------------------`,
      `💰 *JUMLAH KOS SERVIS: RM ${totalServiceCost.toFixed(2)}*`,
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
        if (item.nextServiceKm) lines.push(`   ⚙️ Servis Seterusnya: ${item.nextServiceKm.toLocaleString()} KM`);
        if (item.notes) lines.push(`   📝 Nota: ${item.notes}`);
      });
    }

    lines.push(`---------------------------------`);
    lines.push(`_Dijana secara pantas melalui Aplikasi AutoKira_`);

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

    filtered.forEach(item => {
      totalKM += Number(item.km) || 0;
      totalClaim += Number(item.amount) || 0;
    });

    grandTotal = totalClaim;
    recentItems = filtered.slice(-4).reverse();

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
    lines.push(`_Dijana secara pantas melalui Aplikasi AutoKira_`);

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

  // Generate Image from the Infographic Card
  const handleDownloadInfographic = async () => {
    if (!infographicRef.current) return;
    try {
      setIsGeneratingImage(true);
      const dataUrl = await toPng(infographicRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
        backgroundColor: '#0f131a'
      });

      const link = document.createElement('a');
      link.download = `autokira-infografik-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setImageSuccessMsg('Imej Infografik Berjaya Dimuat Turun!');
      setTimeout(() => setImageSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Gagal menjana imej', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareInfographicImage = async () => {
    if (!infographicRef.current) return;
    try {
      setIsGeneratingImage(true);
      const dataUrl = await toPng(infographicRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
        backgroundColor: '#0f131a'
      });

      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `autokira-infografik-${type}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Laporan Infografik AutoKira - ${vehPlate}`,
          text: `Ringkasan perbelanjaan ${vehPlate} (${periodLabel}) melalui AutoKira App.`
        });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.download = `autokira-infografik-${type}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setImageSuccessMsg('Imej disimpan untuk dikongsi ke media sosial!');
        setTimeout(() => setImageSuccessMsg(null), 3500);
      }
    } catch (err) {
      console.error('Gagal kongsi imej', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#141822] border border-white/10 rounded-3xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-white/5 bg-[#141822]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{vehName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1e2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Tabs: [Format Teks] vs [Versi Infografik Media Sosial] */}
        <div className="px-4 sm:px-5 pt-3 bg-[#141822]">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1b202c] border border-white/5 rounded-2xl">
            <button
              type="button"
              onClick={() => setShareMode('text')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                shareMode === 'text'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Format Teks (WhatsApp)</span>
            </button>
            <button
              type="button"
              onClick={() => setShareMode('infographic')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                shareMode === 'infographic'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Versi Infografik (Sosial)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Notification toast if image saved */}
          {imageSuccessMsg && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{imageSuccessMsg}</span>
            </div>
          )}

          {/* Period Selector (Bulan Semasa vs Jumlah Keseluruhan) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              1. Tempoh Rekod
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#1b202c] border border-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPeriodOption('current_month')}
                className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  periodOption === 'current_month'
                    ? 'bg-[#283142] text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="truncate">Bulan {currentMonthName}</span>
              </button>
              <button
                type="button"
                onClick={() => setPeriodOption('all')}
                className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  periodOption === 'all'
                    ? 'bg-[#283142] text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Semua Rekod</span>
              </button>
            </div>
          </div>

          {/* If Expense: Category Checkboxes (Minyak, Tol, Parking) */}
          {type === 'expenses' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                2. Kategori Untuk Dimasukkan
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeMinyak(!includeMinyak)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeMinyak
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Fuel className="w-4 h-4" />
                  <span>Minyak</span>
                  <span className="text-[10px] font-semibold">{includeMinyak ? '✓ Aktif' : 'Tutup'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeTol(!includeTol)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeTol
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Tol</span>
                  <span className="text-[10px] font-semibold">{includeTol ? '✓ Aktif' : 'Tutup'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeParking(!includeParking)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    includeParking
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400 shadow-sm'
                      : 'bg-[#1b202c] border-white/5 text-slate-500'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Parking</span>
                  <span className="text-[10px] font-semibold">{includeParking ? '✓ Aktif' : 'Tutup'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================= MODE 1: TEXT FORMAT PREVIEW ======================= */}
          {shareMode === 'text' && (
            <div className="space-y-3">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {summaryCards.map((sc, i) => (
                  <div key={i} className="bg-[#1b202c] border border-white/5 rounded-2xl p-2.5">
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Pratonton Teks Ringkasan
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Disalin!' : 'Salin Teks'}</span>
                  </button>
                </div>
                <div className="bg-[#0e1118] border border-white/10 rounded-2xl p-3 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto select-all leading-relaxed shadow-inner">
                  {formattedText}
                </div>
              </div>
            </div>
          )}

          {/* ======================= MODE 2: INFOGRAPHIC SOCIAL CARD ======================= */}
          {shareMode === 'infographic' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span>Kad Infografik Media Sosial</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Sedia Untuk Disimpan (PNG)
                </span>
              </div>

              {/* THE INFOGRAPHIC VISUAL COMPONENT TO BE RENDERED AS AN IMAGE */}
              <div 
                ref={infographicRef}
                className="bg-gradient-to-b from-[#181d28] via-[#121620] to-[#0c0f15] border border-orange-500/30 rounded-3xl p-5 shadow-2xl text-white relative overflow-hidden"
              >
                {/* Background Glow Accents */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Branding Banner */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/30">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-white uppercase">AUTOKIRA</h4>
                      <p className="text-[9px] text-orange-400 font-bold tracking-wider uppercase">Laporan Prestasi Kenderaan</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-300 font-black text-[10px] px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                      {periodLabel}
                    </span>
                  </div>
                </div>

                {/* Vehicle Header Badge */}
                <div className="bg-[#1e2434] border border-white/5 rounded-2xl p-3 flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-white tracking-wide">{vehPlate}</h5>
                      <p className="text-[10px] text-slate-400">{vehModelName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
                    <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Rekod Aktif
                    </span>
                  </div>
                </div>

                {/* Hero Total Amount Display */}
                <div className="text-center py-2 mb-3 relative z-10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {type === 'expenses' ? 'Jumlah Kos Harian Terkumpul' : type === 'services' ? 'Jumlah Kos Servis & Baik Pulih' : 'Jumlah Tuntutan Mileage'}
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5 mt-1">
                    <span className="text-lg font-bold text-orange-400">RM</span>
                    <span className="text-3.5xl sm:text-4xl font-black text-white tracking-tight">
                      {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Breakdown Grid for Expenses */}
                {type === 'expenses' && (
                  <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
                    {includeMinyak && (
                      <div className="bg-[#151923] border border-emerald-500/20 rounded-2xl p-2.5 text-center">
                        <Fuel className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Minyak</span>
                        <span className="text-xs font-black text-emerald-400 block mt-0.5">RM {totalMinyak.toFixed(2)}</span>
                        <span className="text-[9px] text-slate-400 block">{totalLiters.toFixed(1)}L</span>
                      </div>
                    )}
                    {includeTol && (
                      <div className="bg-[#151923] border border-amber-500/20 rounded-2xl p-2.5 text-center">
                        <Car className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Tol</span>
                        <span className="text-xs font-black text-amber-400 block mt-0.5">RM {totalTol.toFixed(2)}</span>
                        <span className="text-[9px] text-slate-400 block">Kadar Lebuhraya</span>
                      </div>
                    )}
                    {includeParking && (
                      <div className="bg-[#151923] border border-indigo-500/20 rounded-2xl p-2.5 text-center">
                        <Navigation className="w-4 h-4 mx-auto text-indigo-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Parking</span>
                        <span className="text-xs font-black text-indigo-400 block mt-0.5">RM {totalParking.toFixed(2)}</span>
                        <span className="text-[9px] text-slate-400 block">Kupon & Bayaran</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Mileage Breakdown */}
                {type === 'mileage' && (
                  <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
                    <div className="bg-[#151923] border border-rose-500/20 rounded-2xl p-2.5 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Jarak Dilalui</span>
                      <span className="text-sm font-black text-rose-400 block mt-0.5">{totalKM.toLocaleString()} KM</span>
                    </div>
                    <div className="bg-[#151923] border border-white/10 rounded-2xl p-2.5 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Kadar Standard</span>
                      <span className="text-sm font-black text-white block mt-0.5">RM 0.70 / KM</span>
                    </div>
                  </div>
                )}

                {/* Service Breakdown */}
                {type === 'services' && (
                  <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
                    <div className="bg-[#151923] border border-indigo-500/20 rounded-2xl p-2.5 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Odometer Semasa</span>
                      <span className="text-xs font-black text-white block mt-0.5">{vehicle?.currentOdometer ? vehicle.currentOdometer.toLocaleString() + ' KM' : '-'}</span>
                    </div>
                    <div className="bg-[#151923] border border-orange-500/20 rounded-2xl p-2.5 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Sasaran Seterusnya</span>
                      <span className="text-xs font-black text-orange-400 block mt-0.5">{vehicle?.targetNextServiceKm ? vehicle.targetNextServiceKm.toLocaleString() + ' KM' : '-'}</span>
                    </div>
                  </div>
                )}

                {/* Footer Stamp */}
                <div className="border-t border-white/10 pt-2.5 mt-2 flex items-center justify-between text-[9px] text-slate-400 relative z-10">
                  <span className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-orange-400" />
                    AutoKira Smart Tracker
                  </span>
                  <span>Dijana {new Date().toLocaleDateString('ms-MY')}</span>
                </div>
              </div>

              {/* Infographic Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadInfographic}
                  disabled={isGeneratingImage}
                  className="py-3 px-3 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Muat Turun Imej (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareInfographicImage}
                  disabled={isGeneratingImage}
                  className="py-3 px-3 rounded-2xl bg-[#1e2432] hover:bg-[#283142] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4 text-orange-400" />
                  <span>Kongsi Imej Sosial</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Quick Actions */}
        <div className="p-4 border-t border-white/5 flex gap-2.5 bg-[#141822]">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          {'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex-1 py-3 px-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kongsi</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyText}
            className="py-3 px-3.5 rounded-2xl bg-[#1e2432] hover:bg-[#283142] text-slate-200 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Disalin' : 'Salin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
