import React, { useState, useEffect } from 'react';
import { 
  X, 
  Fuel, 
  Car, 
  Bike,
  MapPin, 
  Wrench, 
  Navigation, 
  Camera, 
  Trash2, 
  Check, 
  Calendar,
  DollarSign,
  Zap,
  Route,
  Calculator
} from 'lucide-react';
import { ExpenseRecord, ServiceRecord, MileageRecord, Vehicle, PetrolBrand } from '../types';
import { PetrolBrandLogo, PETROL_BRANDS_LIST } from './PetrolBrandLogo';

interface RecordModalProps {
  isOpen: boolean;
  type: 'exp' | 'svc' | 'mlg';
  onClose: () => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSaveExpense: (data: Partial<ExpenseRecord>, id?: string) => void;
  onSaveService: (data: Partial<ServiceRecord>, id?: string) => void;
  onSaveMileage: (data: Partial<MileageRecord>, id?: string) => void;
  editingItem?: ExpenseRecord | ServiceRecord | MileageRecord | null;
  editingRecord?: ExpenseRecord | ServiceRecord | MileageRecord | null;
  onDelete?: (id: string, type: 'exp' | 'svc' | 'mlg') => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  type,
  onClose,
  vehicles,
  activeVehicle,
  onSaveExpense,
  onSaveService,
  onSaveMileage,
  editingItem,
  editingRecord,
  onDelete
}) => {
  const currentEditingItem = editingItem || editingRecord || null;
  // Common states
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState<string>('');

  // Expense states
  const [expCategory, setExpCategory] = useState<'Minyak' | 'Tol' | 'Parking'>('Minyak');
  const [expTripType, setExpTripType] = useState<string>('Pergi Kerja');
  const [fuelBrand, setFuelBrand] = useState<PetrolBrand>('Petronas');
  const [fuelLiters, setFuelLiters] = useState<string>('');

  // Service states
  const [svcLocation, setSvcLocation] = useState<string>('');
  const [svcMileage, setSvcMileage] = useState<string>('');
  const [svcNotes, setSvcNotes] = useState<string>('');

  // Mileage states
  const [mlgLocation, setMlgLocation] = useState<string>('');
  const [mlgReason, setMlgReason] = useState<string>('');
  const [mlgKm, setMlgKm] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const todayStr = new Date().toISOString().split('T')[0];

    if (currentEditingItem) {
      if (type === 'exp') {
        const item = currentEditingItem as ExpenseRecord;
        setExpCategory(item.category || 'Minyak');
        setExpTripType(item.tripType || 'Pergi Kerja');
        setAmount(String(item.amount || ''));
        setReceiptImage(item.receiptImage || null);
        setSelectedVehicleId(item.vehicleId || activeVehicle?.id || '');
        setFuelBrand(item.fuelBrand || 'Petronas');
        setFuelLiters(item.liters !== undefined && item.liters !== null ? String(item.liters) : '');
      } else if (type === 'svc') {
        const item = currentEditingItem as ServiceRecord;
        setAmount(String(item.amount || ''));
        setSvcLocation(item.location || '');
        setSvcMileage(item.mileage ? String(item.mileage) : '');
        setSvcNotes(item.notes || '');
        setReceiptImage(item.receiptImage || null);
        setSelectedVehicleId(item.vehicleId || activeVehicle?.id || '');
        if (item.serviceDate) {
          const d = new Date(item.serviceDate);
          setDateStr(d.toISOString().split('T')[0]);
        }
      } else if (type === 'mlg') {
        const item = currentEditingItem as MileageRecord;
        setMlgLocation(item.location || '');
        setMlgReason(item.reason || '');
        setMlgKm(String(item.km || ''));
        setAmount(String(item.amount || ''));
        setReceiptImage(item.receiptImage || null);
        setSelectedVehicleId(item.vehicleId || activeVehicle?.id || '');
        if (item.date) {
          const d = new Date(item.date);
          setDateStr(d.toISOString().split('T')[0]);
        }
      }
    } else {
      // New record reset
      setSelectedVehicleId(activeVehicle?.id || (vehicles[0]?.id ?? ''));
      setAmount('');
      setReceiptImage(null);
      setDateStr(todayStr);

      setExpCategory('Minyak');
      setExpTripType('Pergi Kerja');
      setFuelBrand('Petronas');
      setFuelLiters('');

      setSvcLocation('');
      setSvcMileage(activeVehicle?.currentOdometer ? String(activeVehicle.currentOdometer) : '');
      setSvcNotes('');

      setMlgLocation('');
      setMlgReason('Urusan Rasmi / Lawatan Tapak');
      setMlgKm('');
    }
  }, [isOpen, type, editingItem, activeVehicle, vehicles]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setReceiptImage(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleKmChange = (val: string) => {
    setMlgKm(val);
    const parsedKm = parseFloat(val);
    if (!isNaN(parsedKm) && parsedKm > 0) {
      setAmount((parsedKm * 0.70).toFixed(2));
    } else {
      setAmount('0.00');
    }
  };

  // Quick helper to calculate liters based on RM & standard prices
  const handleAutoCalcLiters = (pricePerLiter: number) => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const calculated = (numAmount / pricePerLiter).toFixed(2);
      setFuelLiters(calculated);
    }
  };

  // When liters changed, can calculate amount if empty
  const handleLitersChange = (val: string) => {
    setFuelLiters(val);
    const parsedLiters = parseFloat(val);
    if (!isNaN(parsedLiters) && parsedLiters > 0 && (!amount || amount === '0' || amount === '0.00')) {
      setAmount((parsedLiters * 2.05).toFixed(2)); // Default RON95 benchmark
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVeh = vehicles.find(v => v.id === selectedVehicleId) || activeVehicle;
    const vehName = selectedVeh ? `${selectedVeh.brand} ${selectedVeh.model} (${selectedVeh.plateNumber})` : 'Kenderaan';

    if (type === 'exp') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) return;

      const numLiters = fuelLiters ? parseFloat(fuelLiters) : undefined;

      onSaveExpense({
        vehicleId: selectedVehicleId,
        category: expCategory,
        tripType: expTripType,
        amount: numAmount,
        liters: expCategory === 'Minyak' && !isNaN(Number(numLiters)) ? numLiters : undefined,
        fuelBrand: expCategory === 'Minyak' ? fuelBrand : undefined,
        receiptImage: receiptImage,
        timestamp: currentEditingItem ? (currentEditingItem as ExpenseRecord).timestamp : Date.now(),
      }, currentEditingItem?.id);
    } else if (type === 'svc') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) return;

      const dateTs = dateStr ? new Date(dateStr).getTime() : Date.now();
      const numMileage = svcMileage ? parseInt(svcMileage) : null;

      onSaveService({
        vehicleId: selectedVehicleId,
        vehicle: vehName,
        serviceDate: dateTs,
        location: svcLocation || 'Pusat Servis Rasmi',
        mileage: numMileage,
        amount: numAmount,
        notes: svcNotes,
        receiptImage: receiptImage,
        timestamp: currentEditingItem ? (currentEditingItem as ServiceRecord).timestamp : Date.now(),
      }, currentEditingItem?.id);
    } else if (type === 'mlg') {
      const numKm = parseFloat(mlgKm);
      if (isNaN(numKm) || numKm <= 0) return;
      const numAmount = parseFloat(amount) || (numKm * 0.70);

      const dateTs = dateStr ? new Date(dateStr).getTime() : Date.now();

      onSaveMileage({
        vehicleId: selectedVehicleId,
        date: dateTs,
        location: mlgLocation || 'Pejabat - Tapak Projek',
        reason: mlgReason || 'Perjalanan Rasmi',
        km: numKm,
        amount: numAmount,
        receiptImage: receiptImage,
        timestamp: currentEditingItem ? (currentEditingItem as MileageRecord).timestamp : Date.now(),
      }, currentEditingItem?.id);
    }

    onClose();
  };

  let title = 'Kos Harian Baru';

  if (type === 'svc') {
    title = 'Rekod Servis Kenderaan';
  } else if (type === 'mlg') {
    title = 'Tuntutan Mileage (RM0.70/KM)';
  }

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
          <div>
            <h3 className="text-base font-extrabold text-white">
              {editingItem ? `Kemaskini Rekod` : title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {type === 'exp' && 'Simpan resit petrol, tol atau tiket parking'}
              {type === 'svc' && 'Simpan invois servis dan odometer kereta'}
              {type === 'mlg' && 'Kiraan automatik mengikut jarak KM perjalanan'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1e2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Target Vehicle Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Kenderaan Terlibat
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {vehicles.map((veh) => (
                <option key={veh.id} value={veh.id}>
                  {veh.plateNumber} • {veh.brand} {veh.model} ({veh.nickName})
                </option>
              ))}
            </select>
          </div>

          {/* ===================== EXPENSES SPECIFIC ===================== */}
          {type === 'exp' && (
            <>
              {/* Category Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Kategori Perbelanjaan
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExpCategory('Minyak')}
                    className={`py-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      expCategory === 'Minyak'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                        : 'bg-[#1b202c] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Fuel className="w-5 h-5" />
                    <span>Minyak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpCategory('Tol')}
                    className={`py-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      expCategory === 'Tol'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-sm'
                        : 'bg-[#1b202c] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                    <span>Tol</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpCategory('Parking')}
                    className={`py-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      expCategory === 'Parking'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm'
                        : 'bg-[#1b202c] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Parking</span>
                  </button>
                </div>
              </div>

              {/* PETROL BRAND & LITERS (SHOWN ONLY IF CATEGORY IS MINYAK) */}
              {expCategory === 'Minyak' && (
                <div className="p-3.5 rounded-2xl bg-[#181d28] border border-emerald-500/25 space-y-3 animate-in fade-in duration-200">
                  {/* Brand selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5" />
                        <span>Jenama Petrol</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Pilih Stesen Minyak</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PETROL_BRANDS_LIST.map((b) => {
                        const isSelected = fuelBrand === b.name || fuelBrand === b.id || fuelBrand === b.shortName;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setFuelBrand(b.name)}
                            className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                              isSelected
                                ? `${b.badgeBg} border-emerald-400 shadow-md ring-2 ring-emerald-400/50`
                                : 'bg-[#141822] border-white/5 hover:border-white/20 text-slate-400 hover:text-white'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
                              <PetrolBrandLogo brand={b.name} size="sm" />
                            </div>
                            <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {b.shortName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Liter Input & Auto-Calculator */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Jumlah Liter (L)
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAutoCalcLiters(2.05)}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold transition-colors cursor-pointer"
                          title="Kira liter mengikut kadar RON95 RM2.05/L"
                        >
                          Auto RON95 (RM2.05)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAutoCalcLiters(2.95)}
                          className="px-2 py-0.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                          title="Kira liter mengikut kadar Diesel RM2.95/L"
                        >
                          Diesel
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#141822] border border-white/10 focus-within:border-emerald-500 rounded-xl p-2.5 px-3.5 flex items-center justify-between gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Contoh: 24.39"
                        value={fuelLiters}
                        onChange={(e) => handleLitersChange(e.target.value)}
                        className="w-full bg-transparent text-lg font-extrabold text-emerald-400 focus:outline-none placeholder-slate-600"
                      />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        Liter (L)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tujuan Perjalanan
                </label>
                <div className="bg-[#1b202c] p-1 rounded-2xl flex gap-1 border border-white/5">
                  {['Pergi Kerja', 'Balik Kerja', 'Urusan Luar'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setExpTripType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        expTripType === t
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Jumlah Bayaran (RM) *
                </label>
                <div className="bg-[#1b202c] border-2 border-white/10 focus-within:border-emerald-500 rounded-2xl p-3 px-4 flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-400">RM</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (expCategory === 'Minyak' && e.target.value) {
                        const amt = parseFloat(e.target.value);
                        if (!isNaN(amt) && amt > 0 && (!fuelLiters || fuelLiters === '0')) {
                          setFuelLiters((amt / 2.05).toFixed(2));
                        }
                      }
                    }}
                    className="w-full bg-transparent text-3xl font-extrabold text-white focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* ===================== SERVICES SPECIFIC ===================== */}
          {type === 'svc' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tarikh Servis
                  </label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Odometer (KM)
                  </label>
                  <input
                    type="number"
                    placeholder="64520"
                    value={svcMileage}
                    onChange={(e) => setSvcMileage(e.target.value)}
                    className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Bengkel / Pusat Servis
                </label>
                <input
                  type="text"
                  placeholder="Cth: Pusat Servis Toyota Puchong"
                  value={svcLocation}
                  onChange={(e) => setSvcLocation(e.target.value)}
                  className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Catatan / Item Diservis
                </label>
                <input
                  type="text"
                  placeholder="Cth: Minyak Hitam Fully Synth + Oil Filter + Brake Pad"
                  value={svcNotes}
                  onChange={(e) => setSvcNotes(e.target.value)}
                  className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Jumlah Kos Invois (RM) *
                </label>
                <div className="bg-[#1b202c] border-2 border-white/10 focus-within:border-indigo-500 rounded-2xl p-3 px-4 flex items-center gap-2">
                  <span className="text-xl font-bold text-indigo-400">RM</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-3xl font-extrabold text-white focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* ===================== MILEAGE SPECIFIC ===================== */}
          {type === 'mlg' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tarikh Perjalanan
                  </label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Jarak Dilalui (KM) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="0"
                    value={mlgKm}
                    onChange={(e) => handleKmChange(e.target.value)}
                    className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-extrabold text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Lokasi (Dari - Ke)
                </label>
                <input
                  type="text"
                  placeholder="Cth: Pejabat Cyberjaya - Tapak Projek Bangi"
                  value={mlgLocation}
                  onChange={(e) => setMlgLocation(e.target.value)}
                  className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tujuan / Urusan
                </label>
                <input
                  type="text"
                  placeholder="Cth: Mesyuarat Pelanggan & Audit Keselamatan"
                  value={mlgReason}
                  onChange={(e) => setMlgReason(e.target.value)}
                  className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
                />
              </div>

              {/* Auto Claim Calculation Card */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Jumlah Tuntutan Auto</span>
                  <p className="text-[10px] text-slate-400">Kadar: RM 0.70 / 1 KM</p>
                </div>
                <div className="flex items-baseline gap-1 text-rose-400">
                  <span className="text-sm font-bold">RM</span>
                  <span className="text-2xl font-extrabold tracking-tight">{amount || '0.00'}</span>
                </div>
              </div>
            </>
          )}

          {/* Receipt / Invoice Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bukti Resit / Invois / Odometer
            </label>

            {receiptImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-36 group shadow-inner">
                <img src={receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setReceiptImage(null)}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptImage(null)}
                  className="sm:hidden absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-28 border-2 border-dashed border-white/15 hover:border-orange-500/50 rounded-2xl bg-[#1b202c] hover:bg-[#222836] flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all">
                <Camera className="w-6 h-6 text-orange-400 mb-1.5" />
                <span className="text-xs font-bold">Ambil Gambar / Muat Naik Resit</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Format JPG / PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/5 flex gap-3">
            {currentEditingItem && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(currentEditingItem.id, type);
                  onClose();
                }}
                className="w-12 h-11 rounded-2xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Padam Rekod Ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#1e2432] text-slate-300 font-bold text-xs hover:bg-[#262e40] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-xs shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{currentEditingItem ? 'Simpan Kemaskini' : 'Simpan Rekod'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
