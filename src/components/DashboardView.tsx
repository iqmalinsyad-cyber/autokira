import React from 'react';
import { 
  Car, 
  Bike,
  Fuel, 
  MapPin, 
  Battery, 
  RotateCw, 
  Plus, 
  TrendingUp, 
  Wrench, 
  Navigation, 
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Vehicle, ExpenseRecord, ServiceRecord, MileageRecord } from '../types';

interface DashboardViewProps {
  vehicle: Vehicle | null;
  expenses: ExpenseRecord[];
  services: ServiceRecord[];
  mileage: MileageRecord[];
  onOpenAddModal: (type: 'exp' | 'svc' | 'mlg') => void;
  onSelectRecord: (id: string, type: 'exp' | 'svc' | 'mlg') => void;
  onChangeTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vehicle,
  expenses,
  services,
  mileage,
  onOpenAddModal,
  onSelectRecord,
  onChangeTab
}) => {
  // Calculations
  const currentOdo = vehicle?.currentOdometer || 64520;
  const targetService = vehicle?.targetNextServiceKm || (currentOdo + 500);
  const kmToService = Math.max(0, targetService - currentOdo);

  // Current Month Tol calculation
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthExpenses = expenses.filter(item => {
    // If vehicle filter applies
    if (vehicle && item.vehicleId && item.vehicleId !== vehicle.id) {
      return false;
    }
    const d = new Date(item.timestamp);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const totalTolThisMonth = currentMonthExpenses
    .filter(x => x.category === 'Tol')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalExpensesThisMonth = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalServicesCost = services.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMileageAmount = mileage.reduce((acc, curr) => acc + curr.amount, 0);

  const fuelDisplay = vehicle?.telemetry?.fuelLevelLtrs ?? 31.45;
  const batteryDisplay = vehicle?.telemetry?.batteryVoltage ?? 12.0;
  const locationDisplay = vehicle?.telemetry?.locationName ?? "Lebuhraya PLUS / Bandar Baru Bangi";
  const lastUpdatedDisplay = vehicle?.telemetry?.lastUpdated ?? "12 jam lalu";

  return (
    <div className="space-y-4 sm:space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Zero State Alert for New Users without vehicle */}
      {!vehicle && (
        <div 
          onClick={() => onChangeTab('vehicles')}
          className="bg-gradient-to-r from-orange-600/20 via-orange-500/15 to-amber-500/10 border border-orange-500/40 rounded-3xl p-5 cursor-pointer shadow-lg hover:border-orange-400 transition-all group"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider bg-orange-500/20 px-2 py-0.5 rounded-full inline-block mb-1">
                Langkah Permulaan
              </span>
              <h4 className="text-sm font-extrabold text-white">Lengkapkan Profil Kenderaan Anda</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Semua data bermula dari 0. Klik di sini untuk menambah kenderaan pertama anda dan tetapkan odometer, tarikh roadtax & insurans.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Dikemaskini:</span>
          <span className="text-xs font-bold text-slate-200">{lastUpdatedDisplay}</span>
        </div>
        <button 
          onClick={() => {}}
          className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          title="Segarkan data"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Telemetry Grid Cards (Responsive 2x2 on mobile, 4-col on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Card 1: Penggunaan Tol Bulan Semasa (Vibrant Orange Card) */}
        <div 
          onClick={() => onChangeTab('expenses')}
          className="bg-gradient-to-br from-[#ff5e00] to-[#ff7700] rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-[0_12px_28px_rgba(255,94,0,0.3)] relative overflow-hidden flex flex-col justify-between min-h-[135px] sm:min-h-[150px] group transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              Bulan Ini
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-white/80">RM</span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {totalTolThisMonth.toFixed(2)}
              </span>
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Penggunaan Tol</p>
          </div>
        </div>

        {/* Card 2: Est. Fuel Usage */}
        <div 
          onClick={() => onChangeTab('expenses')}
          className="bg-[#181d26] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col justify-between min-h-[135px] sm:min-h-[150px] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#222834] flex items-center justify-center text-slate-300">
              <Fuel className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{fuelDisplay}</span>
              <span className="text-xs font-bold text-slate-400">Ltrs</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Est. Fuel Usage</p>
          </div>
        </div>

        {/* Card 3: Total Distance / Odometer */}
        <div 
          onClick={() => onChangeTab('services')}
          className="bg-[#181d26] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col justify-between min-h-[135px] sm:min-h-[150px] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#222834] flex items-center justify-center text-slate-300">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentOdo.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">km</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Distance</p>
          </div>
        </div>

        {/* Card 4: Battery Voltage */}
        <div className="bg-[#181d26] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col justify-between min-h-[135px] sm:min-h-[150px] transition-transform hover:scale-[1.02] active:scale-98">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#222834] flex items-center justify-center text-slate-300">
              <Battery className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{batteryDisplay.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-400">V</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Battery</p>
          </div>
        </div>
      </div>

      {/* Location Card with stylized radar/map background */}
      <div className="bg-[#181d26] border border-white/5 rounded-3xl p-4 relative overflow-hidden shadow-lg group">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Semasa</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate">{locationDisplay}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {vehicle ? `${vehicle.plateNumber} • ${vehicle.brand} ${vehicle.model}` : "Tiada sambungan GPS"}
            </p>
          </div>
        </div>
      </div>

      {/* Next Maintenance Countdown Banner */}
      <div 
        onClick={() => onChangeTab('services')}
        className="bg-gradient-to-r from-[#181d26] via-[#1e2430] to-[#181d26] border border-orange-500/30 rounded-3xl p-4 shadow-lg flex items-center justify-between cursor-pointer hover:border-orange-500/60 transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Jadual Penyelenggaraan</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full">Auto-Timer</span>
            </div>
            <p className="text-base font-extrabold text-white mt-0.5">
              {kmToService} km ke servis seterusnya
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Roadtax & Insurance Expiry Status Section */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Status Cukai Jalan & Insurans
          </h3>
          <button
            onClick={() => onChangeTab('vehicles')}
            className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Urus Profil</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(() => {
          const getExpiryInfo = (dateStr?: string) => {
            if (!dateStr) return null;
            const targetDate = new Date(dateStr);
            if (isNaN(targetDate.getTime())) return null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const formatted = targetDate.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
            return { diffDays, formatted };
          };

          const roadtaxInfo = getExpiryInfo(vehicle?.roadtaxExpiry || '2026-11-20');
          const insuranceInfo = getExpiryInfo(vehicle?.insuranceExpiry || '2026-11-20');

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Roadtax Card */}
              <div
                onClick={() => onChangeTab('vehicles')}
                className="bg-[#181d26] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white">Cukai Jalan (Roadtax)</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                      {roadtaxInfo ? roadtaxInfo.formatted : 'Belum Ditetapkan'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {vehicle ? vehicle.plateNumber : 'Semua Kenderaan'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {roadtaxInfo ? (
                    roadtaxInfo.diffDays < 0 ? (
                      <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Tamat Tempoh!
                      </span>
                    ) : roadtaxInfo.diffDays <= 30 ? (
                      <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Baki {roadtaxInfo.diffDays} Hari
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Baki {roadtaxInfo.diffDays} Hari
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-bold bg-white/5 text-slate-400 px-2 py-1 rounded-full">
                      + Tetapkan
                    </span>
                  )}
                </div>
              </div>

              {/* Insurance Card */}
              <div
                onClick={() => onChangeTab('vehicles')}
                className="bg-[#181d26] border border-white/5 hover:border-orange-500/30 rounded-2xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white">Polisi Insurans</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                      {insuranceInfo ? insuranceInfo.formatted : 'Belum Ditetapkan'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {vehicle?.insuranceCompany || 'Etiqa Takaful'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {insuranceInfo ? (
                    insuranceInfo.diffDays < 0 ? (
                      <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Tamat Tempoh!
                      </span>
                    ) : insuranceInfo.diffDays <= 30 ? (
                      <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Baki {insuranceInfo.diffDays} Hari
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Baki {insuranceInfo.diffDays} Hari
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-bold bg-white/5 text-slate-400 px-2 py-1 rounded-full">
                      + Tetapkan
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Tindakan Pantas
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={() => onOpenAddModal('exp')}
            className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-orange-500/30 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Fuel className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">Kos Harian</span>
          </button>

          <button
            onClick={() => onOpenAddModal('svc')}
            className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-orange-500/30 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">Rekod Servis</span>
          </button>

          <button
            onClick={() => onOpenAddModal('mlg')}
            className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-orange-500/30 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <Navigation className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">Tuntutan KM</span>
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="bg-[#181d26] border border-white/5 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white">Ringkasan Kewangan Kereta</h3>
            <p className="text-[11px] text-slate-400">Terkumpul untuk {vehicle?.plateNumber || 'Semua Kereta'}</p>
          </div>
          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
            RM {(totalExpensesThisMonth + totalServicesCost + totalMileageAmount).toFixed(2)}
          </span>
        </div>

        <div className="space-y-3">
          <div 
            onClick={() => onChangeTab('expenses')} 
            className="flex items-center justify-between p-3 rounded-2xl bg-[#12161f] border border-white/5 hover:border-emerald-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Perbelanjaan Harian</p>
                <p className="text-[10px] text-slate-400">{expenses.length} Transaksi (Minyak, Tol, Parking)</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-white">RM {totalExpensesThisMonth.toFixed(2)}</span>
          </div>

          <div 
            onClick={() => onChangeTab('services')} 
            className="flex items-center justify-between p-3 rounded-2xl bg-[#12161f] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Kos Penyelenggaraan</p>
                <p className="text-[10px] text-slate-400">{services.length} Rekod Servis</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-white">RM {totalServicesCost.toFixed(2)}</span>
          </div>

          <div 
            onClick={() => onChangeTab('mileage')} 
            className="flex items-center justify-between p-3 rounded-2xl bg-[#12161f] border border-white/5 hover:border-rose-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Tuntutan Mileage</p>
                <p className="text-[10px] text-slate-400">{mileage.length} Perjalanan (RM 0.70 / KM)</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-white">RM {totalMileageAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
