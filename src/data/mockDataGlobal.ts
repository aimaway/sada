/**
 * Mock Data Global pour simulation pré-production
 * Simule les données qui seraient stockées dans le backend
 */

// ============ CLIENT MOCK DATA ============

export const mockClientData = {
  // Historique des commandes
  orders: [
    {
      id: 'ORD-001',
      date: '2024-03-15',
      provider: 'Ahmed Benali',
      providerType: 'mechanic',
      service: 'Vidange complète',
      vehicle: 'Dacia Logan 2019',
      price: 350,
      status: 'completed',
      rating: 5,
    },
    {
      id: 'ORD-002',
      date: '2024-03-10',
      provider: 'Karim Tazi',
      providerType: 'mechanic',
      service: 'Remplacement freins',
      vehicle: 'Dacia Logan 2019',
      price: 480,
      status: 'completed',
      rating: 4,
    },
    {
      id: 'ORD-003',
      date: '2024-02-28',
      provider: 'AutoPièces Maroc',
      providerType: 'seller',
      service: 'Achat batterie Bosch',
      vehicle: 'Peugeot 208 2021',
      price: 850,
      status: 'delivered',
      rating: 5,
    },
  ],

  // Documents
  documents: [
    {
      id: 'DOC-001',
      type: 'assurance',
      title: 'Assurance Auto',
      number: 'AXA-2024-789',
      expiryDate: '2025-03-01',
      status: 'valid',
      fileUrl: '/mock/docs/assurance.pdf',
    },
    {
      id: 'DOC-002',
      type: 'controle_technique',
      title: 'Contrôle Technique',
      number: 'CT-2024-4521',
      expiryDate: '2025-04-10',
      status: 'expiring_soon',
      fileUrl: '/mock/docs/ct.pdf',
    },
    {
      id: 'DOC-003',
      type: 'permis',
      title: 'Permis de Conduire',
      number: '19CA00123',
      expiryDate: '2029-06-15',
      status: 'valid',
      fileUrl: '/mock/docs/permis.pdf',
    },
  ],

  // Véhicules
  vehicles: [
    {
      id: 'VEH-001',
      make: 'Dacia',
      model: 'Logan',
      year: 2019,
      plate: '12345-A-1',
      mileage: 85000,
      lastService: '2024-03-15',
    },
    {
      id: 'VEH-002',
      make: 'Peugeot',
      model: '208',
      year: 2021,
      plate: '67890-B-2',
      mileage: 45000,
      lastService: '2024-02-20',
    },
  ],

  // Adresses sauvegardées
  addresses: [
    {
      id: 'ADDR-001',
      label: 'Maison',
      address: 'Bd Zerktouni, Casablanca',
      lat: 33.5731,
      lng: -7.5898,
      isDefault: true,
    },
    {
      id: 'ADDR-002',
      label: 'Bureau',
      address: 'Ain Diab, Casablanca',
      lat: 33.5900,
      lng: -7.6700,
      isDefault: false,
    },
  ],

  // Portefeuille
  wallet: {
    balance: 25000, // 250 MAD en centimes
    transactions: [
      {
        id: 'TXN-001',
        date: '2024-03-15',
        type: 'credit',
        amount: 50000,
        description: 'Rechargement Orange Money',
        status: 'completed',
      },
      {
        id: 'TXN-002',
        date: '2024-03-14',
        type: 'debit',
        amount: 15000,
        description: 'Paiement réparation - Ahmed B.',
        status: 'completed',
      },
    ],
  },

  // Plan actuel
  currentPlan: {
    id: 'PLAN-001',
    slug: 'client-gold',
    name: 'Gold',
    price: 199,
    features: [
      '1 vidange offerte/mois',
      '15% réduction sur tous les services',
      'Mécanicien dédié',
      '3x points fidélité',
    ],
    expiresAt: '2024-12-31',
  },

  // Points de fidélité
  loyaltyPoints: 1250,

  // Promotions disponibles
  promotions: [
    {
      id: 'PROMO-001',
      title: '🎁 -20% sur votre prochaine vidange',
      code: 'VIDANGE20',
      expiresAt: '2024-03-31',
    },
    {
      id: 'PROMO-002',
      title: '🔧 Diagnostic gratuit',
      code: 'DIAGFREE',
      expiresAt: '2024-04-15',
    },
  ],

  // Favoris
  favorites: {
    mechanics: ['u_m_expert', 'u_m3'],
    sellers: ['u_s_premium'],
    tuners: ['u_t1'],
  },
};

