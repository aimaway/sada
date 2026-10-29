import React, { useEffect, useMemo, useState } from 'react';
import { portalApi } from '../shared/apiClient';
import {
  ArrowLeft, Loader2, Search, ShoppingCart, Trash2, Plus, Minus, Package,
  AlertCircle, CheckCircle2, MapPin, Store, XCircle, RefreshCw, Truck,
} from 'lucide-react';

// Boutique mécanicien — branchée sur le backend réel (/api/v1/store/*).
// Règles respectées côté serveur (et rappelées ici) :
//  - prix calculés par le serveur (centimes), jamais depuis le client ;
//  - stock décrémenté dans une transaction avec verrou de ligne ;
//  - snapshots de prix sur chaque ligne de commande ;
//  - commission vendeur JAMAIS ajoutée au total acheteur ;
//  - paiement SIMULÉ en démo uniquement (statut "pending" tant que non payé).

type Product = {
  id: number; name: string; sku?: string; short_description?: string;
  price: number; list_price: number; discount_percent: number; currency: string;
  in_stock: boolean; stock_quantity: number; condition?: string; main_image?: string;
  compatible_makes?: string[]; shipping_options?: string[];
  seller: { seller_id: number; business_name?: string; city?: string; verified?: boolean; rating?: number };
};
type Detail = Product & { description?: string; category?: { id: number; name: string } | null };
type QuoteLine = { product_id: number; name: string; unit_price: number; quantity: number; line_total: number; seller_id: number; seller_name: string };
type Quote = { lines: QuoteLine[]; subtotal: number; shipping_fee: number; tax_amount: number; total: number; currency: string; note_commission?: string };
type CreatedOrder = { ok: boolean; order_id: number; order_number: string; totals: { subtotal: number; shipping_fee: number; tax_amount: number; total: number }; payment_status: string; payment_simulated: boolean; note?: string; replayed?: boolean };
type OrderRow = { id: number; order_number: string; status: string; payment_status: string; total: number; delivery_mode?: string; created_at?: string; items: { name: string; qty: number; unit_price: number; line_total: number }[] };

const fmt = (cents: number) => `${(cents / 100).toFixed(2)} MAD`;
const detailOf = (e: unknown) => (e as any)?.detail;
const errMsg = (e: unknown): string => {
  const d = detailOf(e);
  if (typeof d === 'string') return d;
  if (d && typeof d === 'object' && typeof d.message === 'string') {
    const errs = Array.isArray(d.errors) ? d.errors.map((x: any) => x.reason).join(', ') : '';
    return errs ? `${d.message} (${errs})` : d.message;
  }
  return (e as any)?.message || 'Erreur inconnue.';
};

type Cart = Record<number, { qty: number }>;
const CART_KEY = 'tomobily.mech.cart';

const DELIVERY_MODES = [
  { id: 'business_address', label: 'Adresse professionnelle (mon atelier)', icon: Store },
  { id: 'custom_address', label: 'Autre adresse pour cette commande', icon: MapPin },
  { id: 'customer_address', label: 'Adresse du client destinataire', icon: Package },
  { id: 'pickup', label: 'Retrait chez le vendeur', icon: Truck },
] as const;

