import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Edit3, 
  Fuel, 
  Car, 
  MapPin, 
  Wrench, 
  Navigation, 
  Calendar, 
  Clock, 
  Image as ImageIcon,
  Maximize2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ExpenseRecord, ServiceRecord, MileageRecord, Vehicle } from '../types';
import { PetrolBrandLogo } from './PetrolBrandLogo';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | null;
  type: 'exp' | 'svc' | 'mlg' | null;
  expenses: ExpenseRecord[];
  services: ServiceRecord[];
  mileage: MileageRecord[];
  vehicles: Vehicle[];
  onOpenEdit: () => void;
  onDelete?: () => void;
  onConfirmDelete?: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  recordId,
  type,
  expenses,
  services,
  mileage,
  vehicles,
  onOpenEdit,
  onDelete,
  onConfirmDelete
}) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else if (onConfirmDelete) {
      onConfirmDelete();
    }
  };

  if (!isOpen || !recordId || !type) return null;

  let title = 'Butiran Rekod';
  let subtitle = '';
  let amount = 0;
  let dateStr = '';
  let receiptImg: string | null = null;
  let details: { label: string; value: string; icon?: any }[] = [];
  let iconComp = Fuel;
  let iconBg = 'bg-emerald-500/10 text-emerald-400';
  let fuelBrandName: string | null = null;

  if (type === 'exp') {
    const item = expenses.find(x => x.id === recordId);
    if (!item) return null;
    title = `Kos Harian - ${item.category}`;
    subtitle = item.tripType;
    amount = item.amount;
    receiptImg = item.receiptImage || null;
    if (item.category === 'Minyak' && item.fuelBrand) {
      fuelBrandName = item.fuelBrand;
    }

    const d = new Date(item.timestamp);
    dateStr = `${d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })} • ${d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const targetVeh = vehicles.find(v => v.id === item.vehicleId);

    if (item.category === 'Minyak') {
      iconComp = Fuel;
      iconBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    } else if (item.category === 'Tol') {
      iconComp = Car;
      iconBg = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    } else {
      iconComp = MapPin;
      iconBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }

    details = [
      { label: 'Kategori', value: item.category },
      ...(item.category === 'Minyak' && item.fuelBrand ? [{ label: 'Jenama Petrol', value: item.fuelBrand }] : []),
      ...(item.category === 'Minyak' && item.liters && item.liters > 0 ? [{ label: 'Jumlah Liter', value: `${item.liters} Liter` }] : []),
      ...(item.category === 'Minyak' && item.liters && item.amount ? [{ label: 'Kadar Seliter (Est.)', value: `RM ${(item.amount / item.liters).toFixed(2)} / L` }] : []),
      { label: 'Tujuan Perjalanan', value: item.tripType },
      ...(item.notes ? [{ label: 'Catatan', value: item.notes }] : []),
      { label: 'Kenderaan', value: targetVeh ? `${targetVeh.plateNumber} (${targetVeh.nickName})` : 'Kenderaan Utama' },
      { label: 'Tarikh & Waktu', value: dateStr }
    ];
  } else if (type === 'svc') {
    const item = services.find(x => x.id === recordId);
    if (!item) return null;
    title = 'Rekod Penyelenggaraan';
    subtitle = item.location || 'Pusat Servis';
    amount = item.amount;
    receiptImg = item.receiptImage || null;

    const d = new Date(item.serviceDate || item.timestamp);
    dateStr = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });

    iconComp = Wrench;
    iconBg = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';

    const targetVeh = vehicles.find(v => v.id === item.vehicleId);

    details = [
      { label: 'Tarikh Servis', value: dateStr },
      { label: 'Kenderaan', value: item.vehicle || (targetVeh ? `${targetVeh.plateNumber}` : '-') },
      { label: 'Pusat Servis / Bengkel', value: item.location || '-' },
      { label: 'Odometer Servis', value: item.mileage ? `${item.mileage.toLocaleString()} KM` : '-' },
      ...(item.nextServiceKm ? [{ label: 'Sasaran Odometer Seterusnya', value: `${item.nextServiceKm.toLocaleString()} KM` }] : []),
      ...(item.nextServiceDate ? [{ label: 'Tarikh Servis Seterusnya', value: new Date(item.nextServiceDate).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) }] : []),
      { label: 'Catatan / Servis', value: item.notes || 'Penyelenggaraan berkala' }
    ];
  } else if (type === 'mlg') {
    const item = mileage.find(x => x.id === recordId);
    if (!item) return null;
    title = 'Tuntutan Mileage';
    subtitle = item.location || 'Perjalanan Bertugas';
    amount = item.amount;
    receiptImg = item.receiptImage || null;

    const d = new Date(item.date || item.timestamp);
    dateStr = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });

    iconComp = Navigation;
    iconBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';

    const targetVeh = vehicles.find(v => v.id === item.vehicleId);

    details = [
      { label: 'Tarikh Perjalanan', value: dateStr },
      { label: 'Laluan (Dari - Ke)', value: item.location || '-' },
      { label: 'Tujuan Tuntutan', value: item.reason || '-' },
      { label: 'Jarak Dilalui', value: `${item.km} KM` },
      { label: 'Kadar Tuntutan', value: 'RM 0.70 / 1 KM' },
      { label: 'Kenderaan Digunakan', value: targetVeh ? `${targetVeh.plateNumber} (${targetVeh.nickName})` : 'Kereta Sendiri' }
    ];
  }

  const Icon = iconComp;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="w-full max-w-lg bg-[#141822] border border-white/10 rounded-t-[2.5rem] sm:rounded-3xl max-h-[90dvh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Pull Bar */}
          <div className="sm:hidden pt-3 flex justify-center bg-[#181d28]">
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="relative pt-4 sm:pt-6 pb-5 px-6 text-center border-b border-white/5 bg-[#181d28]">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`w-16 h-16 rounded-3xl mx-auto mb-3 flex items-center justify-center text-2xl shadow-lg ${
              fuelBrandName ? 'bg-white p-2.5 border border-white/20' : iconBg
            }`}>
              {fuelBrandName ? (
                <PetrolBrandLogo brand={fuelBrandName} className="w-full h-full object-contain" />
              ) : (
                <Icon className="w-8 h-8" />
              )}
            </div>

            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">{subtitle}</p>
            <h2 className="text-sm font-extrabold text-white mt-0.5">{title}</h2>

            <div className="flex justify-center items-baseline gap-1 mt-2">
              <span className="text-xl font-bold text-orange-400">RM</span>
              <h1 className="text-4xl font-black text-white tracking-tight">{amount.toFixed(2)}</h1>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Key-Value Details */}
            <div className="bg-[#181d26] border border-white/5 rounded-2xl p-4 space-y-2.5">
              {details.map((row, idx) => (
                <div key={idx} className={`flex justify-between items-center py-1 text-xs ${idx > 0 ? 'border-t border-white/5' : ''}`}>
                  <span className="text-slate-400 font-medium">{row.label}</span>
                  <span className="font-extrabold text-white text-right max-w-[200px] truncate">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Receipt Image Section */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Bukti Lampiran / Resit
              </span>

              {receiptImg ? (
                <div 
                  onClick={() => setFullscreenImage(receiptImg)}
                  className="relative rounded-2xl overflow-hidden border border-white/10 h-44 bg-black/40 cursor-pointer group shadow-inner"
                >
                  <img src={receiptImg} alt="Bukti Resit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                    <Maximize2 className="w-4 h-4" />
                    <span>Papar Skrin Penuh</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#181d26] border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-500 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                  <p>Tiada gambar resit atau invois dilampirkan.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="p-4 bg-[#181d28] border-t border-white/5 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="w-14 h-12 rounded-2xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Padam Rekod Ini Secara Kekal"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenEdit}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-xs shadow-[0_4px_15px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Edit3 className="w-4 h-4" />
              <span>KEMASKINI REKOD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Resit Skrin Penuh" 
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