// ============ BOUTIQUE MOCK DATA ============

export const mockShopProducts = [
  {
    id: 'PROD-001',
    name: 'Huile Total 5W-30 5L',
    category: 'Huiles',
    brand: 'Total',
    price: 280,
    stock: 45,
    seller: 'AutoPièces Maroc',
    sellerId: 'u_s_premium',
    rating: 4.8,
    reviews: 124,
    image: '🛢️',
    compatible: ['Dacia Logan', 'Peugeot 208', 'Renault Clio'],
    description: 'Huile synthétique haute performance 5L',
  },
  {
    id: 'PROD-002',
    name: 'Batterie Bosch 60Ah',
    category: 'Batteries',
    brand: 'Bosch',
    price: 850,
    stock: 12,
    seller: 'AutoPièces Maroc',
    sellerId: 'u_s_premium',
    rating: 4.9,
    reviews: 89,
    image: '🔋',
    compatible: ['Dacia Logan', 'Peugeot 208'],
    description: 'Batterie sans entretien garantie 2 ans',
  },
  {
    id: 'PROD-003',
    name: 'Filtre à huile Mann',
    category: 'Filtres',
    brand: 'Mann',
    price: 65,
    stock: 100,
    seller: 'AutoPièces Maroc',
    sellerId: 'u_s_premium',
    rating: 4.7,
    reviews: 156,
    image: '🔧',
    compatible: ['Toutes marques'],
    description: 'Filtre à huile universel haute qualité',
  },
  {
    id: 'PROD-004',
    name: 'Plaquettes frein Brembo',
    category: 'Freins',
    brand: 'Brembo',
    price: 320,
    stock: 20,
    seller: 'AutoPièces Maroc',
    sellerId: 'u_s_premium',
    rating: 4.8,
    reviews: 67,
    image: '🛑',
    compatible: ['Dacia Logan', 'Renault Clio'],
    description: 'Plaquettes céramique haute performance',
  },
  {
    id: 'PROD-005',
    name: 'Pneu Michelin 185/65 R15',
    category: 'Pneus',
    brand: 'Michelin',
    price: 680,
    stock: 16,
    seller: 'PneusExpress',
    sellerId: 'u_s2',
    rating: 4.9,
    reviews: 203,
    image: '🛞',
    compatible: ['Dacia Logan', 'Peugeot 208'],
    description: 'Pneu toutes saisons longue durée',
  },
];

// ============ MÉCANICIEN MOCK DATA ============

