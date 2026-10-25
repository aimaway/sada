import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StatusBadge } from '../shared/components';
import {
  ArrowLeft, Wallet, Shield, MapPin, Users, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, Clock, Lock, Gift, Star, Phone, MessageCircle,
  Zap, Target, Award, Banknote, TrendingDown, Eye, EyeOff, Ban
} from 'lucide-react';

// ============ MECHANIC WALLET & COMMISSION ============
export function MechanicWalletScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(15000); // in centimes (150 MAD)
  const minThreshold = 5000; // 50 MAD
  const isBlocked = balance < minThreshold;

  const ledger = [
    { id: '1', type: 'top_up', amount: 20000, balance_after: 20000, label: 'Rechargement (virement)', date: '15 Mar' },
    { id: '2', type: 'commission', amount: -2500, balance_after: 17500, label: 'Commission job #J-150', date: '16 Mar' },
    { id: '3', type: 'commission', amount: -2500, balance_after: 15000, label: 'Commission job #J-156', date: '17 Mar' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/mechanic/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Portefeuille' : 'المحفظة'}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Balance Card */}
        <div className={`rounded-2xl p-6 text-white ${isBlocked ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
          <p className="text-sm opacity-80 mb-1">{language === 'fr' ? 'Solde disponible' : 'الرصيد المتاح'}</p>
          <p className="text-4xl font-bold">{(balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isBlocked ? 'bg-red-300' : 'bg-white'}`}
                style={{ width: `${Math.min(100, (balance / (minThreshold * 4)) * 100)}%` }}
              />
            </div>
            <span className="text-xs opacity-80">Min: {(minThreshold / 100).toFixed(0)} MAD</span>
          </div>
        </div>

        {/* Blocked Warning */}
        {isBlocked && (
          <Card className="p-4 border-2 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <Ban className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  {language === 'fr' ? 'Vous êtes bloqué' : 'أنت محظور'}
                </p>
                <p className="text-xs text-red-700 mt-1">
                  {language === 'fr'
                    ? 'Votre solde est en dessous du minimum requis. Rechargez pour recevoir de nouvelles demandes.'
                    : 'رصيدك أقل من الحد الأدنى المطلوب. اشحن لتلقي طلبات جديدة.'}
                </p>
                <Button size="sm" variant="danger" className="mt-3" onClick={() => alert(language === 'fr' ? 'Redirection vers rechargement...' : 'إعادة التوجيه للشحن...')}>
                  {language === 'fr' ? 'Recharger maintenant' : 'اشحن الآن'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Commission Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Commission plateforme' : 'عمولة المنصة'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Taux de commission' : 'نسبة العمولة'}</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Minimum' : 'الحد الأدنى'}</span>
              <span className="font-medium">10 MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Maximum' : 'الحد الأقصى'}</span>
              <span className="font-medium">100 MAD</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 bg-slate-50 rounded-lg p-2">
            💡 {language === 'fr'
              ? 'La commission est déduite automatiquement de votre portefeuille après chaque job terminé.'
              : 'تُخصم العمولة تلقائياً من محفظتك بعد كل عمل منتهي.'}
          </p>
        </Card>

        {/* Ledger */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Historique' : 'السجل'}</h3>
          <div className="space-y-2">
            {ledger.map(entry => (
              <Card key={entry.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    entry.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {entry.amount > 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{entry.label}</p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                  <span className={`font-bold ${entry.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {entry.amount > 0 ? '+' : ''}{(entry.amount / 100).toFixed(0)} MAD
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Top-up info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">{language === 'fr' ? 'Comment recharger ?' : 'كيف تشحن؟'}</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>🏦 Virement bancaire</p>
            <p>💵 Espèces (agent agréé)</p>
            <p>📱 Portefeuille mobile (mWallet, Inwi Money)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ ANTI-BYPASSING FEATURES ============
export function AntiBypassingScreen() {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Sécurité & Anti-contournement' : 'الأمان ومكافحة التحايل'}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Masked Phone */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">
                {language === 'fr' ? 'Numéros masqués' : 'أرقام مخفية'}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {language === 'fr'
                  ? 'Les numéros de téléphone sont masqués jusqu\'à ce qu\'une offre soit acceptée.'
                  : 'أرقام الهاتف مخفية حتى يتم قبول العرض.'}
              </p>
              <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 font-mono">+212 6** *** ***</span>
                <EyeOff className="w-4 h-4 text-slate-400 ms-auto" />
              </div>
            </div>
          </div>
        </Card>

        {/* In-app Chat */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">
                {language === 'fr' ? 'Chat in-app obligatoire' : 'محادثة داخل التطبيق إلزامية'}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {language === 'fr'
                  ? 'Toutes les communications passent par l\'app pour garantir la traçabilité et la protection.'
                  : 'جميع الاتصالات تمر عبر التطبيق لضمان التتبع والحماية.'}
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">✓ Preuve en cas de litige</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">✓ Support modéré</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Rewards for platform completion */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">
                {language === 'fr' ? 'Récompenses fidélité' : 'مكافآت الولاء'}
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                {language === 'fr'
                  ? 'Gagnez des avantages en complétant les jobs via la plateforme :'
                  : 'اكسب مزايا بإتمام الأعمال عبر المنصة:'}
              </p>
              <div className="space-y-2">
                {[
                  { icon: <Star className="w-4 h-4" />, text: language === 'fr' ? 'Points fidélité (10 pts/MAD)' : 'نقاط الولاء (10 نقاط/درهم)' },
                  { icon: <TrendingDown className="w-4 h-4" />, text: language === 'fr' ? 'Frais réduits après 10 jobs' : 'رسوم مخفضة بعد 10 أعمال' },
                  { icon: <Shield className="w-4 h-4" />, text: language === 'fr' ? 'Garantie étendue 30 jours' : 'ضمان ممتد 30 يوم' },
                  { icon: <Award className="w-4 h-4" />, text: language === 'fr' ? 'Badge "Client/Mécanicien fiable"' : 'شارة "عميل/ميكانيكي موثوق"' },
                ].map((reward, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-amber-800">
                    {reward.icon}
                    <span>{reward.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Penalty for bypassing */}
        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                {language === 'fr' ? 'Pénalités de contournement' : 'عقوبات التحايل'}
              </h3>
              <p className="text-sm text-red-700">
                {language === 'fr'
                  ? 'Toute tentative de contourner la plateforme (partage de numéro, paiement hors app) entraîne une suspension.'
                  : 'أي محاولة للتحايل على المنصة (مشاركة الرقم، الدفع خارج التطبيق) تؤدي إلى التعليق.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ LOCAL SPECIFICS (MOROCCO) ============
export function LocalSpecificsScreen() {
  const { language } = useApp();
  const navigate = useNavigate();

  const neighborhoods = [
    { name: 'Derb Ghallef', name_ar: 'درب غلف', mechanics: 18, sellers: 12, status: 'active' },
    { name: 'Ain Sebaa', name_ar: 'عين السبع', mechanics: 15, sellers: 8, status: 'active' },
    { name: 'Maarif', name_ar: 'المعاريف', mechanics: 12, sellers: 6, status: 'active' },
    { name: 'Ain Diab', name_ar: 'عين الذئاب', mechanics: 8, sellers: 4, status: 'expanding' },
    { name: 'Anfa', name_ar: 'أنفا', mechanics: 5, sellers: 3, status: 'planned' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Spécificités Maroc' : 'خصوصيات المغرب'}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Currency & Plates */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-xl">🇲🇦</span>
            {language === 'fr' ? 'Format local' : 'التنسيق المحلي'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? 'Devise' : 'العملة'}</p>
                <p className="text-xs text-slate-500">Dirham marocain</p>
              </div>
              <span className="text-lg font-bold text-emerald-600">MAD</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? 'Format plaque' : 'تنسيق اللوحة'}</p>
                <p className="text-xs text-slate-500">{language === 'fr' ? 'Format marocain' : 'التنسيق المغربي'}</p>
              </div>
              <span className="text-sm font-mono font-bold text-slate-700">12345-A-1</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? 'Langues' : 'اللغات'}</p>
                <p className="text-xs text-slate-500">{language === 'fr' ? 'Support multilingue' : 'دعم متعدد اللغات'}</p>
              </div>
              <div className="flex gap-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">FR</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">AR</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">DARIJA</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Local Suppliers */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-xl">🏪</span>
            {language === 'fr' ? 'Fournisseurs locaux' : 'الموردون المحليون'}
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            {language === 'fr'
              ? 'Partenaires dans les quartiers clés de Casablanca :'
              : 'شركاء في أحياء الدار البيضاء الرئيسية:'}
          </p>
          <div className="space-y-2">
            {[
              { name: 'AutoPièces Derb Ghallef', area: 'Derb Ghallef', specialty: 'Toutes pièces', rating: 4.7 },
              { name: 'PneusExpress Ain Sebaa', area: 'Ain Sebaa', specialty: 'Pneus & jantes', rating: 4.5 },
              { name: 'BatteryKing Maroc', area: 'Maarif', specialty: 'Batteries', rating: 4.8 },
            ].map((supplier, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏪</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{supplier.name}</p>
                  <p className="text-xs text-slate-500">{supplier.area} • {supplier.specialty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{supplier.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cold Start Strategy */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            {language === 'fr' ? 'Stratégie Cold Start' : 'استراتيجية البداية'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? 'Phase 1 : 2-3 quartiers' : 'المرحلة 1: 2-3 أحياء'}</p>
                <p className="text-xs text-slate-600">Derb Ghallef, Ain Sebaa, Maarif</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? '30-50 mécaniciens vérifiés' : '30-50 ميكانيكي موثق'}</p>
                <p className="text-xs text-slate-600">{language === 'fr' ? 'Sélection rigoureuse, formation' : 'اختيار دقيق، تدريب'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'fr' ? 'Expansion ville entière' : 'التوسع للمدينة كاملة'}</p>
                <p className="text-xs text-slate-600">{language === 'fr' ? 'Après validation du modèle' : 'بعد التحقق من النموذج'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Neighborhood Map */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Couverture par quartier' : 'التغطية حسب الحي'}</h3>
          <div className="space-y-2">
            {neighborhoods.map((hood, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {language === 'fr' ? hood.name : hood.name_ar}
                  </p>
                  <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                    <span>🔧 {hood.mechanics} {language === 'fr' ? 'mécaniciens' : 'ميكانيكي'}</span>
                    <span>🏪 {hood.sellers} {language === 'fr' ? 'vendeurs' : 'بائع'}</span>
                  </div>
                </div>
                <StatusBadge
                  status={hood.status}
                  label={hood.status === 'active' ? (language === 'fr' ? 'Actif' : 'نشط') :
                         hood.status === 'expanding' ? (language === 'fr' ? 'Expansion' : 'توسع') :
                         (language === 'fr' ? 'Planifié' : 'مخطط')}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
