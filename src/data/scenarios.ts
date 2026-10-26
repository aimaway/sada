/**
 * Scenario catalog for the "Nouvelle demande" page.
 * Plain data: move it to your DB/API later (the component accepts a `scenarios` prop).
 * Strings are French and double as i18n keys: pass a `t` function to the page to translate them.
 * Keep `name` and `slug` values stable: they are sent to the backend.
 */

export const FAMILIES = [
  'Urgence',
  'Entretien et diagnostic',
  'Deux-roues et pros',
  'Achat et proches',
  'Saisonnier et tourisme',
  'Tuning et pièces',
] as const;

export const MODES = {
  urgent: 'Urgent',
  planned: 'Planifié',
  recurring: 'Récurrent',
} as const;

export type Mode = keyof typeof MODES;
export type Family = typeof FAMILIES[number];

// Field types
export type FieldType = 'select' | 'chips' | 'text' | 'number' | 'toggle' | 'note';

export interface FieldBase {
  type: FieldType;
  name: string;
  label: string;
  required?: boolean;
}

export interface SelectField extends FieldBase {
  type: 'select';
  options: string[];
}

export interface ChipsField extends FieldBase {
  type: 'chips';
  options: string[];
}

export interface TextField extends FieldBase {
  type: 'text';
  placeholder?: string;
}

export interface NumberField extends FieldBase {
  type: 'number';
  placeholder?: string;
}

export interface ToggleField extends FieldBase {
  type: 'toggle';
}

export interface NoteField {
  type: 'note';
  text: string;
}

export type Field = SelectField | ChipsField | TextField | NumberField | ToggleField | NoteField;

export interface Scenario {
  slug: string;
  family: number;
  icon: string;
  title: string;
  desc: string;
  mode: Mode;
  vehicles: string[];
  price: [number, number];
  responders: string;
  fields: Field[];
  flow: string[];
  drivable?: boolean;
  noSavedVehicle?: boolean;
}

// Field builders
const sel = (name: string, label: string, options: string[]): SelectField => ({
  type: 'select',
  name,
  label,
  options,
});

const chips = (name: string, label: string, options: string[]): ChipsField => ({
  type: 'chips',
  name,
  label,
  options,
});

const txt = (name: string, label: string, placeholder?: string, required = false): TextField => ({
  type: 'text',
  name,
  label,
  placeholder,
  required,
});

const num = (name: string, label: string, placeholder?: string, required = false): NumberField => ({
  type: 'number',
  name,
  label,
  placeholder,
  required,
});

const tog = (name: string, label: string, required = false): ToggleField => ({
  type: 'toggle',
  name,
  label,
  required,
});

const note = (text: string): NoteField => ({
  type: 'note',
  text,
});

