import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StarRating, PriceDisplay } from '../shared/components';
import {
  ArrowLeft, MapPin, Navigation, Phone, MessageCircle, Share2, Camera,
  CheckCircle2, Clock, AlertTriangle, Package, ChevronRight, Star,
  FileText, Download, CreditCard, Banknote, Smartphone, Gift, Copy, Check
} from 'lucide-react';

// F. Live Job Tracking - Enhanced
export function LiveTrackingScreen() {
  const toast = useToast();
  const { language } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // 0=accepted, 1=on_way, 2=arrived, 3=diagnosing, 4=in_progress, 5=completed
  const [showPriceChange, setShowPriceChange] = useState(false);
  const [showOrderPart, setShowOrderPart] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const steps = [
    { id: 0, label: language === 'fr' ? 'Accepté' : 'مقبول', icon: '✅', color: 'bg-emerald-500' },
    { id: 1, label: language === 'fr' ? 'En route' : 'في الطريق', icon: '🚗', color: 'bg-blue-500' },
    { id: 2, label: language === 'fr' ? 'Arrivé' : 'وصل', icon: '📍', color: 'bg-indigo-500' },
    { id: 3, label: language === 'fr' ? 'Diagnostic' : 'تشخيص', icon: '🔍', color: 'bg-amber-500' },
    { id: 4, label: language === 'fr' ? 'En cours' : 'جاري', icon: '🔧', color: 'bg-purple-500' },
    { id: 5, label: language === 'fr' ? 'Terminé' : 'منتهي', icon: '✨', color: 'bg-emerald-600' },
  ];

  const handleShareTrip = () => {
    setShowShareLink(true);
    setTimeout(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/customer/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-800 text-sm">
            {language === 'fr' ? 'Suivi en direct' : 'التتبع المباشر'}
          </h1>
          <p className="text-xs text-emerald-600">🟢 {steps[currentStep].label}</p>
        </div>
        <button onClick={handleShareTrip} className="p-2 rounded-xl bg-slate-100">
          <Share2 className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Live Map */}
      <div className="relative h-56 bg-gradient-to-br from-blue-100 via-emerald-50 to-blue-100 overflow-hidden">
        {/* Map decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-8 left-12 w-32 h-1 bg-slate-300/50 rounded" />
          <div className="absolute top-20 left-8 w-48 h-1 bg-slate-300/50 rounded rotate-12" />
          <div className="absolute top-32 right-12 w-36 h-1 bg-slate-300/50 rounded -rotate-6" />
          <div className="absolute bottom-16 left-20 w-40 h-1 bg-slate-300/50 rounded rotate-3" />
        </div>
        
        {/* Mechanic marker */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
            <span className="text-white text-sm font-bold">🔧</span>
          </div>
        </div>
        
        {/* Customer marker */}
        <div className="absolute bottom-8 right-12">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white text-xs">📍</span>
          </div>
        </div>

        {/* ETA overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-xs text-slate-500">ETA</p>
              <p className="text-sm font-bold text-slate-800">12 min</p>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
          <p className="text-xs font-medium text-slate-700">{steps[currentStep].icon} {steps[currentStep].label}</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stepper */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    i <= currentStep ? step.color + ' text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {i <= currentStep ? <CheckCircle2 className="w-4 h-4" /> : <span>{i + 1}</span>}
                  </div>
                  <span className={`text-[9px] mt-1 text-center max-w-[40px] ${
                    i <= currentStep ? 'text-slate-700 font-medium' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-0.5 mb-4 ${i < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Mechanic info */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Ahmed Benali" size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800">Ahmed Benali</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                  ✓ {language === 'fr' ? 'Vérifié' : 'موثق'}
                </span>
              </div>
              <StarRating rating={4.8} />
              <p className="text-xs text-slate-500 mt-0.5">145 jobs • 8 ans d'expérience</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-emerald-700" />
              </button>
              <button onClick={() => navigate('/customer/negotiation')} className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-700" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {language === 'fr' ? 'Appel masqué (numéro protégé)' : 'مكالمة مخفية (رقم محمي)'}
          </p>
        </Card>

        {/* Price change request */}
        {currentStep >= 3 && (
          <Card className="p-4 border-2 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  {language === 'fr' ? 'Demande de changement de prix' : 'طلب تغيير السعر'}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {language === 'fr' 
                    ? 'Le mécanicien a détecté un problème supplémentaire et propose un ajustement.'
                    : 'اكتشف الميكانيكي مشكلة إضافية ويقترح تعديلاً.'}
                </p>
                <div className="bg-white rounded-lg p-3 mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{language === 'fr' ? 'Prix initial' : 'السعر الأولي'}</span>
                    <span className="font-medium">250 MAD</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">+ {language === 'fr' ? 'Fusible principal' : 'فيوز رئيسي'}</span>
                    <span className="font-medium">+80 MAD</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                    <span>{language === 'fr' ? 'Nouveau total' : 'المجموع الجديد'}</span>
                    <span className="text-amber-700">330 MAD</span>
                  </div>
                </div>
                {/* Photo proof */}
                <div className="flex gap-2 mt-2">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 self-center">
                    {language === 'fr' ? '📷 Preuves photos' : '📷 صور إثبات'}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1" onClick={() => toast(language === 'fr' ? 'Prix approuvé !' : 'تم الموافقة على السعر!')}>
                    {language === 'fr' ? 'Approuver' : 'موافقة'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast(language === 'fr' ? 'Refusé' : 'مرفوض')}>
                    {language === 'fr' ? 'Refuser' : 'رفض'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Order part mid-job */}
        {currentStep >= 3 && currentStep < 5 && (
          <Card className="p-4 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800">
                  {language === 'fr' ? 'Besoin d\'une pièce ?' : 'تحتاج قطعة؟'}
                </p>
                <p className="text-xs text-blue-700">
                  {language === 'fr' 
                    ? 'Commandez depuis un vendeur partenaire, livré sur place en 30 min'
                    : 'اطلب من بائع شريك، يوصل للمكان في 30 دقيقة'}
                </p>
              </div>
              <Button size="sm" onClick={() => setShowOrderPart(true)}>
                {language === 'fr' ? 'Commander' : 'اطلب'}
              </Button>
            </div>
          </Card>
        )}

        {/* Price breakdown */}
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Détail du prix' : 'تفاصيل السعر'}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Main d\'œuvre' : 'يد عاملة'}</span>
              <span className="font-medium">150 MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Pièces (batterie Bosch)' : 'قطع (بطارية بوش)'}</span>
              <span className="font-medium">100 MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Frais de service' : 'رسوم الخدمة'}</span>
              <span className="font-medium text-slate-400">25 MAD</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-2">
              <span>{language === 'fr' ? 'Total' : 'المجموع'}</span>
              <span className="text-emerald-600">275 MAD</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => navigate('/customer/home')}>
            {language === 'fr' ? 'Annuler' : 'إلغاء'}
          </Button>
          <Button onClick={() => {
            if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
            else navigate('/customer/payment');
          }}>
            {currentStep < steps.length - 1 
              ? (language === 'fr' ? 'Simuler →' : 'محاكاة →')
              : (language === 'fr' ? 'Payer' : 'دفع')}
          </Button>
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareLink && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              {language === 'fr' ? 'Partager le trajet' : 'مشاركة الرحلة'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {language === 'fr' 
                ? 'Envoyez ce lien à un proche pour qu\'il puisse suivre en temps réel'
                : 'أرسل هذا الرابط لأحد أقربائك لمتابعة الرحلة مباشرة'}
            </p>
            <div className="bg-slate-100 rounded-xl p-3 flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500 flex-1 truncate">tomobily.app/track/abc123xyz</span>
              <button onClick={() => setLinkCopied(true)} className="p-2 bg-white rounded-lg">
                {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="bg-green-500 text-white rounded-xl py-3 text-sm font-medium">WhatsApp</button>
              <button className="bg-blue-500 text-white rounded-xl py-3 text-sm font-medium">SMS</button>
              <button className="bg-slate-200 text-slate-700 rounded-xl py-3 text-sm font-medium">
                {language === 'fr' ? 'Autre' : 'آخر'}
              </button>
            </div>
            <Button fullWidth variant="outline" onClick={() => setShowShareLink(false)}>
              {language === 'fr' ? 'Fermer' : 'إغلاق'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// G. Payment and Receipt
export function PaymentScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [tipAmount, setTipAmount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  const subtotal = 275;
  const total = subtotal + tipAmount;

  const handlePay = () => {
    setShowReceipt(true);
  };

  if (showReceipt) {
    return <ReceiptScreen total={total} onDone={() => navigate('/customer/rate')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Paiement' : 'الدفع'}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Amount */}
        <Card className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-1">{language === 'fr' ? 'Montant à payer' : 'المبلغ الواجب دفعه'}</p>
          <p className="text-4xl font-bold text-slate-800">{total} <span className="text-lg text-slate-400">MAD</span></p>
        </Card>

        {/* Breakdown */}
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Détail transparent' : 'تفاصيل شفافة'}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Main d\'œuvre' : 'يد عاملة'}</span>
              <span>150 MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Pièces' : 'قطع'}</span>
              <span>100 MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{language === 'fr' ? 'Frais de service (plateforme)' : 'رسوم الخدمة (المنصة)'}</span>
              <span className="text-slate-400">25 MAD</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{language === 'fr' ? 'Pourboire' : 'إكرامية'}</span>
                <span className="text-emerald-600">+{tipAmount} MAD</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t pt-2">
              <span>Total</span>
              <span>{total} MAD</span>
            </div>
          </div>
        </Card>

        {/* Payment methods */}
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Méthode de paiement' : 'طريقة الدفع'}</h4>
          <div className="space-y-2">
            {[
              { id: 'cash', icon: <Banknote className="w-5 h-5" />, label: language === 'fr' ? 'Espèces' : 'نقداً', desc: language === 'fr' ? 'Payer en main propre' : 'الدفع يد بيد' },
              { id: 'card', icon: <CreditCard className="w-5 h-5" />, label: language === 'fr' ? 'Carte (CMI)' : 'بطاقة (CMI)', desc: 'Visa, Mastercard' },
              { id: 'wallet', icon: <Smartphone className="w-5 h-5" />, label: language === 'fr' ? 'Portefeuille mobile' : 'محفظة هاتف', desc: 'mWallet, Inwi Money' },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  paymentMethod === method.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {method.icon}
                </div>
                <div className="text-start flex-1">
                  <p className="text-sm font-medium text-slate-800">{method.label}</p>
                  <p className="text-xs text-slate-500">{method.desc}</p>
                </div>
                {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Tip */}
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" />
            {language === 'fr' ? 'Pourboire (optionnel)' : 'إكرامية (اختياري)'}
          </h4>
          <div className="flex gap-2">
            {[0, 10, 20, 50].map(amount => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tipAmount === amount
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {amount === 0 ? (language === 'fr' ? 'Aucun' : 'بدون') : `+${amount}`}
              </button>
            ))}
          </div>
        </Card>

        {/* Pay button */}
        <Button fullWidth size="lg" onClick={handlePay}>
          {language === 'fr' ? `Payer ${total} MAD` : `دفع ${total} درهم`}
        </Button>
      </div>
    </div>
  );
}

// Receipt Screen
function ReceiptScreen({ total, onDone }: { total: number; onDone: () => void }) {
  const toast = useToast();
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {language === 'fr' ? 'Paiement réussi !' : '!تم الدفع بنجاح'}
        </h2>
        <p className="text-slate-500 mb-8">{total} MAD</p>

        {/* Receipt card */}
        <Card className="w-full max-w-sm p-4 mb-6">
          <div className="text-center mb-3 pb-3 border-b border-dashed border-slate-200">
            <p className="font-bold text-slate-800">TomoBily</p>
            <p className="text-xs text-slate-500">Reçu #{Date.now().toString().slice(-8)}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Service' : 'خدمة'}</span>
              <span>Remplacement batterie</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Mécanicien' : 'ميكانيكي'}</span>
              <span>Ahmed B.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{language === 'fr' ? 'Date' : 'تاريخ'}</span>
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>{total} MAD</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-3 w-full max-w-sm">
          <Button variant="outline" className="flex-1" onClick={() => toast('PDF téléchargé')}>
            <Download className="w-4 h-4 me-2" /> PDF
          </Button>
          <Button className="flex-1" onClick={onDone}>
            {language === 'fr' ? 'Noter' : 'تقييم'} →
          </Button>
        </div>
      </div>
    </div>
  );
}

// I. Orders Tab
export function OrdersTab() {
  const toast = useToast();
  const { language } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'history'>('active');

  const activeOrders = [
    { id: 'J-156', category: '🔋', name: 'Batterie', mechanic: 'Ahmed B.', price: 275, status: 'in_progress', date: 'Aujourd\'hui 14:30' },
  ];

  const scheduledOrders = [
    { id: 'J-160', category: '🛢️', name: 'Vidange', mechanic: 'Karim T.', price: 400, status: 'scheduled', date: 'Demain 10:00' },
  ];

  const historyOrders = [
    { id: 'J-150', category: '🔋', name: 'Batterie', mechanic: 'Ahmed B.', price: 250, status: 'completed', date: '10 Mar' },
    { id: 'J-145', category: '🛢️', name: 'Vidange', mechanic: 'Karim T.', price: 400, status: 'completed', date: '25 Fév' },
    { id: 'J-140', category: '🛞', name: 'Pneus', mechanic: 'Youssef E.', price: 1360, status: 'completed', date: '15 Fév' },
    { id: 'J-135', category: '🔧', name: 'Freins', mechanic: 'Ahmed B.', price: 480, status: 'completed', date: '5 Fév' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Mes Commandes' : 'طلباتي'}</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 flex gap-1">
        {[
          { id: 'active', label: language === 'fr' ? 'En cours' : 'جارية', count: activeOrders.length },
          { id: 'scheduled', label: language === 'fr' ? 'Planifiées' : 'مجدولة', count: scheduledOrders.length },
          { id: 'history', label: language === 'fr' ? 'Historique' : 'السجل', count: historyOrders.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {activeTab === 'active' && activeOrders.map(order => (
          <Card key={order.id} className="p-4" onClick={() => navigate('/customer/tracking')}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{order.category}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{order.name}</p>
                <p className="text-xs text-slate-500">{order.mechanic} • {order.date}</p>
              </div>
              <div className="text-end">
                <PriceDisplay amount={order.price} size="sm" />
                <StatusBadge status={order.status} label={language === 'fr' ? 'En cours' : 'جارية'} />
              </div>
            </div>
          </Card>
        ))}

        {activeTab === 'scheduled' && scheduledOrders.map(order => (
          <Card key={order.id} className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{order.category}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{order.name}</p>
                <p className="text-xs text-slate-500">{order.mechanic} • {order.date}</p>
              </div>
              <div className="text-end">
                <PriceDisplay amount={order.price} size="sm" />
                <StatusBadge status="open" label={language === 'fr' ? 'Planifié' : 'مجدول'} />
              </div>
            </div>
          </Card>
        ))}

        {activeTab === 'history' && historyOrders.map(order => (
          <Card key={order.id} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{order.category}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{order.name}</p>
                <p className="text-xs text-slate-500">{order.mechanic} • {order.date}</p>
              </div>
              <div className="text-end">
                <PriceDisplay amount={order.price} size="sm" />
                <StatusBadge status="completed" label={language === 'fr' ? 'Terminé' : 'منتهي'} />
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast('Reçu PDF')}>
                <FileText className="w-3 h-3 me-1" /> {language === 'fr' ? 'Reçu' : 'وصل'}
              </Button>
              <Button size="sm" className="flex-1" onClick={() => navigate('/customer/new-request')}>
                🔄 {language === 'fr' ? 'Rebooker' : 'إعادة'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    scheduled: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}
