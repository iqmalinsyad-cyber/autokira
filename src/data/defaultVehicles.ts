import { Vehicle } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-toyota-camry-01',
    plateNumber: 'ABC 834 ZA',
    nickName: 'Daily Camry',
    brand: 'Toyota',
    model: 'Camry 2.5V',
    year: 2018,
    vin: '2T1BU40E49C179680',
    currentOdometer: 64520,
    targetNextServiceKm: 65000,
    fuelType: 'Petrol (RON 95/97)',
    roadtaxExpiry: '2026-11-20',
    insuranceCompany: 'Etiqa Takaful Auto360',
    insuranceExpiry: '2026-11-20',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590362891988-333333333333?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    createdAt: Date.now() - 30 * 86400000,
    telemetry: {
      speedKmh: 80.75,
      fuelLevelLtrs: 31.45,
      batteryVoltage: 12.0,
      engineStatus: 'ON',
      healthStatus: 'Good',
      locationName: 'Bandar Baru Bangi, Selangor / Lebuhraya PLUS',
      lastUpdated: 'Baru sahaja'
    }
  },
  {
    id: 'veh-mercedes-c200-02',
    plateNumber: 'ABC 123 YZ',
    nickName: 'Jakeoo',
    brand: 'Mercedes-Benz',
    model: 'C-Class C200 AMG Line',
    year: 2014,
    vin: 'WDD2040482F198321',
    currentOdometer: 89400,
    targetNextServiceKm: 90000,
    fuelType: 'Petrol (RON 97)',
    roadtaxExpiry: '2026-12-15',
    insuranceCompany: 'Allianz General Auto Shield',
    insuranceExpiry: '2026-12-15',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: false,
    createdAt: Date.now() - 60 * 86400000,
    telemetry: {
      speedKmh: 0.0,
      fuelLevelLtrs: 45.20,
      batteryVoltage: 12.4,
      engineStatus: 'OFF',
      healthStatus: 'Good',
      locationName: 'Kuala Lumpur City Centre (KLCC)',
      lastUpdated: '12 jam lalu'
    }
  },
  {
    id: 'veh-perodua-myvi-03',
    plateNumber: 'VDJ 1234',
    nickName: 'King Myvi',
    brand: 'Perodua',
    model: 'Myvi 1.5 AV (Auto)',
    year: 2022,
    vin: 'PM2M802SA00184912',
    currentOdometer: 38200,
    targetNextServiceKm: 40000,
    fuelType: 'Petrol (RON 95)',
    roadtaxExpiry: '2027-03-01',
    insuranceCompany: 'Takaful Ikhlas Kembara',
    insuranceExpiry: '2027-03-01',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: false,
    createdAt: Date.now() - 90 * 86400000,
    telemetry: {
      speedKmh: 45.0,
      fuelLevelLtrs: 28.0,
      batteryVoltage: 12.2,
      engineStatus: 'ON',
      healthStatus: 'Good',
      locationName: 'Shah Alam Seksyen 7, Selangor',
      lastUpdated: '3 jam lalu'
    }
  }
];
