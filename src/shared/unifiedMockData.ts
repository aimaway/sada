// ============================================
// UNIFIED MOCK DATA - ALL SERVICES
// ============================================

// USERS
export const mockUsers = {
  customers: [
    // PREMIUM CLIENT - 2500 jobs, 5 stars
    { 
      id: 'u_c_premium', 
      phone: '+212600000099', 
      full_name: 'Amine Khalid', 
      role: 'customer', 
      status: 'active', 
      language: 'fr', 
      created_at: '2021-03-15',
      loyalty_points: 12500,
      subscription: 'gold',
      total_jobs: 2500,
      rating_given: 5.0,
      member_since: '2021',
      bio: 'Client fidèle depuis 3 ans. Utilise TomoBily pour tous ses besoins automobiles.',
      vehicles: [
        { make: 'BMW', model: 'Serie 3', year: 2020, plate: '12345-A-1' },
        { make: 'Mercedes', model: 'Classe C', year: 2019, plate: '67890-B-2' },
      ],
      favorite_mechanics: ['u_m_expert', 'u_m3'],
      total_spent: 450000, // 4500 MAD in centimes
    },
    { id: 'u_c1', phone: '+212600000010', full_name: 'Amine Khalid', role: 'customer', status: 'active', language: 'fr', created_at: '2024-01-15', loyalty_points: 1250 },
    { id: 'u_c2', phone: '+212600000011', full_name: 'Sara Mansouri', role: 'customer', status: 'active', language: 'fr', created_at: '2024-02-01', loyalty_points: 890 },
    { id: 'u_c3', phone: '+212600000012', full_name: 'Youssef Rachidi', role: 'customer', status: 'active', language: 'ar', created_at: '2024-02-15', loyalty_points: 450 },
  ],
  mechanics: [
    // EXPERT MECHANIC - 3000 jobs, 5 stars
    {
      id: 'u_m_expert', 
      phone: '+212600000088', 
      full_name: 'Ahmed Benali', 
      role: 'mechanic', 
      status: 'active', 
      language: 'fr', 
      created_at: '2019-01-10',
      profile: {
        verification_status: 'approved', 
        is_online: true, 
        city: 'Casablanca', 
        service_radius_km: 25,
        categories: ['1', '2', '3', '4'], 
        rating_avg: 5.0, 
        jobs_completed: 3000, 
        response_time_min: 2, 
        completion_rate: 100,
        years_experience: 15, 
        brands: ['Toutes marques', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Dacia', 'Renault', 'Peugeot'], 
        languages: ['Darija', 'Français', 'العربية', 'English'],
        specialties: ['Toutes marques', 'Diagnostic avancé', 'Système électrique', 'Moteur', 'Transmission'], 
        warranty_days: 60, 
        lat: 33.5731, 
        lng: -7.5898,
        verifications: { 
          id_card: true, 
          workshop: true, 
          certificates: true, 
          references: true, 
          insurance: true 
        },
        wallet_balance: 85000, // 850 MAD
        badges: ['verified', 'top_rated', 'fast_response', 'expert'],
        certificates: [
          { name: 'Certification BMW', issuer: 'BMW Maroc', date: '2020-05-15', verified: true },
          { name: 'Formation Bosch', issuer: 'Bosch Car Service', date: '2019-08-20', verified: true },
          { name: 'Expert Diagnostic', issuer: 'Snap-on', date: '2021-03-10', verified: true },
        ],
        skills: [
          'Diagnostic électronique',
          'Système de freinage',
          'Climatisation',
          'Système électrique',
          'Transmission',
          'Suspension',
          'Direction',
          'Échappement',
          'Injection diesel',
          'Hybride/Électrique',
        ],
        bio: 'Mécanicien expert avec 15 ans d\'expérience. Spécialisé dans toutes marques avec certification BMW et Bosch. Plus de 3000 interventions réalisées avec une note de 5 étoiles.',
        profile_image: null,
        subscription: 'expert',
      }
    },
    {
      id: 'u_m1', phone: '+212600000001', full_name: 'Ahmed Benali', role: 'mechanic', status: 'active', language: 'fr', created_at: '2024-01-10',
      profile: {
        verification_status: 'approved', is_online: true, city: 'Casablanca', service_radius_km: 10,
        categories: ['1', '2', '3'], rating_avg: 4.8, jobs_completed: 145, response_time_min: 3, completion_rate: 98,
        years_experience: 8, brands: ['Toyota', 'Dacia', 'Renault', 'Peugeot'], languages: ['Darija', 'Français', 'العربية'],
        specialties: ['Toyota', 'Dacia', 'Renault'], warranty_days: 30, lat: 33.5731, lng: -7.5898,
        verifications: { id_card: true, workshop: true, certificates: true, references: true, insurance: true },
        wallet_balance: 15000, // in centimes (150 MAD)
      }
    },
    {
      id: 'u_m2', phone: '+212600000002', full_name: 'Youssef El Amrani', role: 'mechanic', status: 'active', language: 'fr', created_at: '2024-02-05',
      profile: {
        verification_status: 'approved', is_online: true, city: 'Casablanca', service_radius_km: 8,
        categories: ['1', '3', '4'], rating_avg: 4.5, jobs_completed: 89, response_time_min: 5, completion_rate: 95,
        years_experience: 12, brands: ['BMW', 'Mercedes', 'Audi', 'VW'], languages: ['Darija', 'Français'],
        specialties: ['Électrique', 'Hybride', 'Diesel'], warranty_days: 30, lat: 33.5850, lng: -7.6100,
        verifications: { id_card: true, workshop: true, certificates: true, references: true, insurance: true },
        wallet_balance: 8500,
      }
    },
    {
      id: 'u_m3', phone: '+212600000003', full_name: 'Karim Tazi', role: 'mechanic', status: 'active', language: 'ar', created_at: '2024-01-20',
      profile: {
        verification_status: 'approved', is_online: false, city: 'Casablanca', service_radius_km: 12,
        categories: ['2', '3'], rating_avg: 4.9, jobs_completed: 234, response_time_min: 2, completion_rate: 99,
        years_experience: 15, brands: ['Toutes marques'], languages: ['Darija', 'Français', 'العربية', 'English'],
        specialties: ['Toutes marques', 'Diesel', 'Turbo'], warranty_days: 30, lat: 33.5650, lng: -7.5750,
        verifications: { id_card: true, workshop: true, certificates: true, references: true, insurance: true },
        wallet_balance: 32000,
      }
    },
    {
      id: 'u_m4', phone: '+212600000004', full_name: 'Omar Fassi', role: 'mechanic', status: 'active', language: 'fr', created_at: '2024-03-10',
      profile: {
        verification_status: 'pending', is_online: false, city: 'Casablanca', service_radius_km: 6,
        categories: ['1', '2', '3', '4'], rating_avg: 0, jobs_completed: 0, response_time_min: 0, completion_rate: 0,
        years_experience: 5, brands: ['Dacia', 'Renault', 'Peugeot', 'Citroën'], languages: ['Darija', 'Français'],
        specialties: ['Dacia', 'Renault', 'Peugeot'], warranty_days: 7, lat: 33.5900, lng: -7.6000,
        verifications: { id_card: true, workshop: false, certificates: false, references: false, insurance: false },
        wallet_balance: 0,
      }
    },
  ],
  // TUNERS - 1500 jobs, 5 stars
  tuners: [
    {
      id: 'u_t1',
      phone: '+212600000077',
      full_name: 'Youssef "Speed" El Mansouri',
      role: 'tuner',
      status: 'active',
      language: 'fr',
      created_at: '2020-06-15',
      shop: {
        shop_name: 'Speed Tuning Casa',
        description: 'Spécialiste du tuning automobile à Casablanca. Stage 1 à Stage 3, préparations moteur, échappements sport, et plus encore.',
        logo_emoji: '🏎️',
        city: 'Casablanca',
        address: 'Quartier Industriel, Casablanca',
        phone: '+212522000077',
        rating_avg: 5.0,
        total_sales: 1500,
        verification_status: 'verified',
        partnered_mechanics: ['u_m_expert', 'u_m3'],
        delivery_radius_km: 30,
        delivery_fee_mad: 0,
        free_delivery_above_mad: 0,
        is_online: true,
        years_experience: 12,
        certifications: ['Stage 1 Certified', 'Stage 2 Specialist', 'ECU Remapping Expert'],
        stages: [
          {
            level: 1,
            name: 'Stage 1',
            description: 'Optimisation de base - Gain de puissance 10-15%',
            features: ['Reprogrammation ECU', 'Filtre à air sport', 'Échappement sport', 'Bougies haute performance'],
            priceRange: '2000-4000 MAD',
            popular: true,
          },
          {
            level: 2,
            name: 'Stage 2',
            description: 'Préparation intermédiaire - Gain de puissance 20-30%',
            features: ['Tout Stage 1', 'Downpipe sport', 'Intercooler upgrade', 'Injecteurs haute performance'],
            priceRange: '5000-8000 MAD',
            popular: false,
          },
          {
            level: 3,
            name: 'Stage 3',
            description: 'Préparation avancée - Gain de puissance 40-60%',
            features: ['Tout Stage 2', 'Turbo upgrade', 'Fuel pump haute performance', 'Freins upgrade', 'Suspension sport'],
            priceRange: '10000-20000 MAD',
            popular: false,
          },
        ],
        gallery: [
          { id: '1', type: 'before', vehicle: 'Golf GTI', stage: 'Stage 2', label: 'Avant préparation' },
          { id: '2', type: 'after', vehicle: 'Golf GTI', stage: 'Stage 2', label: 'Après Stage 2 (+35% puissance)' },
          { id: '3', type: 'before', vehicle: 'Clio RS', stage: 'Stage 1', label: 'Avant préparation' },
          { id: '4', type: 'after', vehicle: 'Clio RS', stage: 'Stage 1', label: 'Après Stage 1 (+15% puissance)' },
        ],
        videos: [
          { url: 'https://youtube.com/watch?v=example1', title: 'Préparation Golf GTI Stage 2' },
          { url: 'https://youtube.com/watch?v=example2', title: 'Reprogrammation ECU - Tutoriel' },
        ],
        reviews: [
          { id: '1', customer: 'Mohamed K.', rating: 5, vehicle: 'Golf GTI 2019', comment: 'Excellent travail ! Ma voiture est méconnaissable. Gain de puissance incroyable.', date: '2024-03-10' },
          { id: '2', customer: 'Youssef B.', rating: 5, vehicle: 'Clio RS 2018', comment: 'Professionnels et passionnés. Je recommande vivement !', date: '2024-03-05' },
        ],
        bio: 'Passionné de tuning depuis plus de 12 ans. Spécialisé dans les préparations Stage 1 à Stage 3. Plus de 1500 véhicules préparés avec une note de 5 étoiles.',
      }
    },
  ],

  sellers: [
    // PREMIUM SELLER - 2000 jobs, 5 stars
    {
      id: 'u_s_premium',
      phone: '+212600000066',
      full_name: 'Karim Tazi',
      role: 'seller',
      status: 'active',
      language: 'fr',
      created_at: '2019-05-20',
      shop: {
        shop_name: 'AutoPièces Maroc',
        description: 'Votre spécialiste en pièces détachées automobile à Casablanca. Large stock, prix compétitifs, livraison rapide. Plus de 2000 ventes réalisées avec une note de 5 étoiles.',
        logo_emoji: '🏪',
        city: 'Casablanca',
        address: 'Bd Mohammed V, Casablanca',
        phone: '+212522000066',
        rating_avg: 5.0,
        total_sales: 2000,
        verification_status: 'verified',
        partnered_mechanics: ['u_m_expert', 'u_m1', 'u_m2', 'u_m3'],
        partnered_tuners: ['u_t1'],
        delivery_radius_km: 20,
        delivery_fee_mad: 0,
        free_delivery_above_mad: 300,
        is_online: true,
        years_active: 5,
        total_products: 342,
        categories: ['Huiles', 'Batteries', 'Filtres', 'Freins', 'Pneus', 'Accessoires'],
        services: ['Livraison à domicile', 'Conseil technique', 'Installation partenaire', 'Garantie produit'],
        certifications: ['Vendeur Certifié', 'Partenaire Premium'],
        badges: ['verified', 'top_seller', 'fast_delivery'],
        subscription: 'premium',
        products: [
          { id: 'p1', name: 'Huile Total 5W-30 5L', price: 280, stock: 45, category: 'Huiles', popular: true },
          { id: 'p2', name: 'Batterie Bosch 60Ah', price: 850, stock: 12, category: 'Batteries', popular: true },
          { id: 'p3', name: 'Filtre à huile Mann', price: 65, stock: 100, category: 'Filtres', popular: false },
          { id: 'p4', name: 'Plaquettes frein Brembo', price: 320, stock: 20, category: 'Freins', popular: false },
        ],
        reviews: [
          { id: '1', customer: 'Amine K.', rating: 5, comment: 'Produits de qualité et livraison rapide. Je recommande !', date: '2024-03-10' },
          { id: '2', customer: 'Sara M.', rating: 5, comment: 'Excellent service client. Prix compétitifs.', date: '2024-03-05' },
        ],
      }
    },
    {
      id: 'u_s1', phone: '+212600000100', full_name: 'AutoPièces Maroc', role: 'seller', status: 'active', language: 'fr', created_at: '2024-01-01',
      shop: {
        shop_name: 'AutoPièces Maroc', description: 'Pièces détachées toutes marques - Livraison Casablanca en 2h',
        logo_emoji: '🏪', city: 'Casablanca', address: 'Bd Mohammed V, Casablanca',
        phone: '+212522000100', rating_avg: 4.7, total_sales: 1250, verification_status: 'verified',
        partnered_mechanics: ['u_m1', 'u_m2', 'u_m3'], delivery_radius_km: 15, delivery_fee_mad: 30,
        free_delivery_above_mad: 500, is_online: true,
      }
    },
    {
      id: 'u_s2', phone: '+212600000101', full_name: 'PneusExpress', role: 'seller', status: 'active', language: 'fr', created_at: '2024-02-15',
      shop: {
        shop_name: 'PneusExpress', description: 'Spécialiste pneu et jante - Montage gratuit',
        logo_emoji: '🛞', city: 'Casablanca', address: 'Route d\'El Jadida, Casablanca',
        phone: '+212522000101', rating_avg: 4.5, total_sales: 890, verification_status: 'verified',
        partnered_mechanics: ['u_m1', 'u_m5'], delivery_radius_km: 20, delivery_fee_mad: 0,
        free_delivery_above_mad: 300, is_online: true,
      }
    },
  ],
  admins: [
    { id: 'admin1', phone: '', full_name: 'Admin Principal', role: 'admin', status: 'active', language: 'fr', created_at: '2024-01-01' }
  ]
};

// VEHICLES
export const mockVehicles = [
  { id: 'v1', owner_id: 'u_c1', make: 'Dacia', model: 'Logan', year: 2019, plate: '12345-A-1', mileage: 45200 },
  { id: 'v2', owner_id: 'u_c1', make: 'Peugeot', model: '208', year: 2021, plate: '67890-B-2', mileage: 28000 },
  { id: 'v3', owner_id: 'u_c2', make: 'Renault', model: 'Clio', year: 2020, plate: '11111-C-3', mileage: 35000 },
];

// SERVICE CATEGORIES
export const mockCategories = [
  { id: '1', name_fr: 'Batterie', name_ar: 'بطارية', min_price_mad: 150, max_price_mad: 500, icon: '🔋' },
  { id: '2', name_fr: 'Vidange', name_ar: 'تغيير الزيت', min_price_mad: 200, max_price_mad: 600, icon: '🛢️' },
  { id: '3', name_fr: 'Freins', name_ar: 'فرامل', min_price_mad: 300, max_price_mad: 1200, icon: '🔧' },
  { id: '4', name_fr: 'Pneus', name_ar: 'إطارات', min_price_mad: 100, max_price_mad: 800, icon: '🛞' },
];

// LEGAL DOCUMENTS
export const mockLegalDocuments = [
  {
    id: 'doc1', user_id: 'u_c1', vehicle_id: 'v1', type: 'permis', title: 'Permis de conduire', title_ar: 'رخصة السياقة',
    description: 'Permis B - Catégorie véhicules légers', icon: '🪪', color: 'bg-blue-500',
    issue_date: '2020-03-15', expiry_date: '2030-03-15', status: 'valid', document_number: 'B-123456',
    auto_renewable: false, renewal_cost_mad: 0,
  },
  {
    id: 'doc2', user_id: 'u_c1', vehicle_id: 'v1', type: 'assurance', title: 'Assurance auto', title_ar: 'تأمين السيارة',
    description: 'Assurance tous risques - AXA Maroc', icon: '🛡️', color: 'bg-emerald-500',
    issue_date: '2024-03-01', expiry_date: '2025-03-01', status: 'expiring_soon', document_number: 'AXA-2024-789',
    auto_renewable: true, renewal_cost_mad: 4500, notes: 'Renouvellement automatique activé',
  },
  {
    id: 'doc3', user_id: 'u_c1', vehicle_id: 'v1', type: 'controle_technique', title: 'Contrôle technique', title_ar: 'الفحص التقني',
    description: 'Visite technique périodique obligatoire', icon: '🔍', color: 'bg-amber-500',
    issue_date: '2024-04-10', expiry_date: '2025-04-10', status: 'expiring_soon', document_number: 'CT-CASA-4521',
    auto_renewable: false, renewal_cost_mad: 350,
  },
  {
    id: 'doc4', user_id: 'u_c1', vehicle_id: 'v1', type: 'carte_grise', title: 'Carte grise', title_ar: 'بطاقة الرمادية',
    description: 'Certificat d\'immatriculation du véhicule', icon: '📄', color: 'bg-purple-500',
    issue_date: '2019-06-20', expiry_date: '2099-12-31', status: 'valid', document_number: '12345-A-1',
    auto_renewable: false,
  },
  {
    id: 'doc5', user_id: 'u_c1', vehicle_id: 'v1', type: 'vignette', title: 'Vignette fiscale', title_ar: 'الملصق الجبائي',
    description: 'Taxe spéciale annuelle sur les véhicules', icon: '🏷️', color: 'bg-rose-500',
    issue_date: '2024-01-01', expiry_date: '2025-03-31', status: 'expiring_soon', renewal_cost_mad: 1500,
    notes: '7 CV fiscaux - Dacia Logan',
  },
];

// NOTIFICATIONS
export const mockNotifications = [
  { id: 'n1', user_id: 'u_c1', type: 'document_expiry', title: 'Assurance expire bientôt', body: 'Votre assurance auto expire dans 30 jours. Renouvelez maintenant pour éviter toute interruption.', icon: '🛡️', priority: 'high', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n2', user_id: 'u_c1', type: 'document_expiry', title: 'Contrôle technique à planifier', body: 'Votre contrôle technique expire dans 45 jours. Prenez rendez-vous dès maintenant.', icon: '🔍', priority: 'medium', read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n3', user_id: 'u_c1', type: 'document_expiry', title: 'Vignette fiscale', body: 'Votre vignette fiscale expire dans 60 jours. Coût de renouvellement: 1500 MAD.', icon: '🏷️', priority: 'medium', read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n4', user_id: 'u_c1', type: 'job_update', title: 'Mécanicien en route', body: 'Ahmed Benali est en route vers vous. ETA: 12 minutes.', icon: '🚗', priority: 'high', read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 'n5', user_id: 'u_c1', type: 'offer_received', title: 'Nouvelle offre reçue', body: 'Vous avez reçu une offre de Youssef El Amrani pour 320 MAD.', icon: '💰', priority: 'medium', read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n6', user_id: 'u_c1', type: 'maintenance_reminder', title: 'Vidange à prévoir', body: 'Votre prochaine vidange est prévue dans 500 km ou 1 mois.', icon: '🛢️', priority: 'low', read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
  // Notifications des autres comptes démo — évite un centre de notifications vide
  // quel que soit le client connecté (u_c2, u_c3, compte premium…).
  { id: 'n7', user_id: 'u_c_premium', type: 'job_update', title: 'Intervention terminée', body: 'Ahmed Benali a terminé l’intervention sur votre BMW Série 3. Procédez au paiement.', icon: '✅', priority: 'high', read: false, created_at: new Date(Date.now() - 5400000).toISOString() },
  { id: 'n8', user_id: 'u_c_premium', type: 'document_expiry', title: 'Assurance Mercedes à renouveler', body: 'L’assurance de votre Classe C expire dans 21 jours.', icon: '🛡️', priority: 'medium', read: false, created_at: new Date(Date.now() - 90000000).toISOString() },
  { id: 'n9', user_id: 'u_c2', type: 'offer_received', title: '2 nouvelles offres reçues', body: 'Des mécaniciens ont répondu à votre demande vidange.', icon: '💰', priority: 'medium', read: false, created_at: new Date(Date.now() - 4500000).toISOString() },
  { id: 'n10', user_id: 'u_c2', type: 'job_update', title: 'Mécanicien en route', body: 'Karim Tazi arrive dans environ 10 minutes.', icon: '🚗', priority: 'high', read: true, created_at: new Date(Date.now() - 270000000).toISOString() },
  { id: 'n11', user_id: 'u_c3', type: 'maintenance_reminder', title: 'Révision des 60 000 km', body: 'Pensez à planifier la révision de votre véhicule.', icon: '🛠️', priority: 'low', read: false, created_at: new Date(Date.now() - 400000000).toISOString() },
];

// SERVICE REQUESTS
export const mockRequests = [
  {
    id: 'r1', customer_id: 'u_c1', vehicle_id: 'v1', category_id: '1',
    description: 'Ma voiture ne démarre pas, je pense que la batterie est morte',
    photos: [], lat: 33.5731, lng: -7.5898, address: 'Boulevard Zerktouni, Casablanca',
    customer_price: 250, status: 'open', created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
  },
  {
    id: 'r2', customer_id: 'u_c2', vehicle_id: 'v3', category_id: '2',
    description: 'Vidange urgente, le voyant s\'est allumé',
    photos: [], lat: 33.5800, lng: -7.6000, address: 'Ain Diab, Casablanca',
    customer_price: 350, status: 'offered', created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    expires_at: new Date(Date.now() + 25 * 60000).toISOString(),
  },
];

// OFFERS
export const mockOffers = [
  {
    id: 'o1', request_id: 'r1', mechanic_id: 'u_m1', price: 250, type: 'accept',
    estimated_arrival_min: 12, distance_km: 1.8, message: 'Pièces incluses, batterie Bosch neuve. Garantie 6 mois.',
    status: 'active', created_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'o2', request_id: 'r1', mechanic_id: 'u_m2', price: 320, type: 'counter',
    estimated_arrival_min: 8, distance_km: 1.2, message: 'Batterie Varta premium + diagnostic complet offert.',
    status: 'active', created_at: new Date(Date.now() - 1 * 60000).toISOString(),
  },
  {
    id: 'o3', request_id: 'r2', mechanic_id: 'u_m3', price: 400, type: 'counter',
    estimated_arrival_min: 10, distance_km: 2.5, message: 'Je suis tout près, prix inclut filtre à huile',
    status: 'active', created_at: new Date(Date.now() - 1 * 60000).toISOString(),
  },
];

// JOBS
export const mockJobs = [
  {
    id: 'j1', request_id: 'r1', offer_id: 'o1', customer_id: 'u_c1', mechanic_id: 'u_m1',
    agreed_price: 250, status: 'in_progress', started_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'j2', request_id: 'r2', offer_id: 'o3', customer_id: 'u_c2', mechanic_id: 'u_m3',
    agreed_price: 400, status: 'completed', started_at: new Date(Date.now() - 86400000).toISOString(),
    finished_at: new Date(Date.now() - 82800000).toISOString(),
  },
];

// PRODUCTS
export const mockProducts = [
  { id: 'p1', seller_id: 'u_s1', name: 'Huile Total 5W-30 5L', name_ar: 'زيت توتال 5W-30 5L', category: 'oil', brand: 'Total', price: 280, cost_price: 210, stock: 45, image_emoji: '🛢️', description: 'Huile synthétique haute performance', is_active: true, is_featured: true },
  { id: 'p2', seller_id: 'u_s1', name: 'Batterie Bosch 60Ah', name_ar: 'بطارية بوش 60Ah', category: 'battery', brand: 'Bosch', price: 850, cost_price: 650, stock: 12, image_emoji: '🔋', description: 'Batterie sans entretien garantie 2 ans', is_active: true, is_featured: true },
  { id: 'p3', seller_id: 'u_s1', name: 'Filtre à huile Mann', name_ar: 'فلتر زيت مان', category: 'filter', brand: 'Mann', price: 65, cost_price: 35, stock: 100, image_emoji: '🔧', description: 'Filtre à huile universel', is_active: true, is_featured: false },
  { id: 'p4', seller_id: 'u_s1', name: 'Plaquettes frein avant', name_ar: 'تيل الفرامل أمامي', category: 'brake', brand: 'Brembo', price: 320, cost_price: 220, stock: 20, image_emoji: '🔧', description: 'Plaquettes céramique haute performance', is_active: true, is_featured: false },
  { id: 'p5', seller_id: 'u_s2', name: 'Pneu Michelin 185/65 R15', name_ar: 'إطار ميشلان 185/65 R15', category: 'tire', brand: 'Michelin', price: 680, cost_price: 520, stock: 16, image_emoji: '🛞', description: 'Pneu toutes saisons', is_active: true, is_featured: true },
];

// ORDERS
export const mockOrders = [
  {
    id: 'so1', seller_id: 'u_s1', customer_id: 'u_c1', customer_name: 'Amine K.',
    items: [{ product_id: 'p1', product_name: 'Huile Total 5W-30', quantity: 1, price: 280 }, { product_id: 'p3', product_name: 'Filtre à huile Mann', quantity: 1, price: 65 }],
    total: 345, delivery_address: 'Bd Zerktouni, Casablanca', status: 'out_for_delivery', mechanic_id: 'u_m1',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'so2', seller_id: 'u_s1', customer_id: 'u_c2', customer_name: 'Sara M.',
    items: [{ product_id: 'p2', product_name: 'Batterie Bosch 60Ah', quantity: 1, price: 850 }],
    total: 850, delivery_address: 'Ain Diab, Casablanca', status: 'preparing',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

// PARTNERSHIPS
export const mockPartnerships = [
  { id: 'part1', seller_id: 'u_s1', mechanic_id: 'u_m1', mechanic_name: 'Ahmed Benali', mechanic_rating: 4.8, mechanic_jobs: 145, status: 'active', commission_rate: 5, total_referrals: 23, since: '2024-01-15' },
  { id: 'part2', seller_id: 'u_s1', mechanic_id: 'u_m2', mechanic_name: 'Youssef El Amrani', mechanic_rating: 4.5, mechanic_jobs: 89, status: 'active', commission_rate: 5, total_referrals: 15, since: '2024-02-01' },
  { id: 'part3', seller_id: 'u_s1', mechanic_id: 'u_m3', mechanic_name: 'Karim Tazi', mechanic_rating: 4.9, mechanic_jobs: 234, status: 'active', commission_rate: 7, total_referrals: 41, since: '2024-01-20' },
];

// MAINTENANCE REMINDERS
export const mockMaintenanceReminders = [
  { id: 'mr1', user_id: 'u_c1', vehicle_id: 'v1', type: 'oil_change', title: 'Vidange moteur', title_ar: 'تغيير زيت المحرك', description: 'Vidange + filtre à huile', due_date: new Date(Date.now() + 5 * 86400000).toISOString(), due_km: 15000, status: 'due_soon', last_done: '2024-01-15' },
  { id: 'mr2', user_id: 'u_c1', vehicle_id: 'v1', type: 'tire_rotation', title: 'Permutation des pneus', title_ar: 'تبديل الإطارات', description: 'Permuter les pneus avant/arrière', due_date: new Date(Date.now() + 30 * 86400000).toISOString(), status: 'upcoming', last_done: '2024-02-01' },
  { id: 'mr3', user_id: 'u_c1', vehicle_id: 'v1', type: 'brake_check', title: 'Vérification freins', title_ar: 'فحص الفرامل', description: 'Contrôle plaquettes et disques', due_date: new Date(Date.now() + 60 * 86400000).toISOString(), status: 'upcoming', last_done: '2024-01-20' },
];

// ADMIN SETTINGS
export const mockAdminSettings = {
  commission_percent: 10,
  min_commission_mad: 10,
  max_commission_mad: 100,
  min_wallet_balance_mad: 50,
  default_radius_km: 10,
  request_expiry_min: 30,
  counter_offer_min_percent: 50,
  counter_offer_max_percent: 300,
};

// DAILY CHECKS
export const mockDailyChecks = [
  { id: 'dc1', title: 'Pression des pneus', title_ar: 'ضغط الإطارات', icon: '🛞', category: 'exterior', description: 'Vérifier que les 4 pneus sont correctement gonflés', is_checked: false },
  { id: 'dc2', title: 'Niveau d\'huile', title_ar: 'مستوى الزيت', icon: '🛢️', category: 'under_hood', description: 'Vérifier la jauge d\'huile moteur', is_checked: false },
  { id: 'dc3', title: 'Liquide de refroidissement', title_ar: 'سائل التبريد', icon: '💧', category: 'under_hood', description: 'Niveau du vase d\'expansion', is_checked: false },
  { id: 'dc4', title: 'Voyants tableau de bord', title_ar: 'مؤشرات لوحة القيادة', icon: '⚠️', category: 'dashboard', description: 'Aucun voyant rouge ou orange allumé', is_checked: false },
  { id: 'dc5', title: 'Éclairage', title_ar: 'الإضاءة', icon: '💡', category: 'exterior', description: 'Phares, clignotants, feux stop fonctionnent', is_checked: false },
];

// NEIGHBORHOODS
export const mockNeighborhoods = [
  { name: 'Derb Ghallef', name_ar: 'درب غلف', mechanics: 18, sellers: 12, status: 'active' },
  { name: 'Ain Sebaa', name_ar: 'عين السبع', mechanics: 15, sellers: 8, status: 'active' },
  { name: 'Maarif', name_ar: 'المعاريف', mechanics: 12, sellers: 6, status: 'active' },
  { name: 'Ain Diab', name_ar: 'عين الذئاب', mechanics: 8, sellers: 4, status: 'expanding' },
  { name: 'Anfa', name_ar: 'أنفا', mechanics: 5, sellers: 3, status: 'planned' },
];

// Helper function to get days until expiry
export function getDaysUntilExpiry(expiryDate: string): { days: number; text: string; urgent: boolean } {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return { days: Math.abs(days), text: `Expiré depuis ${Math.abs(days)}j`, urgent: true };
  if (days <= 30) return { days, text: `Expire dans ${days}j`, urgent: true };
  if (days <= 90) return { days, text: `Expire dans ${days}j`, urgent: false };
  const months = Math.floor(days / 30);
  return { days, text: `Expire dans ${months} mois`, urgent: false };
}

// Helper to get unread notifications count
export function getUnreadNotificationsCount(userId: string): number {
  return mockNotifications.filter(n => n.user_id === userId && !n.read).length;
}

// Helper to get expiring documents count
export function getExpiringDocumentsCount(userId: string): number {
  return mockLegalDocuments.filter(d => d.user_id === userId && d.status === 'expiring_soon').length;
}

// Miroir de l'API backend /api/v1/clients/{id} : les écrans "compte client"
// (profil, véhicules, documents…) cherchent les clients dans mockUsers.clients.
(mockUsers as any).clients = mockUsers.customers;
