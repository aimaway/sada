import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import {
  ArrowLeft, Camera, Mic, Image as ImageIcon, Zap, AlertTriangle,
  CheckCircle2, Clock, DollarSign, Sparkles, Volume2
} from 'lucide-react';

// AI Problem Assistant
export function AIAssistantScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [inputType, setInputType] = useState<'photo' | 'sound' | 'light'>('photo');

  const handleAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 2000);
  };

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {language === 'fr' ? 'Analyse en cours...' : 'جاري التحليل...'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'fr' ? 'Notre IA examine votre problème' : 'ذكاءنا الاصطناعي يفحص مشكلتك'}
          </p>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
          <button onClick={() => setStep('input')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Résultat' : 'النتيجة'}</h1>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Diagnosis */}
          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">
                  {language === 'fr' ? 'Diagnostic probable' : 'التشخيص المحتمل'}
                </h3>
                <p className="text-sm text-slate-700">
                  {language === 'fr'
                    ? 'Batterie déchargée ou en fin de vie. Les symptômes correspondent à une batterie de plus de 3 ans.'
                    : 'بطارية فارغة أو في نهاية عمرها. الأعراض تتطابق مع بطارية عمرها أكثر من 3 سنوات.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Confidence */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {language === 'fr' ? 'Niveau de confiance' : 'مستوى الثقة'}
              </span>
              <span className="text-sm font-bold text-emerald-600">87%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '87%' }} />
            </div>
          </Card>

          {/* Price range */}
          <Card className="p-4">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              {language === 'fr' ? 'Fourchette de prix estimée' : 'نطاق السعر المقدر'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{language === 'fr' ? 'Minimum' : 'الحد الأدنى'}</p>
                <p className="text-2xl font-bold text-slate-800">200</p>
                <p className="text-xs text-slate-500">MAD</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{language === 'fr' ? 'Maximum' : 'الحد الأقصى'}</p>
                <p className="text-2xl font-bold text-slate-800">350</p>
                <p className="text-xs text-slate-500">MAD</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              {language === 'fr' ? 'Basé sur 145 interventions similaires à Casablanca' : 'بناءً على 145 تدخل مشابه في الدار البيضاء'}
            </p>
          </Card>

          {/* Urgency */}
          <Card className="p-4 border-2 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {language === 'fr' ? 'Niveau d\'urgence : Modéré' : 'مستوى الاستعجال: متوسط'}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {language === 'fr'
                    ? 'Vous pouvez encore conduire quelques jours, mais ne tardez pas à faire vérifier la batterie.'
                    : 'لا يزال بإمكانك القيادة لبضعة أيام، لكن لا تتأخر في فحص البطارية.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button fullWidth size="lg" onClick={() => navigate('/customer/new-request')}>
              {language === 'fr' ? 'Créer une demande avec ces infos' : 'إنشاء طلب بهذه المعلومات'}
            </Button>
            <Button fullWidth variant="outline" onClick={() => setStep('input')}>
              {language === 'fr' ? 'Réanalyser' : 'إعادة التحليل'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">
          {language === 'fr' ? 'Assistant IA' : 'المساعد الذكي'}
        </h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {language === 'fr' ? 'Décrivez votre problème' : 'صف مشكلتك'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'fr'
              ? 'Notre IA analyse et vous donne un diagnostic + estimation de prix'
              : 'ذكاءنا الاصطناعي يحلل ويعطيك تشخيص + تقدير السعر'}
          </p>
        </div>

        {/* Input type selector */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">
            {language === 'fr' ? 'Comment décrire le problème ?' : 'كيف تصف المشكلة؟'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'photo', icon: <Camera className="w-6 h-6" />, label: language === 'fr' ? 'Photo' : 'صورة' },
              { id: 'sound', icon: <Mic className="w-6 h-6" />, label: language === 'fr' ? 'Son' : 'صوت' },
              { id: 'light', icon: <Zap className="w-6 h-6" />, label: language === 'fr' ? 'Voyant' : 'مصباح' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setInputType(type.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  inputType === type.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`mx-auto mb-2 ${inputType === type.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {type.icon}
                </div>
                <p className={`text-xs font-medium text-center ${inputType === type.id ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {type.label}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Upload area */}
        <Card className="p-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            {inputType === 'photo' && (
              <>
                <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-1">
                  {language === 'fr' ? 'Prenez une photo du problème' : 'التقط صورة للمشكلة'}
                </p>
                <p className="text-xs text-slate-400">
                  {language === 'fr' ? 'Tableau de bord, moteur, pièce endommagée...' : 'لوحة القيادة، المحرك، قطعة تالفة...'}
                </p>
              </>
            )}
            {inputType === 'sound' && (
              <>
                <Mic className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-1">
                  {language === 'fr' ? 'Enregistrez le bruit' : 'سجل الصوت'}
                </p>
                <p className="text-xs text-slate-400">
                  {language === 'fr' ? 'Craquement, grincement, claquement...' : 'طقطقة، صرير، نقر...'}
                </p>
              </>
            )}
            {inputType === 'light' && (
              <>
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-1">
                  {language === 'fr' ? 'Photographiez le voyant' : 'صور المصباح'}
                </p>
                <p className="text-xs text-slate-400">
                  {language === 'fr' ? 'Pointez la caméra vers le symbole' : 'وجه الكاميرا نحو الرمز'}
                </p>
              </>
            )}
            <Button className="mt-4" onClick={handleAnalyze}>
              {language === 'fr' ? 'Uploader' : 'رفع'}
            </Button>
          </div>
        </Card>

        {/* Or describe */}
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-2">
            {language === 'fr' ? 'Ou décrivez en texte' : 'أو صف بالنص'}
          </h4>
          <textarea
            placeholder={language === 'fr' ? 'Ex: Ma voiture fait un bruit de grincement quand je freine...' : 'مثال: سيارتي تصدر صوت صرير عندما أكبح...'}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none h-20 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button fullWidth className="mt-3" onClick={handleAnalyze}>
            {language === 'fr' ? 'Analyser' : 'تحليل'}
          </Button>
        </Card>

        {/* Voice input (Darija) */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {language === 'fr' ? 'Entrée vocale en Darija' : 'إدخال صوتي بالدارجة'}
              </p>
              <p className="text-xs text-slate-600">
                {language === 'fr' ? 'Parlez en Darija, Arabe ou Français' : 'تحدث بالدارجة، العربية أو الفرنسية'}
              </p>
            </div>
            <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dashboard Warning Light Scanner
export function WarningLightScanner() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult({
        name: language === 'fr' ? 'Voyant moteur (Check Engine)' : 'مصباح المحرك',
        icon: '⚠️',
        description: language === 'fr'
          ? 'Le voyant moteur indique un problème dans le système d\'injection ou d\'allumage. Ce n\'est pas critique immédiatement, mais doit être vérifié sous 1-2 semaines.'
          : 'يشير مصباح المحرك إلى مشكلة في نظام الحقن أو الإشعال. ليس حرجاً فوراً، لكن يجب فحصه خلال 1-2 أسبوع.',
        urgency: 'medium',
        urgencyLabel: language === 'fr' ? 'Modéré' : 'متوسط',
        estimatedCost: '200-500 MAD',
        action: language === 'fr' ? 'Prendre rendez-vous chez un mécanicien cette semaine' : 'حدد موعد مع ميكانيكي هذا الأسبوع',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => navigate('/customer/ai-assistant')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">
          {language === 'fr' ? 'Scanner de voyants' : 'ماسح المصابيح'}
        </h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {!result ? (
          <>
            {/* Camera viewfinder */}
            <Card className="overflow-hidden">
              <div className="bg-slate-900 h-64 flex items-center justify-center relative">
                {scanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-sm">{language === 'fr' ? 'Analyse du symbole...' : 'تحليل الرمز...'}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-white text-sm">
                      {language === 'fr' ? 'Pointez la caméra vers le voyant' : 'وجه الكاميرا نحو المصباح'}
                    </p>
                  </div>
                )}
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
              </div>
            </Card>

            <Button fullWidth size="lg" onClick={handleScan} disabled={scanning}>
              {scanning 
                ? (language === 'fr' ? 'Analyse en cours...' : 'جاري التحليل...')
                : (language === 'fr' ? 'Scanner le voyant' : 'مسح المصباح')}
            </Button>

            {/* Common lights */}
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800 mb-3">
                {language === 'fr' ? 'Voyants courants' : 'المصابيح الشائعة'}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: '🛢️', label: language === 'fr' ? 'Huile' : 'زيت' },
                  { icon: '🔋', label: language === 'fr' ? 'Batterie' : 'بطارية' },
                  { icon: '🌡️', label: language === 'fr' ? 'Temp.' : 'حرارة' },
                  { icon: '⚠️', label: language === 'fr' ? 'Moteur' : 'محرك' },
                  { icon: '🛞', label: language === 'fr' ? 'TPMS' : 'إطارات' },
                  { icon: '🔧', label: language === 'fr' ? 'Service' : 'صيانة' },
                  { icon: '💧', label: language === 'fr' ? 'Freins' : 'فرامل' },
                  { icon: '🔌', label: language === 'fr' ? 'ABS' : 'ABS' },
                ].map((light, i) => (
                  <button key={i} className="text-center">
                    <div className="text-2xl mb-1">{light.icon}</div>
                    <p className="text-[10px] text-slate-600">{light.label}</p>
                  </button>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Result */}
            <Card className="p-6 text-center">
              <div className="text-6xl mb-3">{result.icon}</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{result.name}</h2>
              <p className="text-sm text-slate-600">{result.description}</p>
            </Card>

            {/* Urgency */}
            <Card className={`p-4 border-2 ${
              result.urgency === 'high' ? 'border-red-200 bg-red-50' :
              result.urgency === 'medium' ? 'border-amber-200 bg-amber-50' :
              'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${
                  result.urgency === 'high' ? 'text-red-600' :
                  result.urgency === 'medium' ? 'text-amber-600' :
                  'text-green-600'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {language === 'fr' ? 'Urgence :' : 'الاستعجال:'} {result.urgencyLabel}
                  </p>
                  <p className="text-xs text-slate-600">{result.action}</p>
                </div>
              </div>
            </Card>

            {/* Estimated cost */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{language === 'fr' ? 'Coût estimé' : 'التكلفة المقدرة'}</span>
                <span className="text-lg font-bold text-slate-800">{result.estimatedCost}</span>
              </div>
            </Card>

            <Button fullWidth size="lg" onClick={() => navigate('/customer/new-request')}>
              {language === 'fr' ? 'Trouver un mécanicien' : 'ابحث عن ميكانيكي'}
            </Button>
            <Button fullWidth variant="outline" onClick={() => setResult(null)}>
              {language === 'fr' ? 'Scanner un autre voyant' : 'مسح مصباح آخر'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
