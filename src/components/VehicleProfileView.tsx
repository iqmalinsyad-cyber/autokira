import React, { useState, useRef } from 'react';
import { 
  Car, 
  Bike,
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Camera, 
  Edit3, 
  Trash2, 
  FileText, 
  Shield, 
  Sliders, 
  CheckCircle2, 
  Fuel, 
  Calendar, 
  Hash, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleProfileViewProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenAddVehicle: () => void;
  onOpenEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicleImage: (vehicleId: string, imageBase64: string) => void;
}

export const VehicleProfileView: React.FC<VehicleProfileViewProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onOpenAddVehicle,
  onOpenEditVehicle,
  onDeleteVehicle,
  onUpdateVehicleImage
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    activeVehicle?.id || (vehicles.length > 0 ? vehicles[0].id : '')
  );
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'docs' | 'insurance' | 'specs'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId) || activeVehicle || vehicles[0];
  const isMotorcycle = currentVehicle?.vehicleType === 'motorcycle';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentVehicle) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
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
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        onUpdateVehicleImage(currentVehicle.id, compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const nextVehicle = () => {
    const currentIndex = vehicles.findIndex(v => v.id === currentVehicle?.id);
    if (currentIndex >= 0 && currentIndex < vehicles.length - 1) {
      setSelectedVehicleId(vehicles[currentIndex + 1].id);
    } else {
      setSelectedVehicleId(vehicles[0].id);
    }
  };

  const prevVehicle = () => {
    const currentIndex = vehicles.findIndex(v => v.id === currentVehicle?.id);
    if (currentIndex > 0) {
      setSelectedVehicleId(vehicles[currentIndex - 1].id);
    } else {
      setSelectedVehicleId(vehicles[vehicles.length - 1].id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#181d26] flex items-center justify-center text-orange-400">
            {isMotorcycle ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Profil Kenderaan</h2>
            <p className="text-[11px] text-slate-400">Pengurusan Profil Kereta & Motorsikal</p>
          </div>
        </div>

        <button
          onClick={onOpenAddVehicle}
          className="bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 font-bold text-xs py-1.5 px-3.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kenderaan</span>
        </button>
      </div>

      {/* Hidden file input for vehicle image upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Vehicle Selector Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {vehicles.map((veh) => {
          const isViewing = veh.id === currentVehicle?.id;
          const isAct = veh.id === activeVehicle?.id;
          const isBike = veh.vehicleType === 'motorcycle';
          return (
            <button
              key={veh.id}
              onClick={() => setSelectedVehicleId(veh.id)}
              className={`shrink-0 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isViewing
                  ? 'bg-[#1e2432] border-orange-500 text-white shadow-sm'
                  : 'bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                {isBike ? <Bike className="w-3.5 h-3.5 text-orange-400" /> : <Car className="w-3.5 h-3.5 text-orange-400" />}
                <span className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              </div>
              <span>{veh.plateNumber}</span>
              {isAct && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-extrabold">Aktif</span>}
            </button>
          );
        })}
      </div>

      {currentVehicle ? (
        <>
          {/* Main Vehicle Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden bg-[#181d26] border border-white/5 shadow-2xl h-56 group">
            <img
              src={currentVehicle.image || (isMotorcycle ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop')}
              alt={currentVehicle.plateNumber}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

            {/* Top Vehicle Type Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-slate-200">
              {isMotorcycle ? <Bike className="w-3.5 h-3.5 text-orange-400" /> : <Car className="w-3.5 h-3.5 text-orange-400" />}
              <span>{isMotorcycle ? 'Motorsikal' : 'Kereta'}</span>
            </div>

            {/* Next/Previous Carousel Arrow Buttons */}
            {vehicles.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevVehicle}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextVehicle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Plate Badge overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {currentVehicle.brand} {currentVehicle.year}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1 drop-shadow-md">
                  {currentVehicle.plateNumber}
                </h3>
                <p className="text-xs text-slate-300 font-medium drop-shadow-sm">
                  {currentVehicle.nickName || currentVehicle.model}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenEditVehicle(currentVehicle)}
                  className="w-9 h-9 rounded-xl bg-black/60 hover:bg-orange-500 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  title="Kemaskini Profil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {vehicles.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVehicle(currentVehicle);
                    }}
                    className="w-9 h-9 rounded-xl bg-black/60 hover:bg-red-500 backdrop-blur-md text-red-400 hover:text-white border border-red-500/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Padam Profil Kenderaan Ini Secara Kekal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: [ Activate ] and [ Add Image ] */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectVehicle(currentVehicle)}
              className={`py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                activeVehicle?.id === currentVehicle.id
                  ? 'bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)]'
              }`}
            >
              {activeVehicle?.id === currentVehicle.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aktif Sekarang</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Jadikan Aktif</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-3.5 px-4 rounded-2xl bg-[#181d26] hover:bg-[#202634] border border-white/10 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-400" />
              <span>Tukar Gambar</span>
            </button>
          </div>

          {/* Sub-Tab Navigation Pills */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveSubTab('details')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                activeSubTab === 'details'
                  ? 'bg-[#1e2432] border-orange-500 text-white shadow-sm'
                  : 'bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isMotorcycle ? <Bike className="w-4 h-4 text-orange-400" /> : <Car className="w-4 h-4 text-orange-400" />}
              <span>Butiran Kenderaan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('docs')}
              className={`w-11 h-10 rounded-xl font-bold flex items-center justify-center transition-all border cursor-pointer ${
                activeSubTab === 'docs'
                  ? 'bg-[#1e2432] border-orange-500 text-white'
                  : 'bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title="Documents & Geran"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('insurance')}
              className={`w-11 h-10 rounded-xl font-bold flex items-center justify-center transition-all border cursor-pointer ${
                activeSubTab === 'insurance'
                  ? 'bg-[#1e2432] border-orange-500 text-white'
                  : 'bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title="Insurans & Cukai Jalan"
            >
              <Shield className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('specs')}
              className={`w-11 h-10 rounded-xl font-bold flex items-center justify-center transition-all border cursor-pointer ${
                activeSubTab === 'specs'
                  ? 'bg-[#1e2432] border-orange-500 text-white'
                  : 'bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title="OBD & Spesifikasi"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Key-Value Details List */}
          <div className="bg-[#181d26] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-3.5">
            {activeSubTab === 'details' && (
              <>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-400 font-medium">Jenis Kenderaan:</span>
                  <span className="font-extrabold text-orange-400 flex items-center gap-1.5">
                    {isMotorcycle ? <Bike className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                    {isMotorcycle ? 'Motorsikal (Motorcycle)' : 'Kereta (Car)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">No. Pendaftaran (Plat):</span>
                  <span className="font-extrabold text-white tracking-wider">{currentVehicle.plateNumber}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Nama Panggilan:</span>
                  <span className="font-bold text-slate-200">{currentVehicle.nickName || '-'}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Jenama (Brand):</span>
                  <span className="font-bold text-slate-200">{currentVehicle.brand}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Model & Varian:</span>
                  <span className="font-bold text-slate-200">{currentVehicle.model}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Tahun Buatan:</span>
                  <span className="font-bold text-slate-200">{currentVehicle.year}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Odometer Semasa:</span>
                  <span className="font-extrabold text-white">{currentVehicle.currentOdometer.toLocaleString()} KM</span>
                </div>
              </>
            )}

            {activeSubTab === 'insurance' && (
              <>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-400 font-medium">Syarikat Insurans:</span>
                  <span className="font-bold text-slate-200">{currentVehicle.insuranceCompany || 'Etiqa Takaful'}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Tamat Insurans:</span>
                  <span className="font-bold text-orange-400">{currentVehicle.insuranceExpiry || '2026-11-20'}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Tamat Cukai Jalan (Roadtax):</span>
                  <span className="font-bold text-emerald-400">{currentVehicle.roadtaxExpiry || '2026-11-20'}</span>
                </div>
              </>
            )}

            {activeSubTab === 'docs' && (
              <div className="py-2 text-center text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-500 mb-1" />
                <p className="font-bold text-slate-300">Dokumen Geran & Invois Pembelian</p>
                <p className="text-[11px] text-slate-500">Semua rekod pemilikan kenderaan disimpan selamat dalam pangkalan data AutoKira.</p>
              </div>
            )}

            {activeSubTab === 'specs' && (
              <>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-400 font-medium">Jenis Bahan Api:</span>
                  <span className="font-bold text-slate-200">{currentVehicle.fuelType || 'Petrol (RON 95/97)'}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Sasaran Servis Akan Datang:</span>
                  <span className="font-bold text-orange-400">{currentVehicle.targetNextServiceKm?.toLocaleString() || '65,000'} KM</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                  <span className="text-slate-400 font-medium">Status ECU & Sensor:</span>
                  <span className="font-bold text-emerald-400">Normal & Diagnostik Sihat</span>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-[#181d26] border border-white/5 rounded-3xl p-8 text-center">
          <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">Tiada Profil Kenderaan</h3>
          <p className="text-xs text-slate-400 mt-1">Sila tambah profil kenderaan pertama anda untuk memulakan pengurusan rekod berasingan.</p>
          <button
            type="button"
            onClick={onOpenAddVehicle}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-5 rounded-2xl transition-all shadow-md cursor-pointer"
          >
            + Tambah Kenderaan
          </button>
        </div>
      )}
    </div>
  );
};