export const SCENARIOS: Scenario[] = [
  {
    slug: 'batt',
    family: 0,
    icon: '🔋',
    title: 'Batterie à plat',
    desc: 'La voiture ne démarre plus.',
    mode: 'urgent',
    vehicles: ['Voiture', 'Utilitaire', 'Moto'],
    price: [150, 350],
    responders: 'Mécaniciens et vendeurs de batteries',
    fields: [
      chips('symptom', 'Symptôme', ['Rien ne s\'allume', 'Clic au démarrage', 'Voyant batterie', 'Cale après démarrage']),
      sel('batteryAge', 'Âge de la batterie', ['Moins de 2 ans', '2 à 4 ans', 'Plus de 4 ans', 'Je ne sais pas']),
      tog('canOpenHood', 'Je peux ouvrir le capot'),
    ],
    flow: [
      'Les mécaniciens proches envoient prix et ETA',
      'Démarrage par câbles ou remplacement sur place',
      'Option : un vendeur livre une batterie neuve',
      'Paiement après le travail, reçu numérique',
    ],
  },
  {
    slug: 'tire',
    family: 0,
    icon: '🛞',
    title: 'Crevaison ou pneu éclaté',
    desc: 'Pneu à plat sur la route.',
    mode: 'urgent',
    vehicles: ['Voiture', 'Utilitaire', 'Moto', 'Scooter'],
    price: [80, 250],
    responders: 'Mécaniciens et vendeurs de pneus',
    fields: [
      chips('situation', 'Situation', ['Crevaison lente', 'Pneu à plat', 'Pneu éclaté', 'Écrou bloqué']),
      sel('spareWheel', 'Roue de secours', ['Oui, en bon état', 'Oui, dégonflée', 'Non']),
      tog('onHighway', 'Je suis sur autoroute ou voie rapide'),
    ],
    flow: [
      'Alerte sécurité si autoroute',
      'Réparation de la mèche ou changement de roue',
      'Option : pneu neuf livré par un vendeur',
      'Photos avant et après obligatoires',
    ],
  },
  {
    slug: 'sos',
    family: 0,
    icon: '🚨',
    title: 'SOS : remorquage ou accident',
    desc: 'Véhicule bloqué, il faut l\'évacuer.',
    mode: 'urgent',
    vehicles: ['Voiture', 'Utilitaire', 'Moto'],
    price: [300, 900],
    responders: 'Dépanneurs et mécaniciens',
    fields: [
      chips('type', 'Type', ['Remorquage', 'Accident léger', 'Plus de carburant', 'Véhicule bloqué']),
      sel('destination', 'Destination', ['Atelier partenaire', 'Mon domicile', 'Autre adresse']),
      note('En cas de blessé, appelez d\'abord le 15 ou le 19.'),
    ],
    flow: [
      'Contact d\'urgence prévenu avec votre position',
      'Dépanneurs proches proposent prix et ETA',
      'Suivi en direct sur la carte',
      'Option : partage du rapport à l\'assurance',
    ],
  },
  {
    slug: 'vid',
    family: 1,
    icon: '🛢️',
    title: 'Vidange et entretien',
    desc: 'Huile, filtres, révision courante.',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire', 'Moto', 'Scooter'],
    price: [250, 600],
    responders: 'Mécaniciens (et vendeurs si pièces)',
    fields: [
      chips('services', 'Prestations', ['Huile moteur', 'Filtre à huile', 'Filtre à air', 'Filtre habitacle', 'Liquide de frein']),
      num('mileage', 'Kilométrage', 'ex. 85000'),
      sel('oilType', 'Type d\'huile', ['Je ne sais pas', 'Synthétique', 'Semi-synthétique', 'Minérale']),
      tog('ownParts', 'Je fournis les pièces'),
    ],
    flow: [
      'Offres avec ou sans pièces',
      'Choix d\'un créneau',
      'Intervention à domicile ou au bureau',
      'L\'entretien est ajouté au passeport du véhicule',
    ],
  },
  {
    slug: 'frein',
    family: 1,
    icon: '🛑',
    title: 'Freins',
    desc: 'Bruit, pédale molle, vibrations.',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire', 'Moto'],
    price: [200, 700],
    drivable: true,
    responders: 'Mécaniciens',
    fields: [
      chips('symptom', 'Symptôme', ['Grincement', 'Pédale molle', 'Vibrations', 'Voyant frein']),
      sel('location', 'Où ?', ['Avant', 'Arrière', 'Les deux', 'Je ne sais pas']),
    ],
    flow: [
      'Diagnostic sur place',
      'Devis détaillé si pièces à changer',
      'Validation du surcoût par le client',
      'Garantie sur la main-d\'œuvre',
    ],
  },
  {
    slug: 'clim',
    family: 1,
    icon: '❄️',
    title: 'Climatisation',
    desc: 'Pas de froid, odeur, fuite.',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire'],
    price: [150, 500],
    drivable: true,
    responders: 'Mécaniciens spécialistes clim',
    fields: [
      chips('issue', 'Problème', ['Pas de froid', 'Mauvaise odeur', 'Bruit', 'Fuite']),
      sel('lastRecharge', 'Dernière recharge', ['Moins d\'un an', '1 à 3 ans', 'Plus de 3 ans', 'Jamais']),
    ],
    flow: [
      'Contrôle de pression et fuite',
      'Recharge ou réparation',
      'Option : pack clim d\'été',
      'Reçu et garantie',
    ],
  },
  {
    slug: 'diag',
    family: 1,
    icon: '💡',
    title: 'Voyant ou bruit suspect',
    desc: 'Je ne sais pas ce qui ne va pas.',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire', 'Moto'],
    price: [100, 300],
    drivable: true,
    responders: 'Mécaniciens diagnostic',
    fields: [
      chips('warningLight', 'Voyant', ['Moteur', 'ABS', 'Huile', 'Batterie', 'Airbag', 'Autre']),
      sel('when', 'Quand ça arrive', ['Au démarrage', 'En roulant', 'En freinant', 'Au ralenti']),
      tog('obdScan', 'Scan OBD souhaité'),
      note('Astuce : un enregistrement du bruit ou une photo du tableau de bord aide l\'assistant à estimer le problème et le prix.'),
    ],
    flow: [
      'Pré-diagnostic assisté avant l\'envoi',
      'Offres de diagnostic à prix fixe',
      'Rapport avec photos',
      'Devis de réparation proposé ensuite',
    ],
  },
  {
    slug: 'moto',
    family: 2,
    icon: '🛵',
    title: 'Urgence deux-roues et livreur',
    desc: 'Je perds de l\'argent chaque heure.',
    mode: 'urgent',
    vehicles: ['Moto', 'Scooter', 'Vélo électrique'],
    price: [50, 200],
    responders: 'Mécaniciens deux-roues',
    fields: [
      chips('issue', 'Problème', ['Crevaison', 'Chaîne', 'Freins', 'Batterie', 'Embrayage']),
      tog('inDelivery', 'Je suis en pleine livraison'),
      num('hourlyGain', 'Gain moyen par heure (MAD)', 'ex. 60'),
    ],
    flow: [
      'Offres triées par rapidité',
      'Réparation sur le trottoir en moins de 30 min',
      'Paiement espèces ou wallet',
      'Rappel d\'entretien mensuel proposé',
    ],
  },
  {
    slug: 'flotte',
    family: 2,
    icon: '🚕',
    title: 'Entretien de flotte ou taxi',
    desc: 'Plusieurs véhicules, facture mensuelle.',
    mode: 'recurring',
    vehicles: ['Taxi', 'VTC', 'Utilitaire', 'Moto livraison'],
    price: [200, 800],
    responders: 'Mécaniciens agréés flotte',
    fields: [
      num('vehicleCount', 'Nombre de véhicules', 'ex. 8', true),
      sel('frequency', 'Fréquence', ['Mensuelle', 'Trimestrielle', 'Selon kilométrage']),
      chips('services', 'Services', ['Vidange', 'Pneus', 'Freins', 'Contrôle général']),
      tog('monthlyInvoice', 'Facture mensuelle (PDF et CSV)'),
      tog('csvImport', 'Ajouter les véhicules par fichier CSV'),
    ],
    flow: [
      'Tarif négocié par volume',
      'Créneaux récurrents automatiques',
      'Tableau de bord dépenses et pannes',
      'Facture mensuelle unique',
    ],
  },
  {
    slug: 'inspect',
    family: 3,
    icon: '🔍',
    title: 'Inspection avant achat',
    desc: 'Je veux acheter une occasion sans me faire avoir.',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire', 'Moto'],
    price: [300, 700],
    noSavedVehicle: true,
    responders: 'Mécaniciens inspecteurs',
    fields: [
      txt('listingUrl', 'Lien de l\'annonce', 'https://…'),
      txt('model', 'Marque, modèle, année', 'Ex. Dacia Duster 2018', true),
      num('askingPrice', 'Prix demandé (MAD)', 'ex. 120000'),
      chips('checks', 'Points à vérifier', ['Moteur', 'Boîte', 'Châssis', 'Électrique', 'Carrosserie et accident', 'Scan OBD']),
      tog('sellerAgrees', 'Le vendeur est d\'accord pour l\'inspection'),
    ],
    flow: [
      'Un inspecteur vérifié va sur place',
      'Checklist et photos obligatoires',
      'Verdict : acheter, négocier ou éviter',
      'Rapport partageable (lien et PDF) avec fourchette de négociation',
    ],
  },
  {
    slug: 'proche',
    family: 3,
    icon: '👨‍👩‍👧',
    title: 'Demande pour un proche',
    desc: 'Je commande pour mon père, je paie à distance.',
    mode: 'planned',
    vehicles: ['Voiture', 'Moto', 'Utilitaire'],
    price: [100, 600],
    responders: 'Mécaniciens',
    fields: [
      txt('beneficiaryName', 'Nom du bénéficiaire', 'Ex. Hassan', true),
      txt('beneficiaryPhone', 'Téléphone du bénéficiaire', '+212 6…', true),
      sel('issue', 'Problème', ['Batterie', 'Pneu', 'Freins', 'Vidange', 'Autre']),
      sel('payer', 'Qui paie ?', ['Moi (le payeur)', 'Le bénéficiaire']),
      tog('beneficiaryApproves', 'Le bénéficiaire valide le devis'),
    ],
    flow: [
      'Lien WhatsApp ou SMS envoyé au bénéficiaire',
      'Il partage sa position',
      'Le payeur suit l\'avancement et règle',
      'Reçu envoyé aux deux',
    ],
  },
  {
    slug: 'pack',
    family: 4,
    icon: '🧳',
    title: 'Pack saisonnier',
    desc: 'Check avant voyage, clim d\'été, rentrée…',
    mode: 'planned',
    vehicles: ['Voiture', 'Utilitaire'],
    price: [300, 900],
    responders: 'Mécaniciens (offres groupées)',
    fields: [
      sel('campaign', 'Campagne', ['Check avant voyage (MRE)', 'Clim d\'été', 'Rentrée scolaire', 'Avant l\'Aïd', 'Saison des pluies']),
      chips('included', 'Inclus', ['Pneus', 'Freins', 'Batterie', 'Huile', 'Essuie-glaces', 'Clim']),
      txt('promoCode', 'Code promo', 'Ex. ETE26'),
      tog('shareReport', 'Rapport partageable avec la famille'),
    ],
    flow: [
      'Les services sont réservés comme une seule demande',
      'Offres au forfait',
      'Rapport final avec photos',
      'Rappel de l\'entretien suivant',
    ],
  },
  {
    slug: 'touriste',
    family: 4,
    icon: '🧭',
    title: 'Assistance touriste ou location',
    desc: 'En panne avec une voiture de location.',
    mode: 'urgent',
    vehicles: ['Voiture de location', 'Moto', 'Camping-car'],
    price: [150, 600],
    responders: 'Mécaniciens bilingues',
    fields: [
      txt('rentalCode', 'Loueur (code partenaire)', 'Ex. code du loueur'),
      chips('issue', 'Problème', ['Panne', 'Crevaison', 'Clés enfermées', 'Accident léger']),
      sel('language', 'Langue', ['English', 'Français', 'Español', 'العربية']),
      tog('notifyRental', 'Prévenir le loueur'),
    ],
    flow: [
      'Interface en anglais, 3 étapes',
      'Mécanicien parlant votre langue',
      'Le loueur reçoit le statut',
      'Paiement par carte',
    ],
  },
  {
    slug: 'tuning',
    family: 5,
    icon: '🏁',
    title: 'Tuning Stage 1, 2, 3',
    desc: 'Préparation moteur, échappement, châssis.',
    mode: 'planned',
    vehicles: ['Voiture', 'Moto'],
    price: [1500, 12000],
    responders: 'Ateliers tuning vérifiés',
    fields: [
      sel('tier', 'Palier', ['Stage 1', 'Stage 2', 'Stage 3', 'X', 'R']),
      txt('model', 'Modèle et motorisation', 'Ex. Golf 7 GTI', true),
      chips('goals', 'Objectifs', ['Reprogrammation ECU', 'Échappement', 'Admission', 'Suspension', 'Freinage sport', 'Esthétique']),
      note('Les modifications doivent respecter le code de la route et le contrôle technique. La plateforme refuse toute demande de contournement des normes.'),
      tog('legalConfirmation', 'Je confirme que mon projet est conforme à la réglementation', true),
    ],
    flow: [
      'Ateliers tuning envoient devis et délais',
      'Galerie « Mon garage » alimentée après le travail',
      'Possibilité de partager dans la communauté',
      'Garantie sur la main-d\'œuvre',
    ],
  },
  {
    slug: 'piece',
    family: 5,
    icon: '⚙️',
    title: 'Demande de pièce',
    desc: 'Je cherche une pièce au meilleur prix.',
    mode: 'planned',
    vehicles: ['Voiture', 'Moto', 'Utilitaire'],
    price: [50, 2000],
    responders: 'Vendeurs de pièces',
    fields: [
      txt('part', 'Pièce recherchée', 'Ex. plaquettes avant', true),
      sel('quality', 'Qualité', ['Origine (OEM)', 'Adaptable', 'Occasion']),
      chips('delivery', 'Réception', ['Livraison à domicile', 'Chez le mécanicien', 'Retrait chez le vendeur']),
      tog('compatibleOnly', 'Uniquement les pièces compatibles avec mon véhicule'),
    ],
    flow: [
      'Les vendeurs proches envoient prix, stock, délai',
      'Comparaison qualité et garantie',
      'Livraison au lieu de l\'intervention',
      'Option : lier la pièce à une demande de pose',
    ],
  },
];