export const mockMechanicData = {
  // Services proposés
  services: [
    { id: 'batt', name: 'Batterie', enabled: true, unlockedByPlan: false },
    { id: 'tire', name: 'Pneu', enabled: true, unlockedByPlan: false },
    { id: 'brakes', name: 'Freins', enabled: true, unlockedByPlan: false },
    { id: 'oil', name: 'Vidange', enabled: true, unlockedByPlan: false },
    { id: 'diag', name: 'Diagnostic', enabled: true, unlockedByPlan: false },
    { id: 'clim', name: 'Climatisation', enabled: false, unlockedByPlan: true },
    { id: 'tuning', name: 'Tuning', enabled: false, unlockedByPlan: true },
    { id: 'sos', name: 'SOS Mécanique', enabled: false, unlockedByPlan: true },
  ],

  // Plan actuel
  currentPlan: {
    id: 'PLAN-MEC-001',
    slug: 'mechanic-pro',
    name: 'Pro',
    price: 149,
    features: [
      'Commission réduite à 8%',
      'Badge "Pro" vérifié',
      'Visibilité accrue',
      'Support prioritaire',
      'Statistiques avancées',
    ],
    expiresAt: '2024-12-31',
  },

  // Wallet
  wallet: {
    balance: 85000, // 850 MAD
    minBalance: 5000, // 50 MAD
    transactions: [
      {
        id: 'TXN-MEC-001',
        date: '2024-03-15',
        type: 'credit',
        amount: 50000,
        description: 'Rechargement carte bancaire',
        status: 'completed',
      },
      {
        id: 'TXN-MEC-002',
        date: '2024-03-14',
        type: 'debit',
        amount: 2500,
        description: 'Commission job #J-150',
        status: 'completed',
      },
    ],
  },

  // Partenariats
  partnerships: [
    {
      id: 'PART-001',
      partner: 'AutoPièces Maroc',
      partnerType: 'seller',
      status: 'active',
      since: '2024-01-15',
      commission: 5,
    },
  ],

  // Statistiques
  stats: {
    totalJobs: 3000,
    totalEarned: 5850000, // 58,500 MAD
    totalCommission: 585000, // 5,850 MAD
    acceptanceRate: 80.8,
    averageRating: 4.9,
    responseTime: 2,
  },
};

// ============ TUNER MOCK DATA ============

export const mockTunerData = {
  // Profil
  profile: {
    id: 'TUN-001',
    name: 'Speed Tuning Casa',
    slug: 'speed-tuning-casa',
    description: 'Spécialiste du tuning automobile à Casablanca. Stage 1 à Stage 3, préparations moteur, échappements sport.',
    logo: '🏎️',
    rating: 4.9,
    totalReviews: 89,
    totalJobs: 1500,
    yearsExperience: 12,
    verified: true,
    certifications: ['Stage 1 Certified', 'Stage 2 Specialist', 'ECU Remapping Expert'],
  },

  // Stages proposés
  stages: [
    {
      level: 1,
      name: 'Stage 1',
      description: 'Optimisation de base - Gain de puissance 10-15%',
      features: ['Reprogrammation ECU', 'Filtre à air sport', 'Échappement sport'],
      priceRange: '2000-4000 MAD',
      popular: true,
    },
    {
      level: 2,
      name: 'Stage 2',
      description: 'Préparation intermédiaire - Gain de puissance 20-30%',
      features: ['Tout Stage 1', 'Downpipe sport', 'Intercooler upgrade'],
      priceRange: '5000-8000 MAD',
      popular: false,
    },
    {
      level: 3,
      name: 'Stage 3',
      description: 'Préparation avancée - Gain de puissance 40-60%',
      features: ['Tout Stage 2', 'Turbo upgrade', 'Fuel pump haute performance'],
      priceRange: '10000-20000 MAD',
      popular: false,
    },
  ],

  // Galerie
  gallery: [
    {
      id: 'GAL-001',
      type: 'before',
      vehicle: 'Golf GTI 2019',
      stage: 'Stage 2',
      label: 'Avant préparation',
      imageUrl: '/mock/gallery/golf_before.jpg',
    },
    {
      id: 'GAL-002',
      type: 'after',
      vehicle: 'Golf GTI 2019',
      stage: 'Stage 2',
      label: 'Après Stage 2 (+35% puissance)',
      imageUrl: '/mock/gallery/golf_after.jpg',
    },
  ],

  // Vidéos
  videos: [
    {
      id: 'VID-001',
      title: 'Préparation Golf GTI Stage 2',
      url: 'https://youtube.com/watch?v=example1',
      thumbnail: '/mock/videos/golf_thumb.jpg',
    },
  ],

  // Historique des commandes
  orders: [
    {
      id: 'TUN-ORD-001',
      date: '2024-03-10',
      client: 'Mohamed K.',
      vehicle: 'Golf GTI 2019',
      stage: 'Stage 2',
      price: 7500,
      status: 'completed',
      rating: 5,
    },
    {
      id: 'TUN-ORD-002',
      date: '2024-03-05',
      client: 'Youssef B.',
      vehicle: 'Clio RS 2018',
      stage: 'Stage 1',
      price: 3500,
      status: 'completed',
      rating: 5,
    },
  ],

  // Plan actuel
  currentPlan: {
    id: 'PLAN-TUN-001',
    slug: 'tuner-premium',
    name: 'Premium',
    price: 299,
    features: [
      'Commission réduite à 5%',
      'Badge "Premium" vérifié',
      'Top visibilité',
      'Support VIP 24/7',
      'Formation continue',
      'Outils marketing',
    ],
    expiresAt: '2024-12-31',
  },

  // Wallet
  wallet: {
    balance: 125000, // 1,250 MAD
    minBalance: 10000, // 100 MAD
    transactions: [
      {
        id: 'TXN-TUN-001',
        date: '2024-03-10',
        type: 'credit',
        amount: 750000,
        description: 'Paiement Stage 2 - Mohamed K.',
        status: 'completed',
      },
    ],
  },
};