export const MechanicStoreScreen: React.FC = () => {
  const [view, setView] = useState<'catalog' | 'detail' | 'cart' | 'confirm' | 'done' | 'orders'>('catalog');
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const notify = (kind: 'ok' | 'err', text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 4500);
  };

  // ---- catalogue ----
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const loadCatalog = async (query = q) => {
    setLoadingList(true); setListError(null);
    try {
      const r = await portalApi<{ items: Product[]; total: number }>(
        `/api/v1/store/products?q=${encodeURIComponent(query)}&limit=50`);
      setItems(r.items); setTotal(r.total);
    } catch (e) { setListError(errMsg(e)); setItems([]); }
    finally { setLoadingList(false); }
  };
  useEffect(() => { loadCatalog(''); /* eslint-disable-next-line */ }, []);

  // ---- panier (persisté localement, mais les PRIX viennent toujours du serveur) ----
  const [cart, setCart] = useState<Cart>(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  const cartCount = useMemo(() => Object.values(cart).reduce((s, c) => s + c.qty, 0), [cart]);
  const addToCart = (p: Product, qty = 1) => {
    setCart((c) => {
      const cur = c[p.id]?.qty || 0;
      const next = Math.min(cur + qty, p.stock_quantity);
      if (next === cur) { notify('err', `Stock limité à ${p.stock_quantity} unité(s).`); return c; }
      return { ...c, [p.id]: { qty: next } };
    });
  };
  const setQty = (id: number, qty: number, max: number) => {
    setCart((c) => {
      const n = { ...c };
      if (qty <= 0) delete n[id];
      else n[id] = { qty: Math.min(qty, max) };
      return n;
    });
  };

  // ---- détail produit ----
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const openDetail = async (id: number) => {
    setLoadingDetail(true); setDetail(null); setView('detail');
    try { setDetail(await portalApi<Detail>(`/api/v1/store/products/${id}`)); }
    catch (e) { notify('err', errMsg(e)); setView('catalog'); }
    finally { setLoadingDetail(false); }
  };

  // ---- devis serveur ----
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const cartLines = useMemo(
    () => Object.entries(cart).map(([id, c]) => ({ product_id: Number(id), quantity: c.qty })),
    [cart]);

  const fetchQuote = async (): Promise<Quote | null> => {
    setQuoting(true);
    try {
      const qt = await portalApi<Quote>('/api/v1/store/orders/quote', {
        method: 'POST', body: { items: cartLines, delivery_mode: 'business_address' },
      });
      setQuote(qt); return qt;
    } catch (e) { notify('err', errMsg(e)); setQuote(null); return null; }
    finally { setQuoting(false); }
  };
  useEffect(() => { if (view === 'cart' && cartLines.length) fetchQuote(); if (!cartLines.length) setQuote(null); /* eslint-disable-next-line */ }, [view, cart]);

  // ---- livraison ----
  const [mode, setMode] = useState<(typeof DELIVERY_MODES)[number]['id']>('business_address');
  const [addr, setAddr] = useState({ full_name: '', phone: '', address_line: '', city: '', postal_code: '' });
  const [notes, setNotes] = useState('');

  // ---- commande / confirmation ----
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<CreatedOrder | null>(null);
  const [paying, setPaying] = useState(false);
  const [paidInfo, setPaidInfo] = useState<any | null>(null);

  const placeOrder = async () => {
    if (!quote) { notify('err', 'Devis indisponible — rechargez le panier.'); return; }
    if ((mode === 'custom_address' || mode === 'customer_address')) {
      if (!addr.full_name || !addr.phone || !addr.address_line || !addr.city) {
        notify('err', 'Adresse incomplète : nom, téléphone, adresse et ville sont requis.'); return;
      }
    }
    setPlacing(true);
    try {
      const body: any = {
        items: cartLines, delivery_mode: mode, confirm: true,
        recipient_notes: notes || undefined,
        idempotency_key: `mech-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      if (mode === 'custom_address' || mode === 'customer_address') body.shipping_address = addr;
      const res = await portalApi<CreatedOrder>('/api/v1/store/orders', { method: 'POST', body });
      setPlaced(res); setCart({}); setView('done');
      notify('ok', `Commande ${res.order_number} créée.`);
    } catch (e) { notify('err', errMsg(e)); }
    finally { setPlacing(false); }
  };

  const paySimulated = async () => {
    if (!placed) return;
    setPaying(true);
    try {
      const r = await portalApi(`/api/v1/store/orders/${placed.order_id}/pay`, {
        method: 'POST', body: { method: 'simulated' },
      });
      setPaidInfo(r); notify('ok', 'Paiement simulé enregistré (démo).');
    } catch (e) { notify('err', errMsg(e)); }
    finally { setPaying(false); }
  };

  // ---- commandes ----
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const loadOrders = async () => {
    setLoadingOrders(true);
    try { const r = await portalApi<{ items: OrderRow[] }>('/api/v1/store/orders'); setOrders(r.items); }
    catch (e) { notify('err', errMsg(e)); setOrders([]); }
    finally { setLoadingOrders(false); }
  };
  useEffect(() => { if (view === 'orders') loadOrders(); /* eslint-disable-next-line */ }, [view]);

  const cancelOrder = async (id: number) => {
    try {
      await portalApi(`/api/v1/store/orders/${id}/cancel`, { method: 'POST' });
      notify('ok', 'Commande annulée, stock restitué.'); loadOrders();
    } catch (e) { notify('err', errMsg(e)); }
  };

  // ---------- UI ----------
  const Btn = ({ children, onClick, disabled, variant = 'primary' }: any) => (
    <button onClick={onClick} disabled={disabled}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
        variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700'
        : variant === 'ghost' ? 'text-slate-600 hover:bg-slate-100'
        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
      {children}
    </button>
  );

  const Header = ({ title, back }: { title: string; back?: () => void }) => (
    <div className="flex items-center gap-3 mb-4">
      {back && <button onClick={back} aria-label="Retour" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><ArrowLeft size={18} /></button>}
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="ml-auto flex gap-2">
        <Btn variant="outline" onClick={() => setView('orders')}>Mes commandes</Btn>
        <Btn onClick={() => setView('cart')}>
          <span className="inline-flex items-center gap-1"><ShoppingCart size={15} /> Panier{cartCount > 0 ? ` (${cartCount})` : ''}</span>
        </Btn>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 ${toast.kind === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.kind === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}{toast.text}
        </div>
      )}

      {view === 'catalog' && (
        <>
          <Header title="Boutique pièces détachées" />
          <p className="text-xs text-slate-500 mb-3">
            Catalogue identique à celui des clients — mêmes prix vendeurs, aucun tarif spécial appliqué.
            Les montants sont recalculés par le serveur à chaque étape.
          </p>
          <form className="flex gap-2 mb-4" onSubmit={(e) => { e.preventDefault(); loadCatalog(); }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une pièce, une référence…"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Btn onClick={() => loadCatalog()} disabled={loadingList}>Rechercher</Btn>
          </form>

          {loadingList ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
            : listError ? <Empty icon={<AlertCircle />} text={listError} action={<Btn onClick={() => loadCatalog()}><RefreshCw size={14} /> Réessayer</Btn>} />
            : items.length === 0 ? <Empty icon={<Package />} text="Aucun produit ne correspond à cette recherche." action={<Btn variant="ghost" onClick={() => { setQ(''); loadCatalog(''); }}>Voir tout le catalogue</Btn>} />
            : (
              <>
                <p className="text-xs text-slate-500 mb-2">{total} produit(s) disponibles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition">
                      <button onClick={() => openDetail(p.id)} className="text-left w-full">
                        <div className="h-24 mb-3 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                          {p.main_image ? <img src={p.main_image} alt={p.name} className="object-cover w-full h-full" /> : <Package className="text-slate-300" size={32} />}
                        </div>
                        <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">{p.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{p.seller.business_name}{p.seller.city ? ` — ${p.seller.city}` : ''}</p>
                      </button>
                      <div className="flex items-end justify-between mt-3">
                        <div>
                          {p.discount_percent > 0 && <span className="text-xs line-through text-slate-400 mr-1">{fmt(p.list_price)}</span>}
                          <div className="font-bold text-blue-700">{fmt(p.price)}</div>
                          <div className={`text-xs ${p.in_stock ? 'text-emerald-600' : 'text-red-600'}`}>
                            {p.in_stock ? `${p.stock_quantity} en stock` : 'Rupture'}
                          </div>
                        </div>
                        <Btn onClick={() => addToCart(p)} disabled={!p.in_stock}>Ajouter</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </>
      )}

      {view === 'detail' && (
        loadingDetail ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div> : detail && (
          <>
            <Header title={detail.name} back={() => setView('catalog')} />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-slate-100 h-64 flex items-center justify-center overflow-hidden">
                {detail.main_image ? <img src={detail.main_image} alt={detail.name} className="object-contain max-h-full" /> : <Package size={48} className="text-slate-300" />}
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{fmt(detail.price)}</p>
                {detail.discount_percent > 0 && <p className="text-sm text-slate-500 line-through">{fmt(detail.list_price)} · remise {detail.discount_percent}%</p>}
                <p className={`mt-1 text-sm ${detail.in_stock ? 'text-emerald-600' : 'text-red-600'}`}>{detail.in_stock ? `${detail.stock_quantity} en stock` : 'Indisponible'}</p>
                <div className="mt-3 text-sm text-slate-700 space-y-1">
                  <p><span className="font-medium">Vendeur :</span> {detail.seller.business_name}{detail.seller.verified ? ' ✓' : ''} {detail.seller.city ? `(${detail.seller.city})` : ''}</p>
                  {detail.category && <p><span className="font-medium">Catégorie :</span> {detail.category.name}</p>}
                  {detail.compatible_makes && detail.compatible_makes.length > 0 && <p><span className="font-medium">Compatibilité :</span> {detail.compatible_makes.join(', ')}</p>}
                </div>
                {detail.description && <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{detail.description}</p>}
                <div className="mt-4 flex gap-2">
                  <Btn onClick={() => { addToCart(detail); notify('ok', 'Ajouté au panier.'); }} disabled={!detail.in_stock}>
                    <span className="inline-flex items-center gap-1"><ShoppingCart size={15} /> Ajouter au panier</span>
                  </Btn>
                  <Btn variant="ghost" onClick={() => setView('catalog')}>Continuer mes achats</Btn>
                </div>
              </div>
            </div>
          </>
        )
      )}

      {view === 'cart' && (
        <>
          <Header title="Panier" back={() => setView('catalog')} />
          {cartLines.length === 0 ? <Empty icon={<ShoppingCart />} text="Votre panier est vide." action={<Btn onClick={() => setView('catalog')}>Parcourir le catalogue</Btn>} /> : (
            <div className="space-y-3">
              {Object.entries(cart).map(([idStr, c]) => {
                const p = items.find((x) => x.id === Number(idStr));
                return (
                  <div key={idStr} className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-white">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {p?.main_image ? <img src={p.main_image} className="object-cover w-full h-full rounded-lg" alt="" /> : <Package size={18} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p?.name || `Produit #${idStr}`}</p>
                      <p className="text-xs text-slate-500">{p ? fmt(p.price) : 'prix confirmé au paiement serveur'} × {c.qty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded border border-slate-300 hover:bg-slate-50" onClick={() => setQty(Number(idStr), c.qty - 1, p?.stock_quantity ?? 999)}><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm">{c.qty}</span>
                      <button className="p-1.5 rounded border border-slate-300 hover:bg-slate-50" onClick={() => setQty(Number(idStr), c.qty + 1, p?.stock_quantity ?? 999)} disabled={!!p && c.qty >= p.stock_quantity}><Plus size={14} /></button>
                    </div>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" onClick={() => setQty(Number(idStr), 0, 0)} aria-label="Retirer"><Trash2 size={15} /></button>
                  </div>
                );
              })}

              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h3 className="font-semibold text-sm mb-2 text-slate-900">Total vérifié par le serveur</h3>
                {quoting ? <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={14} className="animate-spin" /> Calcul en cours…</div> : quote ? (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Sous-total produits</span><span>{fmt(quote.subtotal)}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Livraison</span><span>{quote.shipping_fee === 0 ? 'Inclus / à convenir' : fmt(quote.shipping_fee)}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Taxes</span><span>{quote.tax_amount === 0 ? 'Non configurées' : fmt(quote.tax_amount)}</span></div>
                    <div className="flex justify-between font-bold border-t border-slate-200 pt-2 mt-1"><span>Total à payer</span><span className="text-blue-700">{fmt(quote.total)}</span></div>
                    {quote.note_commission && <p className="text-xs text-slate-500 mt-2">{quote.note_commission}</p>}
                  </div>
                ) : <p className="text-sm text-red-600">Devis indisponible. <button className="underline" onClick={fetchQuote}>Réessayer</button></p>}
              </div>

              <Btn onClick={() => { if (quote) setView('confirm'); }} disabled={!quote}>Passer à la commande</Btn>
            </div>
          )}
        </>
      )}

      {view === 'confirm' && quote && (
        <>
          <Header title="Confirmation de la commande" back={() => setView('cart')} />
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="font-semibold text-sm mb-2">Lieu de livraison / retrait</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {DELIVERY_MODES.map((m) => (
                  <label key={m.id} className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer text-sm ${mode === m.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                    <input type="radio" name="dm" checked={mode === m.id} onChange={() => setMode(m.id)} />
                    <m.icon size={15} className="text-slate-500" /> {m.label}
                  </label>
                ))}
              </div>
            </div>

            {(mode === 'custom_address' || mode === 'customer_address') && (
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <p className="text-xs text-slate-500">{mode === 'customer_address' ? 'Adresse du client destinataire — utilisée UNIQUEMENT pour cette commande (aucune écriture dans un carnet d’adresses).' : 'Adresse temporaire pour cette commande.'}</p>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Nom du destinataire *" value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} />
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Téléphone *" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Adresse *" value={addr.address_line} onChange={(e) => setAddr({ ...addr, address_line: e.target.value })} />
                <div className="flex gap-2">
                  <input className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Ville *" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                  <input className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Code postal" value={addr.postal_code} onChange={(e) => setAddr({ ...addr, postal_code: e.target.value })} />
                </div>
              </div>
            )}
            {mode === 'business_address' && <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">Livraison à votre adresse professionnelle enregistrée (vérifiée par le serveur).</p>}
            {mode === 'pickup' && <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">Retrait chez le vendeur — destination : ville publique du vendeur.</p>}

            <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Notes pour le vendeur (véhicule, urgent…)" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <div className="border border-slate-200 rounded-xl p-4 bg-white text-sm space-y-1">
              <div className="flex justify-between"><span>Sous-total</span><span>{fmt(quote.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Livraison</span><span>{quote.shipping_fee === 0 ? '0,00 MAD' : fmt(quote.shipping_fee)}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span className="text-blue-700">{fmt(quote.total)}</span></div>
              <p className="text-xs text-slate-500 pt-1">⚠️ En démo, le paiement est SIMULÉ (jamais de carte réelle). Le statut reste « pending » tant que la finalisation n’est pas effectuée.</p>
            </div>

            <div className="flex gap-2">
              <Btn onClick={placeOrder} disabled={placing}>
                {placing ? <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Envoi…</span> : 'Confirmer la commande'}
              </Btn>
              <Btn variant="ghost" onClick={() => setView('cart')}>Annuler</Btn>
            </div>
          </div>
        </>
      )}

      {view === 'done' && placed && (
        <>
          <Header title="Commande créée" back={() => setView('catalog')} />
          <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 max-w-xl">
            <p className="flex items-center gap-2 font-semibold text-emerald-800"><CheckCircle2 size={18} /> {placed.order_number}</p>
            <p className="text-sm text-emerald-900 mt-1">Total : {fmt(placed.totals.total)} — statut paiement : <b>{placed.payment_status}</b>.</p>
            <p className="text-xs text-slate-600 mt-2">{placed.note}</p>
            {!paidInfo ? (
              <div className="mt-3">
                <Btn onClick={paySimulated} disabled={paying}>{paying ? 'Paiement…' : 'Payer (simulation démo)'}</Btn>
              </div>
            ) : (
              <div className="mt-3 text-sm bg-white rounded-lg p-3 border border-emerald-200">
                <p className="font-medium text-emerald-700">Paiement simulé enregistré ✓</p>
                {paidInfo.commission && (
                  <p className="text-xs text-slate-600 mt-1">
                    Part vendeur : brut {fmt(paidInfo.commission.gross_amount)}, commission TomoBily {paidInfo.commission.commission_rate}% = {fmt(paidInfo.commission.commission_amount)}, net vendeur {fmt(paidInfo.commission.seller_net)}.
                    <br />La commission est prélevée sur le vendeur — jamais ajoutée à votre total ({fmt(paidInfo.buyer_total)}).
                  </p>
                )}
                {!paidInfo.commission && <p className="text-xs text-slate-500 mt-1">Commission non configurée (COMMISSION_RATE_PERCENT) — aucune écriture.</p>}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <Btn variant="outline" onClick={() => setView('orders')}>Voir mes commandes</Btn>
              <Btn variant="ghost" onClick={() => { setPlaced(null); setPaidInfo(null); setView('catalog'); }}>Nouvelle commande</Btn>
            </div>
          </div>
        </>
      )}

      {view === 'orders' && (
        <>
          <Header title="Mes commandes" back={() => setView('catalog')} />
          {loadingOrders ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
            : !orders || orders.length === 0 ? <Empty icon={<Package />} text="Aucune commande pour l’instant." action={<Btn onClick={() => setView('catalog')}>Parcourir le catalogue</Btn>} />
            : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">{o.order_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'cancelled' ? 'bg-red-100 text-red-700' : o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${o.payment_status === 'completed' || o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>paiement : {o.payment_status}</span>
                      <span className="ml-auto font-bold text-sm text-blue-700">{fmt(o.total)}</span>
                    </div>
                    <ul className="mt-2 text-xs text-slate-600 space-y-0.5">
                      {o.items.map((i, k) => <li key={k}>• {i.name} × {i.qty} — {fmt(i.line_total)}</li>)}
                    </ul>
                    {(o.status === 'pending' || o.status === 'confirmed') && (
                      <div className="mt-2"><button onClick={() => cancelOrder(o.id)} className="text-xs text-red-600 inline-flex items-center gap-1 hover:underline"><XCircle size={13} /> Annuler la commande</button></div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </>
      )}
    </div>
  );
};

const Empty = ({ icon, text, action }: any) => (
  <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-slate-300 rounded-xl bg-white">
    <div className="text-slate-300 mb-3 [&>svg]:w-10 [&>svg]:h-10">{icon}</div>
    <p className="text-sm text-slate-600 max-w-sm">{text}</p>
    <div className="mt-3">{action}</div>
  </div>
);

export default MechanicStoreScreen;