// ---- Price helpers (reimplement the same rules on the server: never trust the client) ----

export const priceStep = (max: number): number => {
  if (max <= 500) return 10;
  if (max <= 2000) return 50;
  return 100;
};

export interface PriceBounds {
  step: number;
  lo: number;
  hi: number;
  mid: number;
}

export function priceBounds([min, max]: [number, number]): PriceBounds {
  const step = priceStep(max);
  return {
    step,
    lo: Math.round((min * 0.5) / step) * step,
    hi: Math.round((max * 1.5) / step) * step,
    mid: Math.round((min + max) / 2 / step) * step,
  };
}

export type PriceVerdict = 'veryLow' | 'good' | 'fair' | 'high';

export function priceVerdict(price: number, [min, max]: [number, number]): PriceVerdict {
  if (price < min * 0.85) return 'veryLow';
  if (price <= (min + max) / 2) return 'good';
  if (price <= max) return 'fair';
  return 'high';
}

export interface VerdictInfo {
  label: string;
  hint: string;
  tone: 'ok' | 'warn' | 'bad';
}

export const VERDICTS: Record<PriceVerdict, VerdictInfo> = {
  veryLow: {
    label: 'Très bas',
    hint: 'Peu de mécaniciens accepteront ce prix.',
    tone: 'warn',
  },
  good: {
    label: 'Bon prix',
    hint: 'Plusieurs offres attendues rapidement.',
    tone: 'ok',
  },
  fair: {
    label: 'Prix correct',
    hint: 'Des offres arriveront, avec des contre-offres possibles.',
    tone: 'warn',
  },
  high: {
    label: 'Élevé',
    hint: 'Vous pouvez payer moins : baissez le prix.',
    tone: 'bad',
  },
};

// Helper functions
export function getScenariosByFamily(familyIndex: number): Scenario[] {
  return SCENARIOS.filter((s) => s.family === familyIndex);
}

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug);
}

export function getFamilyName(familyIndex: number): string {
  return FAMILIES[familyIndex] || 'Inconnu';
}

export function getModeLabel(mode: Mode): string {
  return MODES[mode] || mode;
}
