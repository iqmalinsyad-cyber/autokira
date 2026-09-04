import React, { useState, useEffect } from 'react';
import { X, Car, Bike, Camera, Check, Plus, Trash2 } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Partial<Vehicle>) => void;
  editingVehicle: Vehicle | null;
}

const DEFAULT_CAR_BRANDS = ['Perodua', 'Proton', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mercedes-Benz', 'BMW', 'Hyundai', 'BYD', 'Chery', 'Tesla'];
const DEFAULT_MOTORCYCLE_BRANDS = ['Yamaha', 'Honda', 'Modenas', 'SYM', 'Kawasaki', 'Suzuki', 'Benelli', 'Vespa', 'KTM', 'BMW Motorrad'];

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
  const [currentOdometer, setCurrentOdometer] = useState<string>('');
  const [targetNextServiceKm, setTargetNextServiceKm] = useState<string>('');
  const [fuelType, setFuelType] = useState('Petrol (RON 95/97)');
  const [roadtaxExpiry, setRoadtaxExpiry] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('Etiqa Takaful');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [image, setImage] = useState<string>('');

  // Customizable Quick Brand lists stored in localStorage
  const [carBrands, setCarBrands] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_custom_car_brands');
      return saved ? JSON.parse(saved) : DEFAULT_CAR_BRANDS;
    } catch {
      return DEFAULT_CAR_BRANDS;
    }
  });

  const [motorcycleBrands, setMotorcycleBrands] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_custom_motorcycle_brands');
      return saved ? JSON.parse(saved) : DEFAULT_MOTORCYCLE_BRANDS;
    } catch {
      return DEFAULT_MOTORCYCLE_BRANDS;
    }
  });

  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [newBrandInput, setNewBrandInput] = useState('');

  useEffect(() => {
    if (editingVehicle) {
      setVehicleType(editingVehicle.vehicleType || 'car');
      setPlateNumber(editingVehicle.plateNumber || '');
      setNickName(editingVehicle.nickName || '');
      setBrand(editingVehicle.brand || (editingVehicle.vehicleType === 'motorcycle' ? 'Yamaha' : 'Toyota'));
      setModel(editingVehicle.model || '');
      setYear(editingVehicle.year || new Date().getFullYear());
      setCurrentOdometer(editingVehicle.currentOdometer ? String(editingVehicle.currentOdometer) : '');
      setTargetNextServiceKm(editingVehicle.targetNextServiceKm ? String(editingVehicle.targetNextServiceKm) : '');
      setFuelType(editingVehicle.fuelType || (editingVehicle.vehicleType === 'motorcycle' ? 'Petrol (RON 95)' : 'Petrol (RON 95/97)'));
      setRoadtaxExpiry(editingVehicle.roadtaxExpiry || '');
      setInsuranceCompany(editingVehicle.insuranceCompany || 'Etiqa Takaful');
      setInsuranceExpiry(editingVehicle.insuranceExpiry || '');
      setImage(editingVehicle.image || '');
    } else {
      setVehicleType('car');
      setPlateNumber('');
      setNickName('');
      setBrand('Toyota');
      setModel('');
      setYear(new Date().getFullYear());
      setCurrentOdometer('');
      setTargetNextServiceKm('');
      setFuelType('Petrol (RON 95/97)');
      setRoadtaxExpiry('');
      setInsuranceCompany('Etiqa Takaful');
      setInsuranceExpiry('');
      setImage('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop');
    }
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'car' | 'motorcycle') => {
    setVehicleType(newType);
    if (!editingVehicle) {
      if (newType === 'motorcycle') {
        if (brand === 'Toyota' || brand === 'Perodua' || brand === 'Proton') {
          setBrand(motorcycleBrands[0] || 'Yamaha');
        }
        setFuelType('Petrol (RON 95)');
        setImage('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop');
      } else {
        if (brand === 'Yamaha' || brand === 'SYM' || brand === 'Modenas') {
          setBrand(carBrands[0] || 'Toyota');
        }
        setFuelType('Petrol (RON 95/97)');
        setImage('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop');
      }
    }
  };

  const handleAddNewBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBrand = newBrandInput.trim();
    if (!cleanBrand) return;

    if (vehicleType === 'car') {
      if (!carBrands.some(b => b.toLowerCase() === cleanBrand.toLowerCase())) {
        const updated = [...carBrands, cleanBrand];
        setCarBrands(updated);
        localStorage.setItem('autokira_custom_car_brands', JSON.stringify(updated));
      }
    } else {
      if (!motorcycleBrands.some(b => b.toLowerCase() === cleanBrand.toLowerCase())) {
        const updated = [...motorcycleBrands, cleanBrand];
        setMotorcycleBrands(updated);
        localStorage.setItem('autokira_custom_motorcycle_brands', JSON.stringify(updated));
      }
    }

    setBrand(cleanBrand);
    setNewBrandInput('');
    setIsAddingNewBrand(false);
  };

  const handleDeleteBrand = (brandToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (vehicleType === 'car') {
      const updated = carBrands.filter(b => b !== brandToDelete);
      setCarBrands(updated);
      localStorage.setItem('autokira_custom_car_brands', JSON.stringify(updated));
      if (brand === brandToDelete && updated.length > 0) {
        setBrand(updated[0]);
      }
    } else {
      const updated = motorcycleBrands.filter(b => b !== brandToDelete);
      setMotorcycleBrands(updated);
      localStorage.setItem('autokira_custom_motorcycle_brands', JSON.stringify(updated));
      if (brand === brandToDelete && updated.length > 0) {
        setBrand(updated[0]);
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
      currentOdometer: odo,
      targetNextServiceKm: nextService,
      fuelType,
      roadtaxExpiry: roadtaxExpiry.trim(),
      insuranceCompany: insuranceCompany.trim(),
      insuranceExpiry: insuranceExpiry.trim(),
      image: image || defaultImg,
    });
    onClose();
  };

  const brandsList = vehicleType === 'motorcycle' ? motorcycleBrands : carBrands;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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

          {/* Quick Brand Pills with Add / Delete Functionality */}
          <div className="bg-[#181d26] border border-white/5 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pilihan Pantas Jenama {vehicleType === 'motorcycle' ? 'Motorsikal' : 'Kereta'}:
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNewBrand(!isAddingNewBrand)}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Jenama</span>
              </button>
            </div>

            {/* Inline Add Brand Form */}
            {isAddingNewBrand && (
              <div className="flex items-center gap-2 mb-2.5 pt-1">
                <input
                  type="text"
                  placeholder={`Nama jenama ${vehicleType === 'motorcycle' ? 'motorsikal' : 'kereta'} baru...`}
                  value={newBrandInput}
                  onChange={(e) => setNewBrandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewBrand(e);
                    }
                  }}
                  className="flex-1 bg-[#141822] border border-orange-500/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewBrand}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewBrand(false)}
                  className="bg-[#1e2432] text-slate-400 hover:text-white text-xs font-bold px-2 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Brand Badges List with delete icon */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {brandsList.map((b) => {
                const isSelected = brand.toLowerCase() === b.toLowerCase();
                return (
                  <div
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`text-[11px] font-bold pl-2.5 pr-1.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer group ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-[#141822] text-slate-300 border-white/5 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteBrand(b, e)}
                      title={`Padam jenama ${b}`}
                      className={`p-0.5 rounded transition-all opacity-40 hover:opacity-100 ${
                        isSelected ? 'hover:bg-orange-600 text-white' : 'hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Year & Current Odometer */}
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
          </div>

          {/* Next Service Target KM */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sasaran Servis Seterusnya (KM)
            </label>
            <input
              type="number"
              placeholder={vehicleType === 'motorcycle' ? "17000" : "75000"}
              value={targetNextServiceKm}
              onChange={(e) => setTargetNextServiceKm(e.target.value)}
              className="w-full bg-[#1b202c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-orange-400 focus:outline-none focus:border-orange-500 placeholder-slate-500"
            />
          </div>

          {/* Fuel Type & Insurance Company */}
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

          {/* Roadtax & Insurance Expiry Dates */}
          <div className="grid grid-cols-2 gap-3 bg-[#181d26] border border-white/5 p-3.5 rounded-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tamat Cukai Jalan (Roadtax)
              </label>
              <input
                type="date"
                value={roadtaxExpiry}
                onChange={(e) => setRoadtaxExpiry(e.target.value)}
                className="w-full bg-[#141822] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Tarikh tamat cukai jalan</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tamat Tempoh Insurans
              </label>
              <input
                type="date"
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="w-full bg-[#141822] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Tarikh tamat polisi insurans</span>
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
