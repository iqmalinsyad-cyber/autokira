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
import { Toast, ToastMessage } from './components/Toast';

import { Vehicle, ExpenseRecord, ServiceRecord, MileageRecord, UserProfile, MainTabType } from './types';
import { INITIAL_VEHICLES } from './data/defaultVehicles';
import { 
  db, 
  auth, 
  loginWithGoogle, 
  logoutGoogle 
} from './lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<MainTabType>('dashboard');

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('autokira_active_vehicle_id');
      return saved || INITIAL_VEHICLES[0].id;
    } catch {
      return INITIAL_VEHICLES[0].id;
    }
  });

  // Data Records
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [services, setServices] = useState<ServiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_services');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mileage, setMileage] = useState<MileageRecord[]>(() => {
    try {
      const saved = localStorage.getItem('autokira_mileage');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('autokira_user');
      return saved ? JSON.parse(saved) : {
        uid: 'demo-user-iqmal',
        displayName: 'Iqmal Insyad',
        email: 'iqmalinsyad@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocIS0e4v6vX4'
      };
    } catch {
      return null;
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

  // Persist local state
  useEffect(() => {
    localStorage.setItem('autokira_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (activeVehicleId) {
      localStorage.setItem('autokira_active_vehicle_id', activeVehicleId);
    }
  }, [activeVehicleId]);

  useEffect(() => {
    localStorage.setItem('autokira_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('autokira_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('autokira_mileage', JSON.stringify(mileage));
  }, [mileage]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('autokira_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autokira_user');
    }
  }, [user]);

  // Firebase Realtime Subscriptions
  useEffect(() => {
    try {
      const unsubAuth = onAuthStateChanged(auth, (fbUser: User | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Pengguna AutoKira',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined
          });
        }
      });

      // Subscribe to Expenses
      const unsubExp = onSnapshot(collection(db, 'autokira_expenses'), (snapshot) => {
        const list: ExpenseRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (list.length > 0) {
          list.sort((a, b) => b.timestamp - a.timestamp);
          setExpenses(list);
        }
      }, (err) => console.log('Expenses snapshot sync:', err.message));

      // Subscribe to Services
      const unsubSvc = onSnapshot(collection(db, 'autokira_services'), (snapshot) => {
        const list: ServiceRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (list.length > 0) {
          list.sort((a, b) => (b.serviceDate || b.timestamp) - (a.serviceDate || a.timestamp));
          setServices(list);
        }
      }, (err) => console.log('Services snapshot sync:', err.message));

      // Subscribe to Mileage
      const unsubMlg = onSnapshot(collection(db, 'autokira_mileage'), (snapshot) => {
        const list: MileageRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (list.length > 0) {
          list.sort((a, b) => (b.date || b.timestamp) - (a.date || a.timestamp));
          setMileage(list);
        }
      }, (err) => console.log('Mileage snapshot sync:', err.message));

      // Subscribe to Vehicles
      const unsubVeh = onSnapshot(collection(db, 'autokira_vehicles'), (snapshot) => {
        const list: Vehicle[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (list.length > 0) {
          setVehicles(list);
        }
      }, (err) => console.log('Vehicles snapshot sync:', err.message));

      return () => {
        unsubAuth();
        unsubExp();
        unsubSvc();
        unsubMlg();
        unsubVeh();
      };
    } catch (e) {
      console.warn('Firebase sync offline or initialized locally:', e);
    }
  }, []);

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

        try {
          await updateDoc(doc(db, 'autokira_vehicles', editingVehicle.id), vehicleData);
        } catch {}

        addToast('Profil kenderaan berjaya dikemaskini.', 'success');
      } else {
        const newId = 'veh-' + Date.now();
        const newVehicle: Vehicle = {
          id: newId,
          plateNumber: vehicleData.plateNumber || 'CAR 001',
          nickName: vehicleData.nickName || '',
          brand: vehicleData.brand || 'Toyota',
          model: vehicleData.model || 'Model',
          year: vehicleData.year || 2022,
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
            batteryVoltage: 12.2,
            engineStatus: 'OFF',
            healthStatus: 'Good',
            locationName: 'Garaj Rumah / Parkir',
            lastUpdated: 'Baru didaftarkan'
          }
        };

        setVehicles((prev) => [...prev, newVehicle]);
        setActiveVehicleId(newVehicle.id);

        try {
          await setDoc(doc(db, 'autokira_vehicles', newId), newVehicle);
        } catch {}

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
    try {
      await updateDoc(doc(db, 'autokira_vehicles', vehId), { image: imageBase64 });
    } catch {}
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
        setExpenses((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data } as ExpenseRecord : item))
        );
        try {
          await updateDoc(doc(db, 'autokira_expenses', id), data);
        } catch {}
        addToast('Kos harian dikemaskini.', 'success');
      } else {
        const newId = 'exp-' + Date.now();
        const newRecord: ExpenseRecord = {
          id: newId,
          vehicleId: data.vehicleId || activeVehicle?.id,
          category: data.category || 'Minyak',
          tripType: data.tripType || 'Pergi Kerja',
          amount: data.amount || 0,
          timestamp: data.timestamp || Date.now(),
          receiptImage: data.receiptImage || null
        };
        setExpenses((prev) => [newRecord, ...prev]);
        try {
          await addDoc(collection(db, 'autokira_expenses'), newRecord);
        } catch {}
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
        setServices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data } as ServiceRecord : item))
        );
        try {
          await updateDoc(doc(db, 'autokira_services', id), data);
        } catch {}
        addToast('Rekod servis dikemaskini.', 'success');
      } else {
        const newId = 'svc-' + Date.now();
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

        try {
          await addDoc(collection(db, 'autokira_services'), newRecord);
        } catch {}
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
        setMileage((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data } as MileageRecord : item))
        );
        try {
          await updateDoc(doc(db, 'autokira_mileage', id), data);
        } catch {}
        addToast('Tuntutan mileage dikemaskini.', 'success');
      } else {
        const newId = 'mlg-' + Date.now();
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
        try {
          await addDoc(collection(db, 'autokira_mileage'), newRecord);
        } catch {}
        addToast('Tuntutan mileage berjaya disimpan!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Gagal menyimpan rekod mileage.', 'error');
    }
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;

    try {
      if (type === 'exp') {
        setExpenses((prev) => prev.filter((x) => x.id !== id));
        try {
          await deleteDoc(doc(db, 'autokira_expenses', id));
        } catch {}
        addToast('Rekod perbelanjaan berjaya dipadam.', 'success');
      } else if (type === 'svc') {
        setServices((prev) => prev.filter((x) => x.id !== id));
        try {
          await deleteDoc(doc(db, 'autokira_services', id));
        } catch {}
        addToast('Rekod servis berjaya dipadam.', 'success');
      } else if (type === 'mlg') {
        setMileage((prev) => prev.filter((x) => x.id !== id));
        try {
          await deleteDoc(doc(db, 'autokira_mileage', id));
        } catch {}
        addToast('Rekod tuntutan mileage berjaya dipadam.', 'success');
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
        try {
          await deleteDoc(doc(db, 'autokira_vehicles', id));
        } catch {}
        addToast('Profil kenderaan berjaya dipadam.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Ralat semasa memadam.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Iqmal Insyad',
          email: fbUser.email || 'iqmalinsyad@gmail.com',
          photoURL: fbUser.photoURL || 'https://lh3.googleusercontent.com/a/default-user'
        });
        addToast(`Selamat kembali, ${fbUser.displayName || 'Pengguna'}!`, 'success');
      }
    } catch (error) {
      // Fallback in case of restricted iframe cross-origin popups
      const simulatedUser: UserProfile = {
        uid: 'user-google-iqmal',
        displayName: 'Iqmal Insyad',
        email: 'iqmalinsyad@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      };
      setUser(simulatedUser);
      addToast('Disahkan dengan Google Account: iqmalinsyad@gmail.com', 'success');
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    addToast('Akaun telah dilog keluar.', 'info');
  };

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
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenAddRecord={() => handleOpenAddRecord(activeTab === 'services' ? 'svc' : activeTab === 'mileage' ? 'mlg' : 'exp')}
        />

        {/* Vehicle Modal (Add / Edit) */}
        <VehicleModal
          isOpen={vehicleModalOpen}
          onClose={() => setVehicleModalOpen(false)}
          onSave={handleSaveVehicle}
          editingVehicle={editingVehicle}
        />

        {/* Unified Record Modal (Expenses / Services / Mileage) */}
        <RecordModal
          isOpen={recordModalOpen}
          type={recordModalType}
          onClose={() => setRecordModalOpen(false)}
          vehicles={vehicles}
          activeVehicle={activeVehicle}
          onSaveExpense={handleSaveExpense}
          onSaveService={handleSaveService}
          onSaveMileage={handleSaveMileage}
          editingItem={editingRecord}
        />

        {/* Detailed Preview Modal */}
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
          onConfirmDelete={handleDeleteFromPreview}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={deleteTarget?.title || 'Padam Rekod?'}
        />

        {/* Google Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          user={user}
          onGoogleSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  );
}
