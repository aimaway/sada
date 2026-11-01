// Confidentialité des coordonnées des pros (mécaniciens / tuners / vendeurs).
// Règle plateforme : le client ne voit NI le téléphone NI l'adresse exacte
// tant que la commande/projet n'a pas été ACCEPTÉE (par le pro, budget validé).
// Objectif : éviter les contacts hors plateforme (court-circuit de la commission).

export const isContactUnlocked = (): boolean => {
  try {
    return localStorage.getItem('contact_unlocked') === 'true';
  } catch {
    return false;
  }
};

/** Déverrouille les coordonnées (appelé quand une offre/commande est acceptée et payée via la plateforme). */
export const unlockContact = (): void => {
  try {
    localStorage.setItem('contact_unlocked', 'true');
  } catch {
    // stockage indisponible – reste en mémoire via la session courante
  }
};

/** Masque un numéro de téléphone : +212 6•• ••• ••45 */
export const maskPhone = (phone?: string | null): string => {
  if (!phone) return '— masqué —';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return '+2•• ••• •••';
  const head = digits.slice(0, 3); // indicatif
  const tail = digits.slice(-2);
  return `+${head} ••• ••• ••${tail}`;
};

/** Masque une adresse précise : "Bd Mohammed V, Casablanca" → "Zone : Casablanca" */
export const maskAddress = (address?: string | null, city?: string | null): string => {
  if (!isContactUnlocked()) {
    return city ? `Zone desservie : ${city}` : 'Localisation masquée';
  }
  return address || (city ? `Zone : ${city}` : '—');
};

/** Retourne le téléphone réel uniquement si déverrouillé, sinon le masque. */
export const revealPhone = (phone?: string | null): string => {
  return isContactUnlocked() ? phone || '—' : maskPhone(phone);
};