// ============ VENDEUR MOCK DATA ============

export const mockSellerData = {
  // Profil
  profile: {
    id: 'SEL-001',
    name: 'AutoPièces Maroc',
    slug: 'autopieces-maroc',
    description: 'Votre spécialiste en pièces détachées automobile à Casablanca.',
    logo: '🏪',
    rating: 5.0,
    totalReviews: 234,
    totalSales: 2000,
    yearsActive: 5,
    verified: true,
  },

  // Produits
  products: mockShopProducts.filter(p => p.sellerId === 'u_s_premium'),

  // Partenariats
  partnerships: [
    {
      id: 'PART-SEL-001',
      partner: 'Ahmed Benali',
      partnerType: 'mechanic',
      status: 'active',
      since: '2024-01-15',
      commission: 5,
    },
    {
      id: 'PART-SEL-002',
      partner: 'Speed Tuning Casa',
      partnerType: 'tuner',
      status: 'active',
      since: '2024-02-01',
      commission: 7,
    },
  ],

  // Commandes
  orders: [
    {
      id: 'SEL-ORD-001',
      date: '2024-03-15',
      client: 'Amine K.',
      items: ['Huile Total 5W-30', 'Filtre à huile Mann'],
      total: 345,
      status: 'delivered',
    },
    {
      id: 'SEL-ORD-002',
      date: '2024-03-14',
      client: 'Sara M.',
      items: ['Batterie Bosch 60Ah'],
      total: 850,
      status: 'preparing',
    },
  ],

  // Plan actuel
  currentPlan: {
    id: 'PLAN-SEL-001',
    slug: 'seller-premium',
    name: 'Premium',
    price: 499,
    features: [
      'Produits illimités',
      'Commission réduite à 2%',
      'Badge "Premium"',
      'Top visibilité',
      'Marketing dédié',
      'Account manager',
    ],
    expiresAt: '2024-12-31',
  },

  // Wallet
  wallet: {
    balance: 250000, // 2,500 MAD
    minBalance: 20000, // 200 MAD
    transactions: [
      {
        id: 'TXN-SEL-001',
        date: '2024-03-15',
        type: 'credit',
        amount: 34500,
        description: 'Vente #SEL-ORD-001',
        status: 'completed',
      },
    ],
  },
};

// ============ HELPER FUNCTIONS ============

export function getClientOrders() {
  return mockClientData.orders;
}

export function getClientDocuments() {
  return mockClientData.documents;
}

export function getClientVehicles() {
  return mockClientData.vehicles;
}

export function getShopProducts() {
  return mockShopProducts;
}

export function getMechanicServices() {
  return mockMechanicData.services;
}

export function getTunerProfile() {
  return mockTunerData;
}

export function getSellerProfile() {
  return mockSellerData;
}
