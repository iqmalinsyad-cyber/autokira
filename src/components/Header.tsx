import React, { useState } from 'react';
import { 
  ChevronDown, 
  Bell, 
  Radio, 
  Activity, 
  Check, 
  Plus, 
  Car, 
  Bike,
  User, 
  ShieldCheck,
  Zap,
  Heart
} from 'lucide-react';
import { Vehicle, UserProfile } from '../types';

interface HeaderProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenAddVehicle: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenQuickStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onOpenAddVehicle,
  user,
  onOpenAuth
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [engineState, setEngineState] = useState<'ON' | 'OFF'>('ON');

  return (
    <header className="relative z-30 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 px-3.5 sm:px-5 bg-[#0d1017]/95 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Pulse / Logo button */}
        <button 
          onClick={() => setEngineState(prev => prev === 'ON' ? 'OFF' : 'ON')}
          title="Status Kesihatan Enjin & Logo AutoKira"
          className="w-10 h-10 rounded-full bg-[#181d26] border border-white/10 flex items-center justify-center text-slate-300 hover:border-orange-500/50 transition-all active:scale-95 shadow-sm shrink-0 overflow-hidden p-1 relative group"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1GIRN_j3cMTDYDhfKbNocxUb7_ZCO2uHq" 
            alt="AutoKira Logo" 
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#181d26]"></span>
        </button>

        {/* Center Vehicle Switcher Pill */}
        <div className="relative flex-1 min-w-0 max-w-[280px]">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-[#181d26] hover:bg-[#202632] border border-white/10 rounded-full py-1.5 px-3 flex items-center justify-between gap-1.5 shadow-inner transition-all active:scale-98"
          >
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0 animate-pulse"></span>
              <div className="text-left truncate min-w-0">
                <p className="text-xs font-extrabold text-white tracking-wide truncate">
                  {activeVehicle ? activeVehicle.plateNumber : 'Pilih Kenderaan'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model}` : 'Tiada Kenderaan'}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-orange-400' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-[#181d26] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pilih Kenderaan</span>
                  <span className="text-[10px] bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded-full">
                    {vehicles.length} Kenderaan
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                  {vehicles.map((veh) => {
                    const isSelected = activeVehicle?.id === veh.id;
                    const isBike = veh.vehicleType === 'motorcycle';
                    return (
                      <button
                        key={veh.id}
                        onClick={() => {
                          onSelectVehicle(veh);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-orange-500/15 border border-orange-500/30 text-white' 
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-orange-500 text-white' : 'bg-[#222834] text-slate-400'}`}>
                            {isBike ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-white tracking-wide truncate">{veh.plateNumber}</p>
                            <p className="text-[10px] text-slate-400 truncate">{veh.nickName || `${veh.brand} ${veh.model}`}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-white/5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddVehicle();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#222834] hover:bg-orange-500 hover:text-white text-orange-400 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kenderaan Baru</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Notification & Google User Avatar */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenAuth}
            className="relative w-10 h-10 rounded-full bg-[#181d26] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:border-orange-500/30 transition-all active:scale-95 overflow-hidden"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-300" />
            )}
            {user && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#181d26]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Quick Status Bar (ON / OFF / Online) */}
      <div className="mt-3 mx-auto max-w-xs bg-[#151922] border border-white/5 rounded-full py-1.5 px-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-bold">
          <span className={`w-2 h-2 rounded-full ${engineState === 'ON' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></span>
          <span className={engineState === 'ON' ? 'text-emerald-400 text-[11px]' : 'text-slate-500 text-[11px]'}>
            {engineState === 'ON' ? '⏻ ON' : '⏻ OFF'}
          </span>
        </div>

        <div className="h-3 w-px bg-white/10"></div>

        <div className="flex items-center gap-1.5 font-semibold text-slate-400 text-[11px]">
          <Heart className="w-3 h-3 text-slate-500" />
          <span>OFF</span>
        </div>

        <div className="h-3 w-px bg-white/10"></div>

        <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px]">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Online</span>
        </div>
      </div>
    </header>
  );
};
