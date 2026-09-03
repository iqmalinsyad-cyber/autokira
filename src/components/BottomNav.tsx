import React from 'react';
import { 
  Car, 
  Wallet, 
  Home, 
  Wrench, 
  Navigation,
  Plus
} from 'lucide-react';
import { MainTabType } from '../types';

interface BottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  onOpenAddRecord: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddRecord
}) => {
  const tabs = [
    { id: 'vehicles' as MainTabType, label: 'Kenderaan', icon: Car },
    { id: 'expenses' as MainTabType, label: 'Harian', icon: Wallet },
    { id: 'dashboard' as MainTabType, label: 'Dashboard', icon: Home, isCenter: true },
    { id: 'services' as MainTabType, label: 'Servis', icon: Wrench },
    { id: 'mileage' as MainTabType, label: 'Mileage', icon: Navigation },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 pointer-events-none transition-all">
      <nav className="pointer-events-auto bg-[#131720]/95 backdrop-blur-xl border border-white/10 rounded-[1.75rem] p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.65)] flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex-1 min-w-[56px] min-h-[48px] flex flex-col items-center justify-center p-1 rounded-2xl transition-all duration-200 group active:scale-95 ${
                  isActive ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-12 h-9 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.45)] scale-105' 
                    : 'bg-[#1e2430] text-slate-300 group-hover:bg-[#283040]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight truncate ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-orange-500/15 text-orange-400 font-bold' : 'text-slate-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 tracking-tight truncate ${
                isActive ? 'text-orange-400 font-bold' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
