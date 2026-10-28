// Shared localStorage-backed store for the Seller & Tuner portals.
// This replaces the "TODO: fetch real data from API" mocks with a simple
// client-side persistence layer until the backend endpoints are wired in.

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface SellerProduct {
  id: number;
  name: string;
  sku: string;
  price: number; // cents
  stock: number;
  status: 'active' | 'draft' | 'inactive';
  category: string;
}

export interface SellerOrderLine {
  productName: string;
  qty: number;
  unitPrice: number; // cents
}

export interface SellerOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number; // cents
  status: OrderStatus;
  date: string;
  items: SellerOrderLine[];
}

export interface Appointment {
  id: number;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface TunerProject {
  id: number;
  vehicle: string;
  projectType: string;
  status: 'quote' | 'accepted' | 'work_in_progress' | 'quality_check' | 'completed';
  nextAppointment: string;
  budget: number; // cents
  progress: number; // 0-100
  customerName: string;
}

export interface TunerRequest {
  id: number;
  customerName: string;
  vehicle: string;
  service: string;
  budget: number; // cents
  city: string;
  date: string;
  message: string;
  status: 'new' | 'quoted' | 'accepted' | 'declined';
}

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode etc.) – keep working in memory only
  }
}

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value / 100);

// ---------- Seed data ----------

export const seedSellerProducts: SellerProduct[] = [
  { id: 1, name: 'Batterie Bosch S4 60Ah', sku: 'BAT-BOSCH-S4-60', price: 85000, stock: 15, status: 'active', category: 'Batteries' },
  { id: 2, name: 'Huile moteur Total 5W-30 5L', sku: 'OIL-TOTAL-5W30-5L', price: 32000, stock: 45, status: 'active', category: 'Huiles' },
  { id: 3, name: 'Filtre à huile Mann W712/75', sku: 'FIL-MANN-W712', price: 6500, stock: 3, status: 'active', category: 'Filtres' },
  { id: 4, name: 'Plaquettes de frein Brembo', sku: 'FRE-BREMBO-P85', price: 45000, stock: 0, status: 'active', category: 'Freins' },
  { id: 5, name: 'Kit distribution Gates', sku: 'DIS-GATES-K01', price: 125000, stock: 8, status: 'draft', category: 'Distribution' },
];

export const seedSellerOrders: SellerOrder[] = [
  {
    id: 1, orderNumber: 'CMD-2024-001', customerName: 'Amine Khalid', total: 35000, status: 'pending', date: '2024-03-15',
    items: [{ productName: 'Filtre à huile Mann W712/75', qty: 2, unitPrice: 6500 }, { productName: 'Huile moteur Total 5W-30 5L', qty: 1, unitPrice: 22000 }],
  },
  {
    id: 2, orderNumber: 'CMD-2024-002', customerName: 'Sara Mansouri', total: 48000, status: 'processing', date: '2024-03-14',
    items: [{ productName: 'Batterie Bosch S4 60Ah', qty: 1, unitPrice: 48000 }],
  },
  {
    id: 3, orderNumber: 'CMD-2024-003', customerName: 'Youssef Rachidi', total: 12500, status: 'shipped', date: '2024-03-13',
    items: [{ productName: 'Filtre à huile Mann W712/75', qty: 1, unitPrice: 6500 }, { productName: 'Filtre à air Bosch', qty: 1, unitPrice: 6000 }],
  },
  {
    id: 4, orderNumber: 'CMD-2024-004', customerName: 'Fatima Zahra', total: 67000, status: 'delivered', date: '2024-03-12',
    items: [{ productName: 'Kit distribution Gates', qty: 1, unitPrice: 67000 }],
  },
];

export const seedTunerAppointments: Appointment[] = [
  { id: 1, vehicle: 'Golf GTI 2019', service: 'Reprogrammation ECU', date: '2024-03-16', time: '10:00', customerName: 'Mohamed K.', status: 'confirmed' },
  { id: 2, vehicle: 'Clio RS 2018', service: 'Échappement sport', date: '2024-03-17', time: '14:30', customerName: 'Youssef B.', status: 'scheduled' },
  { id: 3, vehicle: 'Audi A4 2021', service: 'Diagnostic complet', date: '2024-03-18', time: '09:00', customerName: 'Karim L.', status: 'scheduled' },
];

export const seedTunerProjects: TunerProject[] = [
  { id: 1, vehicle: 'BMW M3 2020', projectType: 'Stage 2 Tuning', status: 'work_in_progress', nextAppointment: '2024-03-18 14:00', budget: 850000, progress: 60, customerName: 'Anas F.' },
  { id: 2, vehicle: 'Golf R 2021', projectType: 'Stage 1 + Admission', status: 'accepted', nextAppointment: '2024-03-20 09:30', budget: 450000, progress: 15, customerName: 'Sofia E.' },
  { id: 3, vehicle: 'Megane RS 2019', projectType: 'Ligne échappement', status: 'quality_check', nextAppointment: '2024-03-19 11:00', budget: 280000, progress: 90, customerName: 'Omar T.' },
  { id: 4, vehicle: 'Audi S3 2022', projectType: 'Stage 2 + Intercooler', status: 'completed', nextAppointment: '2024-03-10 10:00', budget: 950000, progress: 100, customerName: 'Leila B.' },
];

export const seedTunerRequests: TunerRequest[] = [
  { id: 1, customerName: 'Hamza A.', vehicle: 'Peugeot 308 GTi 2020', service: 'Stage 1', budget: 300000, city: 'Casablanca', date: '2024-03-15', message: 'Bonjour, je souhaite un Stage 1 avec gain de puissance équilibré pour un usage quotidien.', status: 'new' },
  { id: 2, customerName: 'Nadia R.', vehicle: 'Renault Clio RS 2017', service: 'Échappement + Stage 1', budget: 450000, city: 'Rabat', date: '2024-03-14', message: 'Intérêt pour une ligne inox et reprogrammation associée.', status: 'new' },
  { id: 3, customerName: 'Karim L.', vehicle: 'BMW 330i 2019', service: 'Diagnostic + Stage 1', budget: 350000, city: 'Marrakech', date: '2024-03-13', message: 'Voyant moteur allumé, diagnostic puis optimisation si possible.', status: 'quoted' },
  { id: 4, customerName: 'Mehdi S.', vehicle: 'Golf GTI Clubsport 2021', service: 'Stage 2', budget: 700000, city: 'Casablanca', date: '2024-03-12', message: 'Projet Stage 2 complet avec downpipe sport.', status: 'accepted' },
];
