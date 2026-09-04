import React, { useState, useEffect, useRef } from 'react';
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

import { Vehicle, ExpenseRecord, ServiceRecord, MileageRecord, UserProfile, MainTabType } from './types';
import { INITIAL_VEHICLES } from './data/defaultVehicles';
import { 
  db, 
  auth, 
  loginWithGoogle, 
  logoutGoogle,
  checkRedirectResult
} from './lib/firebase';
import { 
  collection, 
  doc, 
  setDoc,
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

// Helper to check if user is the designated cloud sync administrator
export const isCloudSyncUser = (email?: string | null): boolean => {
  return (email || '').toLowerCase().trim() === 'iqmalinsyad@gmail.com';
};

// Global deleted IDs tracker to prevent deleted items from reappearing
const getDeletedIdsSet = (): Set<string> => {
  try {
    const raw = localStorage.getItem('autokira_deleted_ids');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const markIdAsDeleted = (id: string) => {
  try {
    const set = getDeletedIdsSet();
    set.add(id);
    localStorage.setItem('autokira_deleted_ids', JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Error saving deleted ID to localStorage:', e);
  }
};

// Default clean vehicle for other new users
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

  // User State - strictly respect logout state and require authentic sign in
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

  // Calculate storage key prefix for current user
  const isCloud = isCloudSyncUser(user?.email);
  const userKeyPrefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const isUserCloud = isCloudSyncUser(user?.email);
      const prefix = isUserCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;
      const saved = localStorage.getItem(`${prefix}_vehicles`) || localStorage.getItem('autokira_vehicles');
      if (saved) return JSON.parse(saved);
      return isUserCloud ? INITIAL_VEHICLES : [createDefaultUserVehicle(user?.displayName || 'Pengguna')];
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    try {
      const isUserCloud = isCloudSyncUser(user?.email);
      const prefix = isUserCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;
      const saved = localStorage.getItem(`${prefix}_active_vehicle_id`) || localStorage.getItem('autokira_active_vehicle_id');
      return saved || (INITIAL_VEHICLES[0]?.id ?? '');
    } catch {
      return INITIAL_VEHICLES[0]?.id ?? '';
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const isUserCloud = isCloudSyncUser(user?.email);
      const prefix = isUserCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;
      const saved = localStorage.getItem(`${prefix}_expenses`) || (isUserCloud ? localStorage.getItem('autokira_expenses') : null);
      if (!saved) return [];
      const deleted = getDeletedIdsSet();
      const list: ExpenseRecord[] = JSON.parse(saved);
      return list.filter(item => !deleted.has(item.id));
    } catch {
      return [];
    }
  });

  const [services, setServices] = useState<ServiceRecord[]>(() => {
    try {
      const isUserCloud = isCloudSyncUser(user?.email);
      const prefix = isUserCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;
      const saved = localStorage.getItem(`${prefix}_services`) || (isUserCloud ? localStorage.getItem('autokira_services') : null);
      if (!saved) return [];
      const deleted = getDeletedIdsSet();
      const list: ServiceRecord[] = JSON.parse(saved);
      return list.filter(item => !deleted.has(item.id));
    } catch {
      return [];
    }
  });

  const [mileage, setMileage] = useState<MileageRecord[]>(() => {
    try {
      const isUserCloud = isCloudSyncUser(user?.email);
      const prefix = isUserCloud ? 'autokira_iqmal' : `autokira_user_${user?.uid || 'guest'}`;
      const saved = localStorage.getItem(`${prefix}_mileage`) || (isUserCloud ? localStorage.getItem('autokira_mileage') : null);
      if (!saved) return [];
      const deleted = getDeletedIdsSet();
      const list: MileageRecord[] = JSON.parse(saved);
      return list.filter(item => !deleted.has(item.id));
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

  // Sync to User's Local Storage whenever state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('autokira_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autokira_user');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
    localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(vehicles));
    if (isCloud) localStorage.setItem('autokira_vehicles', JSON.stringify(vehicles));
  }, [vehicles, user, isCloud]);

  useEffect(() => {
    if (!user || !activeVehicleId) return;
    const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
    localStorage.setItem(`${prefix}_active_vehicle_id`, activeVehicleId);
    if (isCloud) localStorage.setItem('autokira_active_vehicle_id', activeVehicleId);
  }, [activeVehicleId, user, isCloud]);

  useEffect(() => {
    if (!user) return;
    const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
    localStorage.setItem(`${prefix}_expenses`, JSON.stringify(expenses));
    if (isCloud) localStorage.setItem('autokira_expenses', JSON.stringify(expenses));
  }, [expenses, user, isCloud]);

  useEffect(() => {
    if (!user) return;
    const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
    localStorage.setItem(`${prefix}_services`, JSON.stringify(services));
    if (isCloud) localStorage.setItem('autokira_services', JSON.stringify(services));
  }, [services, user, isCloud]);

  useEffect(() => {
    if (!user) return;
    const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
    localStorage.setItem(`${prefix}_mileage`, JSON.stringify(mileage));
    if (isCloud) localStorage.setItem('autokira_mileage', JSON.stringify(mileage));
  }, [mileage, user, isCloud]);

  // Load User-Specific Data when user account switches
  const loadUserDataForAccount = (targetUser: UserProfile) => {
    const isTargetCloud = isCloudSyncUser(targetUser.email);
    const prefix = isTargetCloud ? 'autokira_iqmal' : `autokira_user_${targetUser.uid}`;
    const deleted = getDeletedIdsSet();

    // Vehicles
    const rawVeh = localStorage.getItem(`${prefix}_vehicles`) || (isTargetCloud ? localStorage.getItem('autokira_vehicles') : null);
    let loadedVehicles: Vehicle[] = rawVeh ? JSON.parse(rawVeh) : (isTargetCloud ? INITIAL_VEHICLES : [createDefaultUserVehicle(targetUser.displayName || 'Pengguna')]);
    loadedVehicles = loadedVehicles.filter(v => !deleted.has(v.id));
    setVehicles(loadedVehicles);

    // Active Vehicle ID
    const rawActiveId = localStorage.getItem(`${prefix}_active_vehicle_id`) || (isTargetCloud ? localStorage.getItem('autokira_active_vehicle_id') : null);
    if (rawActiveId && loadedVehicles.some(v => v.id === rawActiveId)) {
      setActiveVehicleId(rawActiveId);
    } else if (loadedVehicles.length > 0) {
      setActiveVehicleId(loadedVehicles[0].id);
    }

    // Expenses
    const rawExp = localStorage.getItem(`${prefix}_expenses`) || (isTargetCloud ? localStorage.getItem('autokira_expenses') : null);
    if (rawExp) {
      const list: ExpenseRecord[] = JSON.parse(rawExp);
      setExpenses(list.filter(item => !deleted.has(item.id)));
    } else {
      setExpenses([]);
    }

    // Services
    const rawSvc = localStorage.getItem(`${prefix}_services`) || (isTargetCloud ? localStorage.getItem('autokira_services') : null);
    if (rawSvc) {
      const list: ServiceRecord[] = JSON.parse(rawSvc);
      setServices(list.filter(item => !deleted.has(item.id)));
    } else {
      setServices([]);
    }

    // Mileage
    const rawMlg = localStorage.getItem(`${prefix}_mileage`) || (isTargetCloud ? localStorage.getItem('autokira_mileage') : null);
    if (rawMlg) {
      const list: MileageRecord[] = JSON.parse(rawMlg);
      setMileage(list.filter(item => !deleted.has(item.id)));
    } else {
      setMileage([]);
    }
  };

  // Firebase Realtime Subscriptions (ONLY ACTIVE FOR iqmalinsyad@gmail.com)
  useEffect(() => {
    if (!user || !isCloudSyncUser(user.email)) {
      return; // Do NOT subscribe for local storage users!
    }

    try {
      // Subscribe to Expenses
      const unsubExp = onSnapshot(collection(db, 'autokira_expenses'), (snapshot) => {
        const freshDeleted = getDeletedIdsSet();
        const list: ExpenseRecord[] = [];
        snapshot.forEach((docSnap) => {
          if (!freshDeleted.has(docSnap.id)) {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          }
        });
        list.sort((a, b) => b.timestamp - a.timestamp);
        setExpenses(list);
      }, (err) => console.log('Expenses snapshot sync:', err.message));

      // Subscribe to Services
      const unsubSvc = onSnapshot(collection(db, 'autokira_services'), (snapshot) => {
        const freshDeleted = getDeletedIdsSet();
        const list: ServiceRecord[] = [];
        snapshot.forEach((docSnap) => {
          if (!freshDeleted.has(docSnap.id)) {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          }
        });
        list.sort((a, b) => (b.serviceDate || b.timestamp) - (a.serviceDate || a.timestamp));
        setServices(list);
      }, (err) => console.log('Services snapshot sync:', err.message));

      // Subscribe to Mileage
      const unsubMlg = onSnapshot(collection(db, 'autokira_mileage'), (snapshot) => {
        const freshDeleted = getDeletedIdsSet();
        const list: MileageRecord[] = [];
        snapshot.forEach((docSnap) => {
          if (!freshDeleted.has(docSnap.id)) {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          }
        });
        list.sort((a, b) => (b.date || b.timestamp) - (a.date || a.timestamp));
        setMileage(list);
      }, (err) => console.log('Mileage snapshot sync:', err.message));

      // Subscribe to Vehicles
      const unsubVeh = onSnapshot(collection(db, 'autokira_vehicles'), (snapshot) => {
        const freshDeleted = getDeletedIdsSet();
        const list: Vehicle[] = [];
        snapshot.forEach((docSnap) => {
          if (!freshDeleted.has(docSnap.id)) {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          }
        });
        if (list.length > 0) {
          setVehicles(list);
        }
      }, (err) => console.log('Vehicles snapshot sync:', err.message));

      return () => {
        unsubExp();
        unsubSvc();
        unsubMlg();
        unsubVeh();
      };
    } catch (e) {
      console.warn('Firebase cloud sync setup error:', e);
    }
  }, [user?.email]);

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

  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (editingVehicle) {
        const updatedVehicle: Vehicle = {
          ...editingVehicle,
          ...vehicleData
        } as Vehicle;

        setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)));

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_vehicles', editingVehicle.id), updatedVehicle, { merge: true });
          } catch (e) {
            console.warn('Cloud sync error for vehicle update:', e);
          }
        }

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

        setVehicles((prev) => [...prev, newVehicle]);
        setActiveVehicleId(newVehicle.id);

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_vehicles', newId), newVehicle);
          } catch (e) {
            console.warn('Cloud sync error for vehicle insert:', e);
          }
        }

        addToast(`Profil kenderaan ${newVehicle.plateNumber} berjaya ditambah!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Ralat semasa menyimpan profil kenderaan.', 'error');
    }
  };

  const handleUpdateVehicleImage = async (vehId: string, imageBase64: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehId ? { ...v, image: imageBase64 } : v))
    );
    if (isCloud) {
      try {
        await setDoc(doc(db, 'autokira_vehicles', vehId), { image: imageBase64 }, { merge: true });
      } catch (e) {
        console.warn('Cloud image sync error:', e);
      }
    }
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

  // Save Expense
  const handleSaveExpense = async (data: Partial<ExpenseRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: ExpenseRecord = {
          ...(expenses.find((x) => x.id === id) || {}),
          ...data,
          id
        } as ExpenseRecord;

        setExpenses((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_expenses', id), updatedItem, { merge: true });
          } catch (e) {
            console.warn('Cloud sync error for expense update:', e);
          }
        }
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

        setExpenses((prev) => [newRecord, ...prev]);

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_expenses', newId), newRecord);
          } catch (e) {
            console.warn('Cloud sync error for expense insert:', e);
          }
        }
        addToast('Rekod kos harian disimpan.', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod.', 'error');
    }
  };

  // Save Service
  const handleSaveService = async (data: Partial<ServiceRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: ServiceRecord = {
          ...(services.find((x) => x.id === id) || {}),
          ...data,
          id
        } as ServiceRecord;

        setServices((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_services', id), updatedItem, { merge: true });
          } catch (e) {
            console.warn('Cloud sync error for service update:', e);
          }
        }
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

        setServices((prev) => [newRecord, ...prev]);

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

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_services', newId), newRecord);
          } catch (e) {
            console.warn('Cloud sync error for service insert:', e);
          }
        }
        addToast('Rekod servis berjaya disimpan!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod servis.', 'error');
    }
  };

  // Save Mileage
  const handleSaveMileage = async (data: Partial<MileageRecord>, id?: string) => {
    try {
      if (id) {
        const updatedItem: MileageRecord = {
          ...(mileage.find((x) => x.id === id) || {}),
          ...data,
          id
        } as MileageRecord;

        setMileage((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_mileage', id), updatedItem, { merge: true });
          } catch (e) {
            console.warn('Cloud sync error for mileage update:', e);
          }
        }
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

        setMileage((prev) => [newRecord, ...prev]);

        if (isCloud) {
          try {
            await setDoc(doc(db, 'autokira_mileage', newId), newRecord);
          } catch (e) {
            console.warn('Cloud sync error for mileage insert:', e);
          }
        }
        addToast('Tuntutan mileage berjaya disimpan!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod mileage.', 'error');
    }
  };

  // Execute Permanent Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;

    try {
      // 1. Mark as deleted in global blacklist immediately
      markIdAsDeleted(id);

      if (type === 'exp') {
        const remaining = expenses.filter((x) => x.id !== id);
        setExpenses(remaining);
        if (user) {
          const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
          localStorage.setItem(`${prefix}_expenses`, JSON.stringify(remaining));
          if (isCloud) localStorage.setItem('autokira_expenses', JSON.stringify(remaining));
        }
        if (isCloud) {
          try {
            await deleteDoc(doc(db, 'autokira_expenses', id));
          } catch (e) {
            console.warn('Firebase deleteDoc error:', e);
          }
        }
        addToast('Rekod perbelanjaan berjaya dipadam secara kekal.', 'success');
      } else if (type === 'svc') {
        const remaining = services.filter((x) => x.id !== id);
        setServices(remaining);
        if (user) {
          const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
          localStorage.setItem(`${prefix}_services`, JSON.stringify(remaining));
          if (isCloud) localStorage.setItem('autokira_services', JSON.stringify(remaining));
        }
        if (isCloud) {
          try {
            await deleteDoc(doc(db, 'autokira_services', id));
          } catch (e) {
            console.warn('Firebase deleteDoc error:', e);
          }
        }
        addToast('Rekod servis berjaya dipadam secara kekal.', 'success');
      } else if (type === 'mlg') {
        const remaining = mileage.filter((x) => x.id !== id);
        setMileage(remaining);
        if (user) {
          const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
          localStorage.setItem(`${prefix}_mileage`, JSON.stringify(remaining));
          if (isCloud) localStorage.setItem('autokira_mileage', JSON.stringify(remaining));
        }
        if (isCloud) {
          try {
            await deleteDoc(doc(db, 'autokira_mileage', id));
          } catch (e) {
            console.warn('Firebase deleteDoc error:', e);
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
          const prefix = isCloud ? 'autokira_iqmal' : `autokira_user_${user.uid}`;
          localStorage.setItem(`${prefix}_vehicles`, JSON.stringify(remaining));
          if (isCloud) localStorage.setItem('autokira_vehicles', JSON.stringify(remaining));
        }
        if (isCloud) {
          try {
            await deleteDoc(doc(db, 'autokira_vehicles', id));
          } catch (e) {
            console.warn('Firebase deleteDoc error:', e);
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

  // Google Sign In & Account Switching
  const handleGoogleSignIn = async (customEmail?: string) => {
    try {
      localStorage.removeItem('autokira_logged_out');

      if (customEmail) {
        const cleanEmail = customEmail.trim().toLowerCase();
        const isTargetIqmal = isCloudSyncUser(cleanEmail);
        const loggedUser: UserProfile = {
          uid: isTargetIqmal ? 'user_iqmal_insyad' : `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          displayName: isTargetIqmal ? 'Iqmal Insyad' : cleanEmail.split('@')[0],
          email: cleanEmail,
          photoURL: isTargetIqmal ? 'https://lh3.googleusercontent.com/a/ACg8ocIS0e4v6vX4' : undefined
        };
        setUser(loggedUser);
        localStorage.setItem('autokira_user', JSON.stringify(loggedUser));
        loadUserDataForAccount(loggedUser);
        addToast(`Berjaya log masuk: ${loggedUser.displayName} (${isTargetIqmal ? 'Firebase Cloud' : 'Storan Tempatan'})`, 'success');
        return;
      }

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
      // If error occurred (popup blocked or dismissed), show message and do NOT auto login
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
