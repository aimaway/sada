import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StarRating } from '../shared/components';
import { mockUsers } from '../shared/unifiedMockData';
import { ArrowLeft, Shield, MapPin, Clock, Award, Zap, Star, Briefcase, Languages, Wrench, Settings, Power, PowerOff, Camera, Edit, CheckCircle2 } from 'lucide-react';

export function MechanicProfileDetail() {
  const { language, user } = useApp();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  
  const mechanic = mockUsers.mechanics[0];
  const profile = mechanic.profile;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/mechanic/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800 flex-1">
          {language === 'fr' ? 'Mon Profil' : 'ملفي الشخصي'}
        </h1>
        <button onClick={() => navigate('/mechanic/profile-settings')} className="p-2 rounded-xl bg-slate-100">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-6 text-center">
          <div className="relative inline-block">
            <Avatar name={mechanic.full_name} size="lg" />
            {profile.verification_status === 'approved' && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-3 border-white">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">{mechanic.full_name}</h2>
          <p className="text-sm text-slate-500">{mechanic.phone}</p>
          
          {/* Online Status */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isOnline ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {isOnline ? (language === 'fr' ? 'En ligne' : 'متصل') : (language === 'fr' ? 'Hors ligne' : 'غير متصل')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{profile.rating_avg}</p>
              <StarRating rating={profile.rating_avg} />
              <p className="text-xs text-slate-500 mt-1">{language === 'fr' ? 'Note' : 'تقييم'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{profile.jobs_completed}</p>
              <p className="text-xs text-slate-500 mt-1">{language === 'fr' ? 'Jobs' : 'أعمال'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{profile.completion_rate}%</p>
              <p className="text-xs text-slate-500 mt-1">{language === 'fr' ? 'Complétion' : 'إنجاز'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{profile.response_time_min}</p>
              <p className="text-xs text-slate-500 mt-1">{language === 'fr' ? 'Min réponse' : 'دقائق الرد'}</p>
            </div>
          </div>
        </Card>

        {/* Experience & Specialties */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            {language === 'fr' ? 'Expérience & Spécialités' : 'الخبرة والتخصصات'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{language === 'fr' ? 'Années d\'expérience' : 'سنوات الخبرة'}</span>
              <span className="text-sm font-medium text-slate-800">{profile.years_experience} {language === 'fr' ? 'ans' : 'سنوات'}</span>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">{language === 'fr' ? 'Marques' : 'الماركات'}</p>
              <div className="flex flex-wrap gap-2">
                {profile.brands.map(brand => (
                  <span key={brand} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{brand}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">{language === 'fr' ? 'Spécialités' : 'التخصصات'}</p>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map(spec => (
                  <span key={spec} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Service Area */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Zone de service' : 'منطقة الخدمة'}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{language === 'fr' ? 'Ville' : 'المدينة'}</span>
              <span className="text-sm font-medium text-slate-800">{profile.city}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{language === 'fr' ? 'Rayon' : 'نطاق'}</span>
              <span className="text-sm font-medium text-slate-800">{profile.service_radius_km} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{language === 'fr' ? 'Position' : 'الموقع'}</span>
              <span className="text-xs text-slate-500 font-mono">{profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}</span>
            </div>
          </div>
        </Card>

        {/* Languages */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600" />
            {language === 'fr' ? 'Langues parlées' : 'اللغات'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map(lang => (
              <span key={lang} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium">{lang}</span>
            ))}
          </div>
        </Card>

        {/* Verifications */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Vérifications' : 'التوثيقات'}
          </h3>
          <div className="space-y-2">
            {Object.entries(profile.verifications).map(([key, value]) => {
              const labels: Record<string, { fr: string; ar: string }> = {
                id_card: { fr: 'Carte d\'identité', ar: 'بطاقة الهوية' },
                workshop: { fr: 'Atelier vérifié', ar: 'ورشة موثقة' },
                certificates: { fr: 'Certificats', ar: 'شهادات' },
                references: { fr: 'Références', ar: 'مراجع' },
                insurance: { fr: 'Assurance pro', ar: 'تأمين مهني' },
              };
              const label = labels[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={`text-sm ${value ? 'text-slate-800' : 'text-slate-400'}`}>
                    {language === 'fr' ? label.fr : label.ar}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            {language === 'fr' ? 'Services proposés' : 'الخدمات المقدمة'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.categories.map(catId => {
              const cat = ['🔋 Batterie', '🛢️ Vidange', '🔧 Freins', '🛞 Pneus'][parseInt(catId) - 1];
              return (
                <span key={catId} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">{cat}</span>
              );
            })}
          </div>
        </Card>

        {/* Warranty */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {language === 'fr' ? `Garantie ${profile.warranty_days} jours` : `ضمان ${profile.warranty_days} يوم`}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {language === 'fr'
                  ? 'Tous vos travaux sont garantis. En cas de problème, le client peut demander une reprise gratuite.'
                  : 'جميع أعمالك مضمونة. في حالة وجود مشكلة، يمكن للعميل طلب إعادة مجانية.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Edit Profile Button */}
        <Button fullWidth size="lg" onClick={() => navigate('/mechanic/profile-settings')}>
          <Edit className="w-4 h-4 me-2" />
          {language === 'fr' ? 'Modifier le profil' : 'تعديل الملف الشخصي'}
        </Button>
      </div>
    </div>
  );
}

export function MechanicProfileSettings() {
  const { language } = useApp();
  const navigate = useNavigate();
  const mechanic = mockUsers.mechanics[0];
  const profile = mechanic.profile;

  const [serviceRadius, setServiceRadius] = useState(profile.service_radius_km);
  const [warrantyDays, setWarrantyDays] = useState(profile.warranty_days);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/mechanic/profile')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800 flex-1">
          {language === 'fr' ? 'Paramètres du profil' : 'إعدادات الملف الشخصي'}
        </h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Service Radius */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Rayon de service' : 'نطاق الخدمة'}
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="3"
              max="25"
              value={serviceRadius}
              onChange={e => setServiceRadius(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-bold text-slate-800 w-16 text-center">{serviceRadius} km</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {language === 'fr' ? 'Distance maximale pour recevoir des demandes' : 'المسافة القصوى لتلقي الطلبات'}
          </p>
        </Card>

        {/* Warranty */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Garantie offerte' : 'الضمان المقدم'}
          </h3>
          <div className="flex gap-2">
            {[7, 15, 30, 60].map(days => (
              <button
                key={days}
                onClick={() => setWarrantyDays(days)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  warrantyDays === days
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {days}j
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {language === 'fr' ? 'Une garantie plus longue attire plus de clients' : 'ضمان أطول يجذب المزيد من العملاء'}
          </p>
        </Card>

        {/* Categories */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            {language === 'fr' ? 'Services proposés' : 'الخدمات المقدمة'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['🔋 Batterie', '🛢️ Vidange', '🔧 Freins', '🛞 Pneus'].map((cat, i) => (
              <label key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-sm text-slate-700">{cat}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Brands */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">
            {language === 'fr' ? 'Marques spécialisées' : 'الماركات المتخصصة'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Toyota', 'Dacia', 'Renault', 'Peugeot', 'BMW', 'Mercedes'].map(brand => (
              <label key={brand} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <input type="checkbox" defaultChecked={['Toyota', 'Dacia', 'Renault'].includes(brand)} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-sm text-slate-700">{brand}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Languages */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600" />
            {language === 'fr' ? 'Langues parlées' : 'اللغات'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Darija', 'Français', 'العربية', 'English'].map(lang => (
              <label key={lang} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <input type="checkbox" defaultChecked={['Darija', 'Français', 'العربية'].includes(lang)} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-sm text-slate-700">{lang}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <Button fullWidth size="lg" onClick={() => {
          alert(language === 'fr' ? 'Paramètres enregistrés !' : 'تم حفظ الإعدادات!');
          navigate('/mechanic/profile');
        }}>
          {language === 'fr' ? 'Enregistrer' : 'حفظ'}
        </Button>
      </div>
    </div>
  );
}
