import {
  User, Car, MapPin, CreditCard, Bell, Shield, HelpCircle, FileText, LogOut,
  ChevronRight, Star, Award, Gift, Trash2, Globe, Settings as SettingsIcon,
  Lock, Mail, Package, ShoppingBag, TrendingUp, Wrench, Heart, LayoutDashboard,
  Boxes, BarChart3, Calendar, FolderKanban, Image, Inbox, Store, Briefcase,
  Wallet, Scissors, Palette, Smartphone, Clock, Eye, Users, AlertTriangle, type LucideIcon,
} from 'lucide-react';

export interface PortalMenuItem {
  id: string;
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
}

export interface PortalMenuSection {
  id: string;
  title: string;
  color: string;
  items: PortalMenuItem[];
}

export interface PortalRoleConfig {
  /** Where the "Réglages" button lands right after login (first-connection view). */
  landingRoute: string;
  landingLabel: string;
  gradient: string;
  accentBg: string;
  avatarEmoji: string;
  roleLabel: string;
  sections: PortalMenuSection[];
}

const customerSections: PortalMenuSection[] = [
  {
    id: 'requests',
    title: 'Mes demandes & offres',
    color: 'bg-emerald-100 text-emerald-600',
    items: [
      { id: 'home', label: 'Nouvelle demande', route: '/customer/home', icon: LayoutDashboard },
      { id: 'offers', label: 'Offres reçues', route: '/customer/offers', icon: Inbox },
      { id: 'ifix', label: 'IFIX AI — diagnostic', route: '/customer/ifix', icon: AlertTriangle },
      { id: 'tracking', label: 'Suivi en direct', route: '/customer/tracking', icon: Wrench },
      { id: 'history', label: 'Historique', route: '/customer/history', icon: Clock },
    ],
  },
  {
    id: 'orders',
    title: 'Commandes & paiements',
    color: 'bg-amber-100 text-amber-600',
    items: [
      { id: 'orders', label: 'Mes commandes', route: '/customer/orders', icon: Package },
      { id: 'wallet', label: 'Mon portefeuille', route: '/customer/wallet', icon: Wallet },
      { id: 'payment-methods', label: 'Méthodes de paiement', route: '/customer/profile/payment-methods', icon: CreditCard },
      { id: 'transactions', label: 'Transactions', route: '/customer/profile/transactions', icon: TrendingUp },
    ],
  },
  {
    id: 'vehicles',
    title: 'Véhicules & documents',
    color: 'bg-blue-100 text-blue-600',
    items: [
      { id: 'garage', label: 'Mon garage', route: '/customer/profile/vehicles', icon: Car },
      { id: 'maintenance', label: 'Entretien', route: '/customer/maintenance', icon: Wrench },
      { id: 'documents', label: 'Mes documents', route: '/customer/documents-manage', icon: FileText },
      { id: 'addresses', label: 'Adresses', route: '/customer/profile/addresses', icon: MapPin },
    ],
  },
  {
    id: 'preferences',
    title: 'Paramètres du compte',
    color: 'bg-slate-100 text-slate-600',
    items: [
      { id: 'info', label: 'Profil', route: '/customer/profile/info', icon: User },
      { id: 'security', label: 'Sécurité', route: '/customer/profile/security', icon: Lock },
      { id: 'notifications', label: 'Notifications', route: '/customer/profile/notifications', icon: Bell },
      { id: 'language', label: 'Langue', route: '/customer/profile/language', icon: Globe },
      { id: 'help', label: 'Aide & contact', route: '/customer/profile/help', icon: HelpCircle },
    ],
  },
];

