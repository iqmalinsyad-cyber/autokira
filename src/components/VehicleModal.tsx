import React, { useState, useEffect } from 'react';
import { X, Car, Bike, Camera, Check, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Partial<Vehicle>) => void;
  editingVehicle: Vehicle | null;
}

const CAR_BRANDS = ['Perodua', 'Proton', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mercedes-Benz', 'BMW', 'Hyundai', 'BYD'];
const MOTORCYCLE_BRANDS = ['Yamaha', 'Honda', 'Modenas', 'SYM', 'Kawasaki', 'Suzuki', 'Benelli', 'Vespa', 'KTM', 'BMW Motorrad'];

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVehicle
}) => {
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle'>('car');
  const [plateNumber, setPlateNumber] = useState('');
  const [nickName, setNickName] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [vin, setVin] = useState('');
  const [currentOdometer, setCurrentOdometer] = useState<string>('');
  const [targetNextServiceKm, setTargetNextServiceKm] = useState<string>('');
  const [fuelType, setFuelType] = useState('Petrol (RON 95/97)');
  const [roadtaxExpiry, setRoadtaxExpiry] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('Etiqa Takaful');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (editingVehicle) {
      setVehicleType(editingVehicle.vehicleType || 'car');
      setPlateNumber(editingVehicle.plateNumber || '');
      setNickName(editingVehicle.nickName || '');
      setBrand(editingVehicle.brand || (editingVehicle.vehicleType === 'motorcycle' ? 'Yamaha' : 'Toyota'));
      setModel(editingVehicle.model || '');
      setYear(editingVehicle.year || new Date().getFullYear());
      setVin(editingVehicle.vin || '');
      setCurrentOdometer(editingVehicle.currentOdometer ? String(editingVehicle.currentOdometer) : '');
      setTargetNextServiceKm(editingVehicle.targetNextServiceKm ? String(editingVehicle.targetNextServiceKm) : '');
      setFuelType(editingVehicle.fuelType || (editingVehicle.vehicleType === 'motorcycle' ? 'Petrol (RON 95)' : 'Petrol (RON 95/97)'));
      setRoadtaxExpiry(editingVehicle.roadtaxExpiry || '');
      setInsuranceCompany(editingVehicle.insuranceCompany || 'Etiqa Takaful');
      setImage(editingVehicle.image || '');
    } else {
      setVehicleType('car');
      setPlateNumber('');
      setNickName('');
      setBrand('Toyota');
      setModel('');
      setYear(new Date().getFullYear());
      setVin('');
      setCurrentOdometer('');
      setTargetNextServiceKm('');
      setFuelType('Petrol (RON 95/97)');
      setRoadtaxExpiry('');
      setInsuranceCompany('Etiqa Takaful');
      setImage('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop');
    }
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'car' | 'motorcycle') => {
    setVehicleType(newType);
    if (!editingVehicle) {
      if (newType === 'motorcycle') {
        if (brand === 'Toyota' || brand === 'Perodua' || brand === 'Proton') {
          setBrand('Yamaha');
        }
        setFuelType('Petrol (RON 95)');
        setImage('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop');
      } else {
        if (brand === 'Yamaha' || brand === 'SYM' || brand === 'Modenas') {
          setBrand('Toyota');
        }
        setFuelType('Petrol (RON 95/97)');
        setImage('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    const odo = parseInt(currentOdometer) || 0;
    const defaultNextInterval = vehicleType === 'motorcycle' ? 3000 : 10000;
    const nextService = targetNextServiceKm ? parseInt(targetNextServiceKm) : (odo > 0 ? odo + defaultNextInterval : defaultNextInterval);

    const defaultImg = vehicleType === 'motorcycle'
      ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop';

    onSave({
      vehicleType,
      plateNumber: plateNumber.toUpperCase().trim(),
      nickName: nickName.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year) || new Date().getFullYear(),
      vin: vin.trim(),
      currentOdometer: odo,
      targetNextServiceKm: nextService,
      fuelType,
      roadtaxExpiry,
      insuranceCompany,
      image: image || defaultImg,
    });
    onClose();
  };

  const brandsList = vehicleType === 'motorcycle' ? MOTORCYCLE_BRANDS : CAR_BRANDS;

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
              {vehicleType === 'motorcycle' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {editingVehicle ? 'Kemaskini Profil Kenderaan' : 'Tambah Profil Kenderaan'}
              </h3>
              <p className="text-[11px] text-slate-400">Pilih jenis kenderaan & rekod servis berkala</p>
            </div>
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
          {/* VEHICLE TYPE SELECTOR (KERETA vs MOTORSIKAL) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Jenis Kenderaan *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('car')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 font-extrabold text-xs transition-all cursor-pointer ${
                  vehicleType === 'car'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/25 ring-2 ring-orange-500/40'
                    : 'bg-[#1b202c] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Kereta (Car)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('motorcycle')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 font-extrabold text-xs transition-all cursor-pointer ${
                  vehicleType === 'motorcycle'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/25 ring-2 ring-orange-500/40'
                    : 'bg-[#1b202c] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Motorsikal (Bike)</span>
              </button>
            </div>
          </div>

          {/* Plate Number & Nickname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                No. Plat Kenderaan *
              </label>
              <input
                type="text"
                required
                placeholder={vehicleType === 'motorcycle' ? "Cth: VDJ 1234" : "Cth: ABC 834 ZA"}
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-white uppercase focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Nama Panggilan
              </label>
              <input
                type="text"
                placeholder={vehicleType === 'motorcycle' ? "Cth: Y15 King / Daily Bike" : "Cth: My Daily Camry"}
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Jenama (Brand)
              </label>
              <input
                type="text"
                placeholder={vehicleType === 'motorcycle' ? "Cth: Yamaha / Honda" : "Cth: Toyota / Perodua"}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Model & Varian
              </label>
              <input
                type="text"
                placeholder={vehicleType === 'motorcycle' ? "Cth: Y15ZR V2 / NVX 155" : "Cth: Camry 2.5V / Myvi 1.5"}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Quick Brand Pills */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Pilihan Pantas Jenama {vehicleType === 'motorcycle' ? 'Motorsikal' : 'Kereta'}:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {brandsList.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    brand.toLowerCase() === b.toLowerCase()
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-[#1b202c] text-slate-400 border-white/5 hover:text-white hover:border-white/15'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Year & VIN */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tahun Buatan
              </label>
              <input
                type="number"
                min="1980"
                max="2035"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2020)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                No. Chasis (VIN)
              </label>
              <input
                type="text"
                placeholder="2T1BU40E49C179680"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-orange-400 focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Current Odometer & Next Service Target */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Odometer Semasa (KM)
              </label>
              <input
                type="number"
                placeholder={vehicleType === 'motorcycle' ? "14200" : "64520"}
                value={currentOdometer}
                onChange={(e) => setCurrentOdometer(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Sasaran Servis (KM)
              </label>
              <input
                type="number"
                placeholder={vehicleType === 'motorcycle' ? "17000" : "75000"}
                value={targetNextServiceKm}
                onChange={(e) => setTargetNextServiceKm(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-orange-400 focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Fuel Type & Insurance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Jenis Bahan Api
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Petrol (RON 95/97)">Petrol (RON 95 / 97)</option>
                <option value="Petrol (RON 95)">Petrol (RON 95)</option>
                <option value="Petrol (RON 97)">Petrol (RON 97)</option>
                <option value="Diesel Euro 5">Diesel Euro 5</option>
                <option value="Hybrid / PHEV">Hybrid / PHEV</option>
                <option value="Elektrik Penuh (EV)">Elektrik Penuh (EV)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Syarikat Insurans
              </label>
              <input
                type="text"
                placeholder="Cth: Etiqa / Allianz"
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Vehicle Image Preview & Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Gambar {vehicleType === 'motorcycle' ? 'Motorsikal' : 'Kereta'}
            </label>
            <div className="flex items-center gap-3">
              {image && (
                <div className="w-20 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 cursor-pointer bg-[#1b202c] hover:bg-[#232938] border border-dashed border-white/20 rounded-xl py-3 px-4 text-center text-xs font-bold text-slate-300 transition-colors flex items-center justify-center gap-2">
                <Camera className="w-4 h-4 text-orange-400" />
                <span>Muat Naik Gambar {vehicleType === 'motorcycle' ? 'Motorsikal' : 'Kereta'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#1e2432] text-slate-300 font-bold text-xs hover:bg-[#262e40] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-xs shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingVehicle ? 'Simpan Kemaskini' : `Tambah ${vehicleType === 'motorcycle' ? 'Motorsikal' : 'Kereta'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
