import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, MessageCircle, CheckCircle2, Share2 } from 'lucide-react';

export const OnBehalfRequest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [beneficiary, setBeneficiary] = useState({ name: '', phone: '', email: '' });
  const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: '', plate: '' });
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [shareLink, setShareLink] = useState('');

  const serviceTypes = [
    { id: 'repair', label: 'Réparation', icon: '🔧' },
    { id: 'maintenance', label: 'Entretien', icon: '🛠️' },
    { id: 'inspection', label: 'Inspection', icon: '🔍' },
    { id: 'emergency', label: 'Urgence', icon: '🚨' },
  ];

  const handleSubmit = () => {
    const mockShareLink = `https://mecago.app/on-behalf/abc123xyz`;
    setShareLink(mockShareLink);
    setStep(4);
  };

  const handleShare = (platform: string) => {
    const message = `Bonjour ${beneficiary.name}, j'ai demandé une réparation pour votre véhicule via MécaCasablanca. Cliquez ici pour partager votre localisation et approuver le devis : ${shareLink}`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/${beneficiary.phone}?text=${encodeURIComponent(message)}`);
    } else if (platform === 'sms') {
      window.open(`sms:${beneficiary.phone}?body=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-xl font-bold">👨‍👩‍👧 Demande pour un Tiers</h1>
            <p className="text-sm opacity-90">Payez pour quelqu'un d'autre</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {step < 4 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-purple-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Qui est le bénéficiaire ?</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Nom complet *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={beneficiary.name} onChange={(e) => setBeneficiary({ ...beneficiary, name: e.target.value })} placeholder="Ex: Mohammed Benali" className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Téléphone *</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" value={beneficiary.phone} onChange={(e) => setBeneficiary({ ...beneficiary, phone: e.target.value })} placeholder="+212 6XX XXX XXX" className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email (optionnel)</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={beneficiary.email} onChange={(e) => setBeneficiary({ ...beneficiary, email: e.target.value })} placeholder="email@example.com" className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Comment ça marche ?</p>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>1. Vous créez la demande et payez</li>
                    <li>2. Le bénéficiaire reçoit un lien par WhatsApp/SMS</li>
                    <li>3. Il partage sa localisation et approuve le devis</li>
                    <li>4. Vous suivez l'intervention depuis votre compte</li>
                  </ul>
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!beneficiary.name || !beneficiary.phone} className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Véhicule et service</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Marque *</label>
                  <input type="text" value={vehicleInfo.make} onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })} placeholder="Dacia" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Modèle *</label>
                  <input type="text" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} placeholder="Logan" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Année</label>
                  <input type="number" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} placeholder="2020" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Plaque</label>
                  <input type="text" value={vehicleInfo.plate} onChange={(e) => setVehicleInfo({ ...vehicleInfo, plate: e.target.value })} placeholder="12345-A-1" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Type de service *</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {serviceTypes.map((service) => (
                    <button key={service.id} onClick={() => setServiceType(service.id)} className={`p-4 rounded-xl border-2 transition-all ${serviceType === service.id ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="text-2xl mb-1">{service.icon}</div>
                      <div className="text-sm font-medium">{service.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description du problème *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez le problème..." className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500" rows={4} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={() => setStep(3)} disabled={!vehicleInfo.make || !vehicleInfo.model || !serviceType || !description} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Récapitulatif</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">{beneficiary.name}</p>
                  <p className="text-sm text-slate-500">{beneficiary.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">{vehicleInfo.make} {vehicleInfo.model}</p>
                  <p className="text-sm text-slate-500">{vehicleInfo.plate}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-600">{description}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <p className="text-sm text-purple-800"><strong>Prochaine étape :</strong> Un lien sera généré et envoyé à {beneficiary.name} par WhatsApp/SMS.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Créer et envoyer</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-green-800 mb-2">Demande créée !</h2>
              <p className="text-sm text-green-700">Partagez ce lien avec {beneficiary.name}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Lien de partage</label>
              <div className="flex gap-2">
                <input type="text" value={shareLink} readOnly className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
                <button onClick={() => navigator.clipboard.writeText(shareLink)} className="px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">Copier</button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Envoyer par :</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleShare('whatsapp')} className="flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600">
                  <Share2 className="w-5 h-5" />WhatsApp
                </button>
                <button onClick={() => handleShare('sms')} className="flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600">
                  <Share2 className="w-5 h-5" />SMS
                </button>
              </div>
            </div>
            <button onClick={() => navigate('/customer/on-behalf')} className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Voir mes demandes pour tiers</button>
          </div>
        )}
      </div>
    </div>
  );
};
