import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';

const mockOnBehalfRequest = {
  id: 1,
  shareToken: 'abc123xyz',
  payer: { name: 'Amine Khalid', phone: '+212600000010' },
  beneficiary: { name: 'Mohammed Benali', phone: '+212600000020' },
  vehicle: { make: 'Dacia', model: 'Logan', year: 2019, plate: '12345-A-1' },
  serviceType: 'repair',
  description: 'La voiture ne démarre pas, problème de batterie probablement',
  status: 'pending',
  locationShared: false,
  quoteApproved: false,
  approvedPrice: null,
};

export const BeneficiaryShareLink: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [locationShared, setLocationShared] = useState(mockOnBehalfRequest.locationShared);
  const [quoteApproved, setQuoteApproved] = useState(mockOnBehalfRequest.quoteApproved);
  const [approvedPrice, setApprovedPrice] = useState<number | null>(mockOnBehalfRequest.approvedPrice);
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);
  const [showQuoteApproval, setShowQuoteApproval] = useState(false);

  const handleShareLocation = () => {
    setLocationShared(true);
    setShowLocationConfirm(false);
    console.log('Location shared:', { lat: 33.5731, lng: -7.5898 });
  };

  const handleApproveQuote = (price: number) => {
    setQuoteApproved(true);
    setApprovedPrice(price);
    setShowQuoteApproval(false);
    console.log('Quote approved:', price);
  };

  const handleContactPayer = () => {
    const message = `Bonjour ${mockOnBehalfRequest.payer.name}, j'ai bien reçu votre demande de réparation pour ma ${mockOnBehalfRequest.vehicle.make} ${mockOnBehalfRequest.vehicle.model}.`;
    window.open(`https://wa.me/${mockOnBehalfRequest.payer.phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-xl font-bold">Demande de Réparation</h1>
            <p className="text-sm opacity-90">De la part de {mockOnBehalfRequest.payer.name}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {!locationShared && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">Partagez votre localisation</h3>
                <p className="text-sm text-blue-700 mb-3">Pour que le mécanicien puisse vous trouver facilement</p>
                <button onClick={() => setShowLocationConfirm(true)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Partager ma position</button>
              </div>
            </div>
          </div>
        )}

        {locationShared && !quoteApproved && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-1">Localisation partagée ✓</h3>
                <p className="text-sm text-green-700">En attente des offres des mécaniciens...</p>
              </div>
            </div>
          </div>
        )}

        {quoteApproved && (
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-800 mb-1">Devis approuvé ✓</h3>
                <p className="text-sm text-emerald-700">Prix approuvé : {approvedPrice} MAD</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Véhicule</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Véhicule</span>
              <span className="font-medium text-slate-800">{mockOnBehalfRequest.vehicle.year} {mockOnBehalfRequest.vehicle.make} {mockOnBehalfRequest.vehicle.model}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Plaque</span>
              <span className="font-medium text-slate-800">{mockOnBehalfRequest.vehicle.plate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Payeur</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">{mockOnBehalfRequest.payer.name}</p>
              <p className="text-sm text-slate-500">{mockOnBehalfRequest.payer.phone}</p>
            </div>
            <button onClick={handleContactPayer} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
              <MessageCircle className="w-4 h-4" />Contacter
            </button>
          </div>
        </div>

        {locationShared && !quoteApproved && (
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Offre reçue</h3>
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Mécanicien</span>
                <span className="font-medium text-slate-800">Ahmed Benali</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-700">Prix proposé</span>
                <span className="text-2xl font-bold text-slate-800">280 MAD</span>
              </div>
            </div>
            <button onClick={() => setShowQuoteApproval(true)} className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Approuver le devis</button>
          </div>
        )}
      </div>

      {showLocationConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Partager votre localisation</h3>
            <p className="text-sm text-slate-600 mb-6">Votre position sera partagée avec le mécanicien.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLocationConfirm(false)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Annuler</button>
              <button onClick={handleShareLocation} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Partager</button>
            </div>
          </div>
        </div>
      )}

      {showQuoteApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Approuver le devis</h3>
            <div className="bg-purple-50 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                <span className="text-sm font-medium text-slate-700">Prix</span>
                <span className="text-2xl font-bold text-purple-600">280 MAD</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">En approuvant ce devis, vous confirmez que le mécanicien peut commencer l'intervention.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowQuoteApproval(false)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Annuler</button>
              <button onClick={() => handleApproveQuote(280)} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Approuver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
