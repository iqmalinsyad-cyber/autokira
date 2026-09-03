import React, { useState } from 'react';
import { 
  Fuel, 
  Car, 
  MapPin, 
  Receipt, 
  Plus, 
  ChevronDown, 
  Calendar, 
  Image as ImageIcon,
  ArrowUpDown,
  CircleDollarSign
} from 'lucide-react';
import { ExpenseRecord, Vehicle } from '../types';

interface ExpensesViewProps {
  expenses: ExpenseRecord[];
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onOpenAddModal: () => void;
  onSelectRecord: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  vehicles,
  activeVehicle,
  onOpenAddModal,
  onSelectRecord
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique months
  const monthsSet = new Set<string>();
  expenses.forEach((item) => {
    const d = new Date(item.timestamp);
    const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthsSet.add(yyyyMM);
  });
  const availableMonths = Array.from(monthsSet).sort().reverse();

  // Filtered list
  const filteredExpenses = expenses.filter((item) => {
    // Filter by active vehicle if present
    if (activeVehicle && item.vehicleId && item.vehicleId !== activeVehicle.id) {
      return false;
    }
    // Filter by month
    if (selectedMonth !== 'all') {
      const d = new Date(item.timestamp);
      const yyyyMM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (yyyyMM !== selectedMonth) return false;
    }
    // Filter by category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  // Calculate totals
  let total = 0;
  let totalMinyak = 0;
  let totalTol = 0;
  let totalParking = 0;

  filteredExpenses.forEach((item) => {
    const amount = Number(item.amount) || 0;
    total += amount;
    if (item.category === 'Minyak') totalMinyak += amount;
    if (item.category === 'Tol') totalTol += amount;
    if (item.category === 'Parking') totalParking += amount;
  });

  const pctMinyak = total > 0 ? Math.round((totalMinyak / total) * 100) : 0;
  const pctTol = total > 0 ? Math.round((totalTol / total) * 100) : 0;
  const pctParking = total > 0 ? Math.round((totalParking / total) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Top filter bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-extrabold text-white">Ringkasan Kos Harian</h2>
          <p className="text-[11px] text-slate-400">
            {activeVehicle ? `${activeVehicle.plateNumber} (${activeVehicle.nickName})` : 'Semua Kenderaan'}
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

      {/* Main Expense Card */}
      <div className="bg-gradient-to-br from-[#12161f] via-[#1a1f2c] to-[#0f131a] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jumlah Perbelanjaan</span>
            <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300">
              <CircleDollarSign className="w-5 h-5 text-orange-400" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-xl font-bold text-orange-400">RM</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {total.toFixed(2)}
            </h1>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Rekod Terkumpul</span>
            <span className="text-xs font-bold text-slate-200 bg-white/5 px-2.5 py-1 rounded-full">
              {filteredExpenses.length} Transaksi
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Breakdown Cards */}
      <div className="space-y-3">
        {/* Minyak Card */}
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'Minyak' ? 'all' : 'Minyak')}
          className={`bg-[#181d26] border rounded-2xl p-4 transition-all cursor-pointer ${
            categoryFilter === 'Minyak' ? 'border-emerald-500/50 bg-[#1c242e]' : 'border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Fuel className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-200">Minyak</span>
            </div>
            <span className="font-extrabold text-white text-base">RM {totalMinyak.toFixed(2)}</span>
          </div>
          <div className="w-full bg-[#12161f] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${pctMinyak}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
            <span>{pctMinyak}% dari jumlah keseluruhan</span>
            <span>{filteredExpenses.filter(x => x.category === 'Minyak').length} rekod</span>
          </div>
        </div>

        {/* Tol & Parking Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tol */}
          <div 
            onClick={() => setCategoryFilter(categoryFilter === 'Tol' ? 'all' : 'Tol')}
            className={`bg-[#181d26] border rounded-2xl p-4 transition-all cursor-pointer ${
              categoryFilter === 'Tol' ? 'border-blue-500/50 bg-[#1a2230]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {pctTol}%
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Tol</p>
            <p className="text-base font-extrabold text-white mt-0.5">RM {totalTol.toFixed(2)}</p>
            <div className="w-full bg-[#12161f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${pctTol}%` }}
              />
            </div>
          </div>

          {/* Parking */}
          <div 
            onClick={() => setCategoryFilter(categoryFilter === 'Parking' ? 'all' : 'Parking')}
            className={`bg-[#181d26] border rounded-2xl p-4 transition-all cursor-pointer ${
              categoryFilter === 'Parking' ? 'border-amber-500/50 bg-[#252019]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {pctParking}%
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Parking</p>
            <p className="text-base font-extrabold text-white mt-0.5">RM {totalParking.toFixed(2)}</p>
            <div className="w-full bg-[#12161f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${pctParking}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sejarah Transaksi Harian</h3>
          {categoryFilter !== 'all' && (
            <button 
              onClick={() => setCategoryFilter('all')}
              className="text-[10px] text-orange-400 hover:underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="bg-[#181d26] border border-white/5 rounded-3xl p-8 text-center">
            <div className="w-14 h-14 bg-[#222834] rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Receipt className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-300">Tiada Rekod Dijumpai</h4>
            <p className="text-xs text-slate-500 mt-1">Tekan butang tambah untuk merekod kos minyak, tol atau parking.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekod</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredExpenses.map((item) => {
              const d = new Date(item.timestamp);
              const dateStr = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short' });
              const timeStr = d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: true });

              let icon = Fuel;
              let iconBg = 'bg-emerald-500/10 text-emerald-400';
              if (item.category === 'Tol') {
                icon = Car;
                iconBg = 'bg-blue-500/10 text-blue-400';
              } else if (item.category === 'Parking') {
                icon = MapPin;
                iconBg = 'bg-amber-500/10 text-amber-400';
              }
              const IconComp = icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectRecord(item.id)}
                  className="bg-[#181d26] hover:bg-[#202633] border border-white/5 hover:border-orange-500/30 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-98 shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-100">{item.category}</h4>
                        <span className="text-[10px] bg-white/5 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                          {item.tripType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {dateStr}, {timeStr}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2.5">
                    <div>
                      <p className="font-extrabold text-white text-base">RM {Number(item.amount).toFixed(2)}</p>
                    </div>
                    {item.receiptImage && (
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-orange-400 transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Expense Button */}
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-20">
        <button
          onClick={onOpenAddModal}
          className="w-14 h-14 bg-gradient-to-tr from-orange-600 to-orange-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95 transition-all"
          title="Tambah Kos Harian"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