const mechanicSections: PortalMenuSection[] = [
  {
    id: 'jobs',
    title: 'Demandes & jobs',
    color: 'bg-blue-100 text-blue-600',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', route: '/mechanic/home', icon: LayoutDashboard },
      { id: 'inbox', label: 'Boîte de réception', route: '/mechanic/inbox', icon: Inbox },
      { id: 'jobs', label: 'Mes jobs', route: '/mechanic/jobs', icon: Briefcase },
      { id: 'portal', label: 'Portail Pro', route: '/mechanic/portal', icon: Store },
      { id: 'active', label: 'Job actif', route: '/mechanic/active-job', icon: Wrench },
    ],
  },
  {
    id: 'earnings',
    title: 'Revenus',
    color: 'bg-amber-100 text-amber-600',
    items: [
      { id: 'wallet', label: 'Portefeuille', route: '/mechanic/wallet', icon: Wallet },
      { id: 'earnings', label: 'Gains', route: '/mechanic/earnings', icon: TrendingUp },
      { id: 'payouts', label: 'Paiements', route: '/mechanic/profile/payouts', icon: CreditCard },
      { id: 'shop', label: 'Boutique pièces', route: '/mechanic/shop', icon: Package },
    ],
  },
  {
    id: 'profile',
    title: 'Mon profil pro',
    color: 'bg-emerald-100 text-emerald-600',
    items: [
      { id: 'info', label: 'Informations', route: '/mechanic/profile/info', icon: User },
      { id: 'services', label: 'Services', route: '/mechanic/profile/services', icon: Wrench },
      { id: 'area', label: 'Zone d\'intervention', route: '/mechanic/profile/area', icon: MapPin },
      { id: 'pricing', label: 'Tarifs', route: '/mechanic/profile/pricing', icon: CreditCard },
      { id: 'verification', label: 'Vérification', route: '/mechanic/profile/verification', icon: Shield },
      { id: 'stats', label: 'Statistiques', route: '/mechanic/profile/stats', icon: BarChart3 },
      { id: 'reviews', label: 'Avis clients', route: '/mechanic/profile/reviews', icon: Star },
    ],
  },
  {
    id: 'settings',
    title: 'Paramètres du compte',
    color: 'bg-slate-100 text-slate-600',
    items: [
      { id: 'notifications', label: 'Notifications', route: '/mechanic/profile/notifications', icon: Bell },
      { id: 'visibility', label: 'Visibilité', route: '/mechanic/profile/visibility', icon: Eye },
      { id: 'plans', label: 'Abonnement', route: '/mechanic/plans', icon: Award },
    ],
  },
];

const sellerSections: PortalMenuSection[] = [
  {
    id: 'orders',
    title: 'Commandes',
    color: 'bg-purple-100 text-purple-600',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', route: '/seller/portal', icon: LayoutDashboard },
      { id: 'orders', label: 'Toutes les commandes', route: '/seller/orders', icon: ShoppingBag },
      { id: 'inventory', label: 'Stock & alertes', route: '/seller/inventory', icon: Boxes },
      { id: 'analytics', label: 'Statistiques', route: '/seller/analytics', icon: TrendingUp },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalogue produits',
    color: 'bg-blue-100 text-blue-600',
    items: [
      { id: 'products', label: 'Mes produits', route: '/seller/products', icon: Package },
      { id: 'new-product', label: 'Ajouter un produit', route: '/seller/products/new', icon: Gift },
      { id: 'partnerships', label: 'Partenariats', route: '/seller/partnerships', icon: Briefcase },
    ],
  },
  {
    id: 'settings',
    title: 'Paramètres du compte',
    color: 'bg-slate-100 text-slate-600',
    items: [
      { id: 'plans', label: 'Abonnement vendeur', route: '/seller/plans', icon: Award },
      { id: 'settings', label: 'Réglages boutique', route: '/seller/settings', icon: SettingsIcon },
      { id: 'notifications', label: 'Notifications', route: '/customer/profile/notifications', icon: Bell },
      { id: 'language', label: 'Langue', route: '/customer/profile/language', icon: Globe },
    ],
  },
];

