export interface Vehicle {
  id: string;
  plateNumber: string;
  nickName: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  currentOdometer: number;
  targetNextServiceKm?: number;
  vehicleType?: 'car' | 'motorcycle';
  fuelType?: string;
  roadtaxExpiry?: string;
  insuranceCompany?: string;
  insuranceExpiry?: string;
  image?: string;
  images?: string[];
  isActive?: boolean;
  createdAt: number;
  // Live mock telemetry data for cool dashboard display
  telemetry?: {
    speedKmh: number;
    fuelLevelLtrs: number;
    batteryVoltage: number;
    engineStatus: 'ON' | 'OFF';
    healthStatus: 'Good' | 'Fair' | 'Service Due';
    locationName: string;
    lastUpdated: string;
  };
}

export type PetrolBrand = 'Petronas' | 'Shell' | 'BHPetrol' | 'Caltex' | 'Petron' | 'FIVE' | 'Buraq Oil' | string;

export interface ExpenseRecord {
  id: string;
  vehicleId?: string;
  category: 'Minyak' | 'Tol' | 'Parking';
  tripType: string;
  amount: number;
  liters?: number;
  fuelBrand?: PetrolBrand;
  timestamp: number;
  receiptImage?: string | null;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId?: string;
  vehicle: string;
  serviceDate: number;
  location: string;
  mileage: number | null;
  amount: number;
  receiptImage?: string | null;
  timestamp: number;
  notes?: string;
}

export interface MileageRecord {
  id: string;
  vehicleId?: string;
  date: number;
  location: string;
  reason: string;
  km: number;
  amount: number; // KM * RM0.70
  receiptImage?: string | null;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAnonymous?: boolean;
}

export type MainTabType = 'dashboard' | 'expenses' | 'services' | 'mileage' | 'vehicles';
