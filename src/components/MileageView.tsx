import React, { useState } from 'react';
import { 
  Navigation, 
  Plus, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  Route, 
  Calculator,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { MileageRecord, Vehicle } from '../types';

interface MileageViewProps {
  mileage: MileageRecord[];
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onOpenAddModal: () => void;
  onSelectRecord: (id: string) => void;
}

export const MileageView: React.FC<MileageViewProps> = ({
  mileage,
  vehicles,
  activeVehicle,
  onOpenAddModal,
  onSelectRecord
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Extract unique months
  const monthsSet = new Set<string>();
  mileage.forEach((item) => {
    const d = new Date(item.date || item.timestamp);
    const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthsSet.add(yyyyMM);
  });
  const availableMonths = Array.from(monthsSet).sort().reverse();

  // Filtered
  const filteredMileage = mileage.filter((item) => {
    if (activeVehicle && item.vehicleId && item.vehicleId !== activeVehicle.id) {
      return false;
    }
    if (selectedMonth !== 'all') {
      const d = new Date(item.date || item.timestamp);
      const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (yyyyMM !== selectedMonth) return false;
    }
    return true;
  });

  let totalAmount = 0;
  let totalKM = 0;

  filteredMileage.forEach((item) => {
    totalAmount += Number(item.amount) || 0;
    totalKM += Number(item.km) || 0;
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Top filter bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-extrabold text-white">Tuntutan Mileage Bertugas</h2>
          <p className="text-[11px] text-slate-400">
            {activeVehicle ? `${activeVehicle.plateNumber} • RM 0.70 / KM` : 'Semua Kenderaan'}
          </p>
        </div>

        {/* Month Dropdown */}
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

      {/* Main Mileage Card */}
      <div className="bg-gradient-to-br from-[#12161f] via-[#1a1f2c] to-[#0f131a] border border-rose-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Tuntutan Terkumpul</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Navigation className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-xl font-bold text-rose-400">RM</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {totalAmount.toFixed(2)}
            </h1>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Jumlah Jarak:</span>
              <span className="text-xs font-extrabold text-white">{totalKM.toLocaleString()} KM</span>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
              {filteredMileage.length} Perjalanan
            </span>
          </div>
        </div>
      </div>

      {/* Rate calculation banner */}
      <div className="bg-[#181d26] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Kadar Pengiraan Automatik</p>
            <p className="text-[10px] text-slate-400">Kadar rasmi syarikat: RM 0.70 bagi setiap 1 KM</p>
          </div>
        </div>
        <span className="font-extrabold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
          RM 0.70 / KM
        </span>
      </div>

      {/* Trip Claim History */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sejarah Perjalanan Bertugas</h3>
          <span className="text-[10px] text-slate-500 font-medium">{filteredMileage.length} Rekod</span>
        </div>

        {filteredMileage.length === 0 ? (
          <div className="bg-[#181d26] border border-white/5 rounded-3xl p-8 text-center">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-rose-400">
              <Route className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Tiada Rekod Tuntutan Mileage</h4>
            <p className="text-xs text-slate-400 mt-1">Mula catat perjalanan bertugas dan jarak odometer anda.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Rekod Perjalanan Baru</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredMileage.map((item) => {
              const d = new Date(item.date || item.timestamp);
              const dateStr = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectRecord(item.id)}
                  className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-rose-500/30 rounded-2xl p-4 cursor-pointer transition-all active:scale-98 shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Route className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-rose-400 transition-colors">
                          {item.location || 'Perjalanan Bertugas'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{item.reason || 'Urusan Rasmi'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-rose-400 text-base">RM {Number(item.amount).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/5 text-xs">
                    <span className="bg-[#12161f] border border-white/5 text-slate-300 font-bold px-2.5 py-0.5 rounded-lg text-[10px]">
                      {Number(item.km).toLocaleString()} KM
                    </span>

                    {item.receiptImage ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <ImageIcon className="w-3 h-3" /> Resit/Odometer
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Tiada gambar</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Mileage Button */}
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-20">
        <button
          onClick={onOpenAddModal}
          className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(225,29,72,0.45)] hover:scale-105 active:scale-95 transition-all"
          title="Tambah Tuntutan Mileage"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