const tunerSections: PortalMenuSection[] = [
  {
    id: 'requests',
    title: 'Demandes & projets',
    color: 'bg-red-100 text-red-600',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', route: '/tuner/portal', icon: LayoutDashboard },
      { id: 'requests', label: 'Demandes reçues', route: '/tuner/requests', icon: Inbox },
      { id: 'projects', label: 'Mes projets', route: '/tuner/projects', icon: FolderKanban },
      { id: 'calendar', label: 'Agenda', route: '/tuner/calendar', icon: Calendar },
    ],
  },
  {
    id: 'activity',
    title: 'Activité & visibilité',
    color: 'bg-blue-100 text-blue-600',
    items: [
      { id: 'portfolio', label: 'Portfolio', route: '/tuner/portfolio', icon: Image },
      { id: 'gallery', label: 'Ajouter au portfolio', route: '/tuner/gallery-upload', icon: Palette },
      { id: 'map', label: 'Carte des demandes', route: '/tuner/requests-map', icon: MapPin },
      { id: 'services', label: 'Mes services', route: '/tuner/services', icon: Wrench },
      { id: 'profile-edit', label: 'Modifier mon profil', route: '/tuner/profile-edit', icon: User },
    ],
  },
  {
    id: 'settings',
    title: 'Paramètres du compte',
    color: 'bg-slate-100 text-slate-600',
    items: [
      { id: 'wallet', label: 'Portefeuille', route: '/tuner/wallet-recharge', icon: Wallet },
      { id: 'payment', label: 'Méthodes de paiement', route: '/tuner/payment-methods', icon: CreditCard },
      { id: 'notifications', label: 'Notifications', route: '/tuner/notifications', icon: Bell },
      { id: 'plans', label: 'Abonnement tuner', route: '/tuner/plans', icon: Award },
    ],
  },
];

const adminSections: PortalMenuSection[] = [
  {
    id: 'platform',
    title: 'Plateforme',
    color: 'bg-slate-200 text-slate-700',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', route: '/admin/dashboard', icon: LayoutDashboard },
      { id: 'requests', label: 'Demandes', route: '/admin/requests', icon: Inbox },
      { id: 'users', label: 'Utilisateurs', route: '/admin/users', icon: Users },
      { id: 'verification', label: 'Vérifications', route: '/admin/verification', icon: Shield },
      { id: 'disputes', label: 'Litiges', route: '/admin/disputes', icon: AlertTriangle },
      { id: 'settings', label: 'Paramètres', route: '/admin/settings', icon: SettingsIcon },
    ],
  },
];

export const portalConfigs: Record<string, PortalRoleConfig> = {
  customer: {
    landingRoute: '/customer/orders',
    landingLabel: 'Mes commandes',
    gradient: 'from-emerald-600 to-teal-600',
    accentBg: 'bg-emerald-100 text-emerald-600',
    avatarEmoji: '👤',
    roleLabel: 'Client',
    sections: customerSections,
  },
  mechanic: {
    landingRoute: '/mechanic/home',
    landingLabel: 'Mes jobs',
    gradient: 'from-blue-600 to-indigo-600',
    accentBg: 'bg-blue-100 text-blue-600',
    avatarEmoji: '🔧',
    roleLabel: 'Mécanicien',
    sections: mechanicSections,
  },
  seller: {
    landingRoute: '/seller/orders',
    landingLabel: 'Mes commandes',
    gradient: 'from-purple-600 to-pink-600',
    accentBg: 'bg-purple-100 text-purple-600',
    avatarEmoji: '🏪',
    roleLabel: 'Vendeur',
    sections: sellerSections,
  },
  tuner: {
    landingRoute: '/tuner/requests',
    landingLabel: 'Mes demandes',
    gradient: 'from-red-600 to-orange-600',
    accentBg: 'bg-red-100 text-red-600',
    avatarEmoji: '🏎️',
    roleLabel: 'Tuner',
    sections: tunerSections,
  },
  admin: {
    landingRoute: '/admin/dashboard',
    landingLabel: 'Console admin',
    gradient: 'from-slate-700 to-slate-900',
    accentBg: 'bg-slate-200 text-slate-700',
    avatarEmoji: '🛡️',
    roleLabel: 'Administrateur',
    sections: adminSections,
  },
};

export function getPortalConfig(role?: string): PortalRoleConfig {
  return portalConfigs[role || 'customer'] || portalConfigs.customer;
}

export { ChevronRight, LogOut, Trash2 };
