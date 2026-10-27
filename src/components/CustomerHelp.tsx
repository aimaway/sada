import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, HelpCircle, Search, MessageCircle, Phone, Mail, FileText,
  ChevronRight, Star, ThumbsUp, ThumbsDown, Send
} from 'lucide-react';

export const CustomerHelp: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'account',
      icon: '👤',
      title: 'Mon compte',
      questions: [
        'Comment modifier mes informations personnelles ?',
        'Comment changer mon mot de passe ?',
        'Comment supprimer mon compte ?',
        'Comment activer l\'authentification à deux facteurs ?',
      ],
    },
    {
      id: 'booking',
      icon: '📅',
      title: 'Réservations',
      questions: [
        'Comment demander un mécanicien ?',
        'Comment annuler une réservation ?',
        'Comment suivre mon intervention ?',
        'Que faire si le mécanicien est en retard ?',
      ],
    },
    {
      id: 'payment',
      icon: '💳',
      title: 'Paiements',
      questions: [
        'Quels sont les moyens de paiement acceptés ?',
        'Comment recharger mon portefeuille ?',
        'Comment obtenir un remboursement ?',
        'Comment fonctionne la commission ?',
      ],
    },
    {
      id: 'mechanic',
      icon: '🔧',
      title: 'Mécaniciens',
      questions: [
        'Comment choisir un mécanicien ?',
        'Comment noter un mécanicien ?',
        'Comment signaler un problème ?',
        'Comment devenir mécanicien partenaire ?',
      ],
    },
    {
      id: 'shop',
      icon: '🛒',
      title: 'Boutique',
      questions: [
        'Comment commander des pièces ?',
        'Comment suivre ma commande ?',
        'Quelle est la politique de retour ?',
        'Comment contacter un vendeur ?',
      ],
    },
    {
      id: 'documents',
      icon: '📄',
      title: 'Documents',
      questions: [
        'Comment ajouter un document ?',
        'Comment recevoir des rappels d\'expiration ?',
        'Mes documents sont-ils sécurisés ?',
        'Comment supprimer un document ?',
      ],
    },
  ];

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Centre d'aide</h1>
            <p className="text-xs text-slate-500">Comment pouvons-nous vous aider ?</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {!selectedCategory ? (
          <>
            {/* Categories */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Catégories</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-slate-800 text-sm">{category.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{category.questions.length} questions</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Options */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Besoin d'aide supplémentaire ?</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/customer/profile/contact')}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-800">Chat en direct</p>
                    <p className="text-xs text-slate-500">Réponse en moins de 5 minutes</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button
                  onClick={() => window.open('tel:+212522000000')}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-800">Appeler le support</p>
                    <p className="text-xs text-slate-500">+212 522 000 000</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button
                  onClick={() => window.open('mailto:support@mecago.app')}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-800">Envoyer un email</p>
                    <p className="text-xs text-slate-500">support@mecago.app</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Category Questions */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{selectedCategoryData?.title}</h2>
                <p className="text-xs text-slate-500">{selectedCategoryData?.questions.length} questions fréquentes</p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedCategoryData?.questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => alert(`Réponse à : ${question}\n\n(Cette fonctionnalité sera implémentée avec le backend)`)}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{question}</p>
                      <p className="text-xs text-slate-500 mt-1">Cliquer pour voir la réponse</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {/* Was this helpful? */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-800 mb-3">Ces informations vous ont-elles été utiles ?</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 flex items-center justify-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Oui
                </button>
                <button className="flex-1 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  Non
                </button>
              </div>
            </div>
          </>
        )}

        {/* Rate our support */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <h3 className="font-semibold text-slate-800 mb-2">Évaluez notre support</h3>
          <p className="text-xs text-slate-600 mb-3">Votre avis nous aide à nous améliorer</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => alert(`Merci pour votre évaluation de ${star} étoile${star > 1 ? 's' : ''} !`)}
                className="flex-1 py-2 bg-white rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Star className="w-5 h-5 mx-auto text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
