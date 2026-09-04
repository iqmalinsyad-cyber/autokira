import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  Receipt, 
  Zap, 
  Gauge, 
  Building2, 
  CheckCircle2,
  Image as ImageIcon,
  Share2
} from 'lucide-react';
import { ServiceRecord, Vehicle } from '../types';
import { ShareModal } from './ShareModal';

interface ServicesViewProps {
  services: ServiceRecord[];
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onOpenAddModal: () => void;
  onSelectRecord: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  vehicles,
  activeVehicle,
  onOpenAddModal,
  onSelectRecord
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Extract unique months
  const monthsSet = new Set<string>();
  services.forEach((item) => {
    const d = new Date(item.serviceDate || item.timestamp);
    const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthsSet.add(yyyyMM);
  });
  const availableMonths = Array.from(monthsSet).sort().reverse();

  // Filtered services
  const filteredServices = services.filter((item) => {
    if (activeVehicle && item.vehicleId && item.vehicleId !== activeVehicle.id) {
      return false;
    }
    if (selectedMonth !== 'all') {
      const d = new Date(item.serviceDate || item.timestamp);
      const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (yyyyMM !== selectedMonth) return false;
    }
    return true;
  });

  const totalCost = filteredServices.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Maintenance Due Calculation
  const currentOdometer = activeVehicle?.currentOdometer || 64520;
  const targetService = activeVehicle?.targetNextServiceKm || (currentOdometer + 500);
  const kmRemaining = Math.max(0, targetService - currentOdometer);

  // SVG Arch Calculation for semicircle gauge
  // Circumference of semicircle (r=90): pi * 90 ≈ 282.74
  const radius = 90;
  const circumference = Math.PI * radius;
  // Calculate percent complete between last 10,000km interval
  const percentComplete = Math.min(100, Math.max(10, 100 - (kmRemaining / 5000) * 100));
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  return (
    <div className="space-y-4 sm:space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-extrabold text-white">Penyelenggaraan (Maintenance)</h2>
          <p className="text-[11px] text-slate-400">
            {activeVehicle ? `${activeVehicle.plateNumber} • ${activeVehicle.brand} ${activeVehicle.model}` : 'Semua Kenderaan'}
          </p>
        </div>

        {/* Action Controls: Share & Month Dropdown */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#181d26] hover:bg-[#222836] border border-white/10 text-orange-400 hover:text-orange-300 text-xs font-bold py-2 px-3 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Kongsi Rekod Servis"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Kongsi</span>
          </button>

          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#181d26] border border-white/10 text-slate-200 text-xs font-bold py-2 pl-3 pr-8 rounded-full focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="all">Semua Masa</option>
              {availableMonths.map((m) => {
                const [y, mStr] = m.split('-');
                const dateObj = new Date(parseInt(y), parseInt(mStr) - 1, 1);
                const label = dateObj.toLocaleDateString('ms-MY', { month: 'short', year: 'numeric' });
                return (
                  <option key={m} value={m}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Semicircular Maintenance Gauge Card (Exact match to reference screenshots 1 & 2!) */}
      <div className="bg-[#181d26] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Semicircle Gauge SVG */}
          <div className="relative w-64 h-36 flex items-center justify-center overflow-hidden">
            <svg className="w-64 h-64 -rotate-180 absolute top-0" viewBox="0 0 220 220">
              {/* Background Track Arch */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#222938"
                strokeWidth="10"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Vibrant Orange Progress Arch */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#ff6600"
                strokeWidth="10"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Orange Circular Button */}
            <div className="absolute top-10 w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-orange-500 shadow-[0_4px_20px_rgba(255,102,0,0.5)] flex items-center justify-center text-white z-10 animate-bounce-subtle">
              <Zap className="w-7 h-7 fill-white text-white" />
            </div>
          </div>

          {/* Countdown details */}
          <div className="mt-1">
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {kmRemaining} km to maintenance
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
              Auto-Timer ditetapkan dari rekod penyelenggaraan terakhir bagi kenderaan ini.
            </p>
          </div>

          {/* Quick stats bottom row in gauge */}
          <div className="w-full mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-left">
            <div className="bg-[#12161f] p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Odometer Semasa</span>
              <p className="text-sm font-bold text-white mt-0.5">{currentOdometer.toLocaleString()} KM</p>
            </div>
            <div className="bg-[#12161f] p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sasaran Servis</span>
              <p className="text-sm font-bold text-orange-400 mt-0.5">{targetService.toLocaleString()} KM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bengkel & Servis (Workshop)</span>
          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
            RM {totalCost.toFixed(2)}
          </span>
        </div>

        {/* Big Orange "Add Workshop" Button (Exact match from screenshot 1 & 2!) */}
        <button
          onClick={onOpenAddModal}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2.5 transition-all active:scale-98"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Workshop / Rekod Servis</span>
        </button>

        {/* Service Record Items */}
        {filteredServices.length === 0 ? (
          <div className="bg-[#181d26] border border-white/5 rounded-3xl p-8 text-center mt-2">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Tiada Rekod Penyelenggaraan</h4>
            <p className="text-xs text-slate-400 mt-1">Simpan rekod servis minyak hitam, tayar, brek, dan bateri anda.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {filteredServices.map((item) => {
              const d = new Date(item.serviceDate || item.timestamp);
              const dateStr = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectRecord(item.id)}
                  className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-orange-500/30 rounded-2xl p-4 cursor-pointer transition-all active:scale-98 shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#222834] text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors">
                          {item.location || 'Total Lube Service - Designated Centre'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{item.vehicle || activeVehicle?.plateNumber || 'Kenderaan'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-orange-400 text-base">RM {Number(item.amount).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      {item.mileage && (
                        <span className="bg-[#12161f] border border-white/5 text-slate-300 font-bold px-2.5 py-0.5 rounded-lg text-[10px]">
                          {Number(item.mileage).toLocaleString()} KM
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {item.notes || 'Penyelenggaraan berkala'}
                      </span>
                    </div>

                    {item.receiptImage ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <ImageIcon className="w-3 h-3" /> Resit
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Tiada resit</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Service Button */}
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-20">
        <button
          onClick={onOpenAddModal}
          className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Tambah Rekod Servis"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        type="services"
        vehicle={activeVehicle}
        services={services}
        currentSelectedMonth={selectedMonth}
      />
    </div>
  );
};
