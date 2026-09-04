import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ExpensesView } from './components/ExpensesView';
import { ServicesView } from './components/ServicesView';
import { MileageView } from './components/MileageView';
import { VehicleProfileView } from './components/VehicleProfileView';
import { VehicleModal } from './components/VehicleModal';
import { RecordModal } from './components/RecordModal';
import { PreviewModal } from './components/PreviewModal';
import { DeleteModal } from './components/DeleteModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { Toast, ToastMessage } from './components/Toast';
import { PWAInstallBanner } from './components/PWAInstallBanner';

import { Vehicle, ExpenseRecord, ServiceRecord, MileageRecord, UserProfile, MainTabType } from './types';
import { INITIAL_VEHICLES } from './data/defaultVehicles';
import { 
  loginWithGoogle, 
  logoutGoogle 
} from './lib/firebase';

// Helper to derive safe storage prefix for any user
const getStoragePrefix = (userProfile?: UserProfile | null): string => {
  if (!userProfile) return 'autokira_guest';
  if ((userProfile.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com') {
    return 'autokira_iqmal';
  }
  return `autokira_user_${userProfile.uid || userProfile.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

// Default clean vehicle for new users
const createDefaultUserVehicle = (userDisplayName: string): Vehicle => ({
  id: 'veh-usr-' + Date.now(),
  plateNumber: 'WXX 1234',
  nickName: 'Kereta Saya',
  brand: 'Perodua',
  model: 'Myvi 1.5 AV',
  year: 2023,
  vin: 'PM2M800S00' + Math.floor(100000 + Math.random() * 900000),
  currentOdometer: 15400,
  targetNextServiceKm: 20000,
  fuelType: 'Petrol (RON 95)',
  roadtaxExpiry: '2026-12-31',
  insuranceCompany: 'Etiqa Takaful',
  insuranceExpiry: '2026-12-31',
  image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop'],
  isActive: true,
  createdAt: Date.now(),
  telemetry: {
    speedKmh: 0,
    fuelLevelLtrs: 28.5,
    batteryVoltage: 12.4,
    engineStatus: 'OFF',
    healthStatus: 'Good',
    locationName: 'Garaj Kediaman',
    lastUpdated: 'Baru dikemaskini'
  }
});

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<MainTabType>('dashboard');

  // User State - strictly respects explicit logout state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const isLoggedOut = localStorage.getItem('autokira_logged_out');
      if (isLoggedOut === 'true') {
        return null;
      }
      const saved = localStorage.getItem('autokira_user');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });

  // State initialization strictly from Local Storage
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const prefix = getStoragePrefix(user);
      const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
      const saved = localStorage.getItem(`${prefix}_vehicles`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_vehicles') || localStorage.getItem('autokira_vehicles') : null);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return isIqmal ? INITIAL_VEHICLES : [createDefaultUserVehicle(user?.displayName || 'Pengguna')];
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    try {
      const prefix = getStoragePrefix(user);
      const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
      const saved = localStorage.getItem(`${prefix}_active_vehicle_id`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_active_vehicle_id') || localStorage.getItem('autokira_active_vehicle_id') : null);
      return saved || (INITIAL_VEHICLES[0]?.id ?? '');
    } catch {
      return INITIAL_VEHICLES[0]?.id ?? '';
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const prefix = getStoragePrefix(user);
      const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
      const saved = localStorage.getItem(`${prefix}_expenses`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_expenses') || localStorage.getItem('autokira_expenses') : null);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [services, setServices] = useState<ServiceRecord[]>(() => {
    try {
      const prefix = getStoragePrefix(user);
      const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
      const saved = localStorage.getItem(`${prefix}_services`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_services') || localStorage.getItem('autokira_services') : null);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mileage, setMileage] = useState<MileageRecord[]>(() => {
    try {
      const prefix = getStoragePrefix(user);
      const isIqmal = (user?.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
      const saved = localStorage.getItem(`${prefix}_mileage`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_mileage') || localStorage.getItem('autokira_mileage') : null);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordModalType, setRecordModalType] = useState<'exp' | 'svc' | 'mlg'>('exp');
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | ServiceRecord | MileageRecord | null>(null);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'exp' | 'svc' | 'mlg' | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'exp' | 'svc' | 'mlg' | 'veh'; title?: string } | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Active Vehicle computed
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null;

  // Persist State to Local Storage whenever it updates
  useEffect(() => {
    if (user) {
      localStorage.setItem('autokira_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autokira_user');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(vehicles));
    if (prefix === 'autokira_iqmal') {
      localStorage.setItem('autokira_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles, user]);

  useEffect(() => {
    if (!user || !activeVehicleId) return;
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`${prefix}_active_vehicle_id`, activeVehicleId);
    if (prefix === 'autokira_iqmal') {
      localStorage.setItem('autokira_active_vehicle_id', activeVehicleId);
    }
  }, [activeVehicleId, user]);

  useEffect(() => {
    if (!user) return;
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`${prefix}_expenses`, JSON.stringify(expenses));
    if (prefix === 'autokira_iqmal') {
      localStorage.setItem('autokira_expenses', JSON.stringify(expenses));
    }
  }, [expenses, user]);

  useEffect(() => {
    if (!user) return;
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`${prefix}_services`, JSON.stringify(services));
    if (prefix === 'autokira_iqmal') {
      localStorage.setItem('autokira_services', JSON.stringify(services));
    }
  }, [services, user]);

  useEffect(() => {
    if (!user) return;
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`${prefix}_mileage`, JSON.stringify(mileage));
    if (prefix === 'autokira_iqmal') {
      localStorage.setItem('autokira_mileage', JSON.stringify(mileage));
    }
  }, [mileage, user]);

  // Load User-Specific Data when user logs in or switches
  const loadUserDataForAccount = (targetUser: UserProfile) => {
    const prefix = getStoragePrefix(targetUser);
    const isIqmal = (targetUser.email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';

    // Vehicles
    const rawVeh = localStorage.getItem(`${prefix}_vehicles`) || 
                    (isIqmal ? localStorage.getItem('autokira_iqmal_vehicles') || localStorage.getItem('autokira_vehicles') : null);
    let loadedVehicles: Vehicle[] = [];
    if (rawVeh) {
      try {
        const parsed = JSON.parse(rawVeh);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedVehicles = parsed;
        }
      } catch {
        loadedVehicles = [];
      }
    }
    if (loadedVehicles.length === 0) {
      loadedVehicles = isIqmal ? INITIAL_VEHICLES : [createDefaultUserVehicle(targetUser.displayName || 'Pengguna')];
    }
    setVehicles(loadedVehicles);

    // Active Vehicle ID
    const rawActiveId = localStorage.getItem(`${prefix}_active_vehicle_id`) || 
                        (isIqmal ? localStorage.getItem('autokira_iqmal_active_vehicle_id') || localStorage.getItem('autokira_active_vehicle_id') : null);
    if (rawActiveId && loadedVehicles.some(v => v.id === rawActiveId)) {
      setActiveVehicleId(rawActiveId);
    } else if (loadedVehicles.length > 0) {
      setActiveVehicleId(loadedVehicles[0].id);
    }

    // Expenses
    const rawExp = localStorage.getItem(`${prefix}_expenses`) || 
                   (isIqmal ? localStorage.getItem('autokira_iqmal_expenses') || localStorage.getItem('autokira_expenses') : null);
    setExpenses(rawExp ? JSON.parse(rawExp) : []);

    // Services
    const rawSvc = localStorage.getItem(`${prefix}_services`) || 
                   (isIqmal ? localStorage.getItem('autokira_iqmal_services') || localStorage.getItem('autokira_services') : null);
    setServices(rawSvc ? JSON.parse(rawSvc) : []);

    // Mileage
    const rawMlg = localStorage.getItem(`${prefix}_mileage`) || 
                   (isIqmal ? localStorage.getItem('autokira_iqmal_mileage') || localStorage.getItem('autokira_mileage') : null);
    setMileage(rawMlg ? JSON.parse(rawMlg) : []);
  };

  // --- VEHICLE HANDLERS ---
  const handleSelectVehicle = (v: Vehicle) => {
    setActiveVehicleId(v.id);
    setVehicles((prev) =>
      prev.map((item) => ({
        ...item,
        isActive: item.id === v.id
      }))
    );
    addToast(`Kenderaan aktif: ${v.plateNumber} (${v.nickName || v.brand})`, 'success');
  };

  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    try {
      if (editingVehicle) {
        const updatedVehicle: Vehicle = {
          ...editingVehicle,
          ...vehicleData
        } as Vehicle;

        setVehicles((prev) => {
          const next = prev.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v));
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Profil kenderaan berjaya dikemaskini.', 'success');
      } else {
        const newId = 'veh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const newVehicle: Vehicle = {
          id: newId,
          plateNumber: vehicleData.plateNumber || 'CAR 001',
          nickName: vehicleData.nickName || '',
          brand: vehicleData.brand || 'Toyota',
          model: vehicleData.model || 'Model',
          year: vehicleData.year || 2023,
          vin: vehicleData.vin || '',
          currentOdometer: vehicleData.currentOdometer || 0,
          targetNextServiceKm: vehicleData.targetNextServiceKm || (vehicleData.currentOdometer || 0) + 10000,
          fuelType: vehicleData.fuelType || 'Petrol (RON 95/97)',
          roadtaxExpiry: vehicleData.roadtaxExpiry || '',
          insuranceCompany: vehicleData.insuranceCompany || 'Etiqa Takaful',
          image: vehicleData.image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop',
          images: [vehicleData.image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop'],
          isActive: false,
          createdAt: Date.now(),
          telemetry: {
            speedKmh: 0,
            fuelLevelLtrs: 35,
            batteryVoltage: 12.4,
            engineStatus: 'OFF',
            healthStatus: 'Good',
            locationName: 'Garaj Rumah / Parkir',
            lastUpdated: 'Baru didaftarkan'
          }
        };

        setVehicles((prev) => {
          const next = [...prev, newVehicle];
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(next));
          }
          return next;
        });
        setActiveVehicleId(newVehicle.id);

        addToast(`Profil kenderaan ${newVehicle.plateNumber} berjaya ditambah!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Ralat semasa menyimpan profil kenderaan.', 'error');
    }
  };

  const handleUpdateVehicleImage = (vehId: string, imageBase64: string) => {
    setVehicles((prev) => {
      const next = prev.map((v) => (v.id === vehId ? { ...v, image: imageBase64 } : v));
      if (user) {
        const prefix = getStoragePrefix(user);
        localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(next));
      }
      return next;
    });
    addToast('Gambar profil kenderaan berjaya dikemaskini!', 'success');
  };

  const handleDeleteVehiclePrompt = (veh: Vehicle) => {
    setDeleteTarget({
      id: veh.id,
      type: 'veh',
      title: `Padam Kereta ${veh.plateNumber}?`
    });
    setDeleteModalOpen(true);
  };

  // --- RECORD HANDLERS ---
  const handleOpenAddRecord = (type: 'exp' | 'svc' | 'mlg') => {
    setRecordModalType(type);
    setEditingRecord(null);
    setRecordModalOpen(true);
  };

  const handleOpenRecordPreview = (id: string, type: 'exp' | 'svc' | 'mlg') => {
    setPreviewDocId(id);
    setPreviewType(type);
    setPreviewModalOpen(true);
  };

  const handleOpenEditFromPreview = () => {
    if (!previewDocId || !previewType) return;
    setPreviewModalOpen(false);

    let target: any = null;
    if (previewType === 'exp') target = expenses.find((x) => x.id === previewDocId);
    else if (previewType === 'svc') target = services.find((x) => x.id === previewDocId);
    else if (previewType === 'mlg') target = mileage.find((x) => x.id === previewDocId);

    if (target) {
      setRecordModalType(previewType);
      setEditingRecord(target);
      setRecordModalOpen(true);
    }
  };

  const handleDeleteFromPreview = () => {
    if (!previewDocId || !previewType) return;
    setPreviewModalOpen(false);
    setDeleteTarget({
      id: previewDocId,
      type: previewType,
      title: 'Padam Rekod Ini?'
    });
    setDeleteModalOpen(true);
  };

  // Save Expense (Local Storage)
  const handleSaveExpense = (data: Partial<ExpenseRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: ExpenseRecord = {
          ...(expenses.find((x) => x.id === id) || {}),
          ...data,
          id
        } as ExpenseRecord;

        setExpenses((prev) => {
          const next = prev.map((item) => (item.id === id ? updatedItem : item));
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_expenses`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Kos harian dikemaskini.', 'success');
      } else {
        const newId = 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const newRecord: ExpenseRecord = {
          id: newId,
          vehicleId: data.vehicleId || activeVehicle?.id,
          category: data.category || 'Minyak',
          tripType: data.tripType || 'Pergi Kerja',
          amount: data.amount || 0,
          timestamp: data.timestamp || Date.now(),
          receiptImage: data.receiptImage || null,
          liters: data.liters,
          fuelBrand: data.fuelBrand,
          notes: data.notes
        };

        setExpenses((prev) => {
          const next = [newRecord, ...prev];
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_expenses`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Rekod kos harian disimpan.', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod.', 'error');
    }
  };

  // Save Service (Local Storage)
  const handleSaveService = (data: Partial<ServiceRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: ServiceRecord = {
          ...(services.find((x) => x.id === id) || {}),
          ...data,
          id
        } as ServiceRecord;

        setServices((prev) => {
          const next = prev.map((item) => (item.id === id ? updatedItem : item));
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_services`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Rekod servis dikemaskini.', 'success');
      } else {
        const newId = 'svc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const newRecord: ServiceRecord = {
          id: newId,
          vehicleId: data.vehicleId || activeVehicle?.id,
          vehicle: data.vehicle || activeVehicle?.plateNumber || 'Kereta',
          serviceDate: data.serviceDate || Date.now(),
          location: data.location || 'Pusat Servis',
          mileage: data.mileage || null,
          amount: data.amount || 0,
          notes: data.notes || '',
          receiptImage: data.receiptImage || null,
          timestamp: Date.now()
        };

        setServices((prev) => {
          const next = [newRecord, ...prev];
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_services`, JSON.stringify(next));
          }
          return next;
        });

        // If mileage was recorded, update vehicle's current odometer & target service
        if (data.mileage && activeVehicle) {
          const newOdo = data.mileage;
          const nextTarget = newOdo + 10000;
          setVehicles((prev) =>
            prev.map((v) =>
              v.id === (data.vehicleId || activeVehicle.id)
                ? { ...v, currentOdometer: newOdo, targetNextServiceKm: nextTarget }
                : v
            )
          );
        }

        addToast('Rekod servis berjaya disimpan!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod servis.', 'error');
    }
  };

  // Save Mileage (Local Storage)
  const handleSaveMileage = (data: Partial<MileageRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: MileageRecord = {
          ...(mileage.find((x) => x.id === id) || {}),
          ...data,
          id
        } as MileageRecord;

        setMileage((prev) => {
          const next = prev.map((item) => (item.id === id ? updatedItem : item));
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_mileage`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Tuntutan mileage dikemaskini.', 'success');
      } else {
        const newId = 'mlg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const newRecord: MileageRecord = {
          id: newId,
          vehicleId: data.vehicleId || activeVehicle?.id,
          date: data.date || Date.now(),
          location: data.location || 'Perjalanan Bertugas',
          reason: data.reason || 'Urusan Rasmi',
          km: data.km || 0,
          amount: data.amount || ((data.km || 0) * 0.70),
          receiptImage: data.receiptImage || null,
          timestamp: Date.now()
        };

        setMileage((prev) => {
          const next = [newRecord, ...prev];
          if (user) {
            const prefix = getStoragePrefix(user);
            localStorage.setItem(`${prefix}_mileage`, JSON.stringify(next));
          }
          return next;
        });

        addToast('Tuntutan mileage berjaya disimpan!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod mileage.', 'error');
    }
  };

  // Execute Permanent Delete (100% Local Storage - Gone forever with zero cloud fetch back)
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;

    try {
      if (type === 'exp') {
        const remaining = expenses.filter((x) => x.id !== id);
        setExpenses(remaining);
        if (user) {
          const prefix = getStoragePrefix(user);
          localStorage.setItem(`${prefix}_expenses`, JSON.stringify(remaining));
          if (prefix === 'autokira_iqmal') {
            localStorage.setItem('autokira_expenses', JSON.stringify(remaining));
          }
        }
        addToast('Rekod perbelanjaan berjaya dipadam secara kekal.', 'success');
      } else if (type === 'svc') {
        const remaining = services.filter((x) => x.id !== id);
        setServices(remaining);
        if (user) {
          const prefix = getStoragePrefix(user);
          localStorage.setItem(`${prefix}_services`, JSON.stringify(remaining));
          if (prefix === 'autokira_iqmal') {
            localStorage.setItem('autokira_services', JSON.stringify(remaining));
          }
        }
        addToast('Rekod servis berjaya dipadam secara kekal.', 'success');
      } else if (type === 'mlg') {
        const remaining = mileage.filter((x) => x.id !== id);
        setMileage(remaining);
        if (user) {
          const prefix = getStoragePrefix(user);
          localStorage.setItem(`${prefix}_mileage`, JSON.stringify(remaining));
          if (prefix === 'autokira_iqmal') {
            localStorage.setItem('autokira_mileage', JSON.stringify(remaining));
          }
        }
        addToast('Rekod tuntutan mileage berjaya dipadam secara kekal.', 'success');
      } else if (type === 'veh') {
        if (vehicles.length <= 1) {
          addToast('Sekurang-kurangnya 1 profil kenderaan mesti disimpan.', 'error');
          setDeleteModalOpen(false);
          return;
        }
        const remaining = vehicles.filter((v) => v.id !== id);
        setVehicles(remaining);
        if (activeVehicleId === id) {
          setActiveVehicleId(remaining[0].id);
        }
        if (user) {
          const prefix = getStoragePrefix(user);
          localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(remaining));
          if (prefix === 'autokira_iqmal') {
            localStorage.setItem('autokira_vehicles', JSON.stringify(remaining));
          }
        }
        addToast('Profil kenderaan berjaya dipadam secara kekal.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Ralat semasa memadam rekod.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      localStorage.removeItem('autokira_logged_out');
      const res = await loginWithGoogle();
      if (res && res.user) {
        const fbUser = res.user;
        const loggedInUser: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna AutoKira',
          email: fbUser.email || 'iqmalinsyad@gmail.com',
          photoURL: fbUser.photoURL || undefined
        };
        setUser(loggedInUser);
        localStorage.setItem('autokira_user', JSON.stringify(loggedInUser));
        loadUserDataForAccount(loggedInUser);
        addToast(`Selamat datang, ${loggedInUser.displayName}!`, 'success');
      }
    } catch (error: any) {
      console.warn("Google popup encounter:", error);
      addToast('Log masuk Google dibatalkan atau terhalang. Sila cuba lagi.', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    localStorage.removeItem('autokira_user');
    localStorage.setItem('autokira_logged_out', 'true');
    setUser(null);
    setVehicles([]);
    setExpenses([]);
    setServices([]);
    setMileage([]);
    addToast('Akaun telah dilog keluar.', 'info');
  };

  // If user is not signed in, show the dedicated Google Login Page
  if (!user) {
    return (
      <>
        <Toast toasts={toasts} onDismiss={removeToast} />
        <LoginPage onGoogleSignIn={handleGoogleSignIn} />
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#080a0f] text-slate-100 flex justify-center selection:bg-orange-500 selection:text-white">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Main Responsive Mobile-First Container */}
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl min-h-[100dvh] bg-[#0e1118] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:border-x border-white/5 overflow-x-hidden">
        
        {/* PWA Install Banner for Android / Mobile */}
        <PWAInstallBanner />

        {/* Top Header */}
        <Header
          vehicles={vehicles}
          activeVehicle={activeVehicle}
          onSelectVehicle={handleSelectVehicle}
          onOpenAddVehicle={handleOpenAddVehicle}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1 px-3.5 sm:px-5 pt-3 overflow-y-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              vehicle={activeVehicle}
              expenses={expenses}
              services={services}
              mileage={mileage}
              onOpenAddModal={(type) => handleOpenAddRecord(type)}
              onSelectRecord={(id, type) => handleOpenRecordPreview(id, type)}
              onChangeTab={setActiveTab}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onOpenAddModal={() => handleOpenAddRecord('exp')}
              onSelectRecord={(id) => handleOpenRecordPreview(id, 'exp')}
            />
          )}

          {activeTab === 'services' && (
            <ServicesView
              services={services}
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onOpenAddModal={() => handleOpenAddRecord('svc')}
              onSelectRecord={(id) => handleOpenRecordPreview(id, 'svc')}
            />
          )}

          {activeTab === 'mileage' && (
            <MileageView
              mileage={mileage}
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onOpenAddModal={() => handleOpenAddRecord('mlg')}
              onSelectRecord={(id) => handleOpenRecordPreview(id, 'mlg')}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehicleProfileView
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onSelectVehicle={handleSelectVehicle}
              onOpenAddVehicle={handleOpenAddVehicle}
              onOpenEditVehicle={handleOpenEditVehicle}
              onDeleteVehicle={handleDeleteVehiclePrompt}
              onUpdateVehicleImage={handleUpdateVehicleImage}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      {/* MODALS */}
      {/* Vehicle Add/Edit Modal */}
      <VehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
      />

      {/* Record Add/Edit Modal (Expenses, Services, Mileage) */}
      <RecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        type={recordModalType}
        onSaveExpense={handleSaveExpense}
        onSaveService={handleSaveService}
        onSaveMileage={handleSaveMileage}
        editingRecord={editingRecord}
        editingItem={editingRecord}
        onDelete={(id, type) => {
          setDeleteTarget({
            id,
            type,
            title: 'Padam Rekod Ini?'
          });
          setDeleteModalOpen(true);
        }}
        vehicles={vehicles}
        activeVehicle={activeVehicle}
      />

      {/* Record Preview Modal */}
      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        recordId={previewDocId}
        type={previewType}
        expenses={expenses}
        services={services}
        mileage={mileage}
        vehicles={vehicles}
        onOpenEdit={handleOpenEditFromPreview}
        onDelete={handleDeleteFromPreview}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || 'Padam Rekod?'}
      />

      {/* Auth / Account Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
