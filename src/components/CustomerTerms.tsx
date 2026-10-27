import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, CheckCircle2 } from 'lucide-react';

export const CustomerTerms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Conditions & Confidentialité</h1>
            <p className="text-xs text-slate-500">Dernière mise à jour : Mars 2024</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Table of Contents */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Table des matières
          </h3>
          <div className="space-y-2">
            {[
              { id: 'terms', title: 'Conditions d\'utilisation', icon: '📋' },
              { id: 'privacy', title: 'Politique de confidentialité', icon: '🔒' },
              { id: 'cookies', title: 'Politique de cookies', icon: '🍪' },
              { id: 'payments', title: 'Conditions de paiement', icon: '💳' },
              { id: 'cancellation', title: 'Politique d\'annulation', icon: '❌' },
              { id: 'liability', title: 'Limitation de responsabilité', icon: '⚖️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-slate-800 flex-1">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Terms of Service */}
        <div id="terms" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Conditions d'utilisation
          </h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              Bienvenue sur mecaGO. En utilisant notre plateforme, vous acceptez les présentes conditions d'utilisation.
            </p>
            <h4 className="font-semibold text-slate-800">1. Acceptation des conditions</h4>
            <p>
              En créant un compte ou en utilisant nos services, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
            </p>
            <h4 className="font-semibold text-slate-800">2. Description du service</h4>
            <p>
              mecaGO est une plateforme de mise en relation entre clients et professionnels de l'automobile (mécaniciens, vendeurs, tuners). Nous facilitons la demande de services, la négociation de prix, et le paiement des interventions.
            </p>
            <h4 className="font-semibold text-slate-800">3. Comptes utilisateurs</h4>
            <p>
              Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe. Vous acceptez la responsabilité de toutes les activités qui se produisent sous votre compte.
            </p>
            <h4 className="font-semibold text-slate-800">4. Comportement des utilisateurs</h4>
            <p>
              Vous vous engagez à ne pas utiliser le service à des fins illégales ou non autorisées. Vous ne devez pas transmettre de virus, de code malveillant, ou violer les droits de propriété intellectuelle.
            </p>
            <h4 className="font-semibold text-slate-800">5. Paiements et commissions</h4>
            <p>
              Les paiements sont traités via nos partenaires de paiement. Une commission est prélevée sur chaque transaction pour couvrir les frais de service. Les prix sont affichés en MAD (Dirham marocain).
            </p>
          </div>
        </div>

        {/* Privacy Policy */}
        <div id="privacy" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Politique de confidentialité
          </h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              Votre vie privée est importante pour nous. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
            </p>
            <h4 className="font-semibold text-slate-800">1. Informations collectées</h4>
            <p>
              Nous collectons les informations que vous nous fournissez directement : nom, email, téléphone, adresse, informations sur vos véhicules, et historique de transactions.
            </p>
            <h4 className="font-semibold text-slate-800">2. Utilisation des informations</h4>
            <p>
              Nous utilisons vos informations pour : fournir nos services, traiter les paiements, communiquer avec vous, améliorer notre plateforme, et respecter nos obligations légales.
            </p>
            <h4 className="font-semibold text-slate-800">3. Partage des informations</h4>
            <p>
              Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations avec : les professionnels que vous contactez, nos partenaires de paiement, et les autorités si requis par la loi.
            </p>
            <h4 className="font-semibold text-slate-800">4. Sécurité des données</h4>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre l'accès non autorisé, l'altération, la divulgation ou la destruction.
            </p>
            <h4 className="font-semibold text-slate-800">5. Vos droits</h4>
            <p>
              Vous avez le droit d'accéder, de rectifier, de supprimer vos données personnelles, et de vous opposer à leur traitement. Contactez-nous pour exercer ces droits.
            </p>
          </div>
        </div>

        {/* Cookies Policy */}
        <div id="cookies" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">🍪 Politique de cookies</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme.
            </p>
            <h4 className="font-semibold text-slate-800">Types de cookies utilisés</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
              <li><strong>Cookies de performance :</strong> Nous aident à comprendre comment vous utilisez le site</li>
              <li><strong>Cookies de fonctionnalité :</strong> Mémorisent vos préférences</li>
              <li><strong>Cookies de ciblage :</strong> Utilisés pour la publicité personnalisée</li>
            </ul>
            <h4 className="font-semibold text-slate-800">Gestion des cookies</h4>
            <p>
              Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Notez que la désactivation de certains cookies peut affecter votre expérience utilisateur.
            </p>
          </div>
        </div>

        {/* Payment Terms */}
        <div id="payments" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">💳 Conditions de paiement</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              Tous les paiements sont traités en Dirhams marocains (MAD).
            </p>
            <h4 className="font-semibold text-slate-800">Méthodes de paiement acceptées</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Carte bancaire (Visa, Mastercard, CMI)</li>
              <li>Orange Money</li>
              <li>inwi Money</li>
              <li>Maroc Telecom</li>
              <li>Wafacash</li>
            </ul>
            <h4 className="font-semibold text-slate-800">Commissions</h4>
            <p>
              Une commission de service est appliquée sur chaque transaction. Le taux de commission varie selon le type de service et le plan d'abonnement du professionnel.
            </p>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div id="cancellation" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">❌ Politique d'annulation</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              Les annulations sont soumises aux conditions suivantes :
            </p>
            <h4 className="font-semibold text-slate-800">Annulation par le client</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Avant l'acceptation par le professionnel : Gratuit</li>
              <li>Après acceptation mais avant intervention : Frais d'annulation possibles</li>
              <li>Pendant l'intervention : Non remboursable</li>
            </ul>
            <h4 className="font-semibold text-slate-800">Remboursements</h4>
            <p>
              Les remboursements sont traités dans un délai de 5-10 jours ouvrables selon la méthode de paiement utilisée.
            </p>
          </div>
        </div>

        {/* Liability */}
        <div id="liability" className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">⚖️ Limitation de responsabilité</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p>
              mecaGO agit uniquement comme intermédiaire entre clients et professionnels.
            </p>
            <h4 className="font-semibold text-slate-800">Responsabilité des professionnels</h4>
            <p>
              Les professionnels sont seuls responsables de la qualité de leurs services, de leur travail, et de leur conformité aux réglementations en vigueur.
            </p>
            <h4 className="font-semibold text-slate-800">Garanties</h4>
            <p>
              Nous ne garantissons pas que le service sera ininterrompu, sécurisé, ou exempt d'erreurs. L'utilisation du service se fait à vos propres risques.
            </p>
            <h4 className="font-semibold text-slate-800">Litiges</h4>
            <p>
              En cas de litige entre un client et un professionnel, nous encourageons la résolution amiable. Notre service client peut faciliter la médiation.
            </p>
          </div>
        </div>

        {/* Acceptance */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">Acceptation des conditions</p>
              <p className="text-xs text-emerald-700">
                En continuant à utiliser mecaGO, vous acceptez ces conditions. Si vous n'êtes pas d'accord, veuillez cesser d'utiliser nos services.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Questions ?</h3>
          <p className="text-sm text-slate-600 mb-3">
            Si vous avez des questions sur ces conditions, contactez-nous :
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/customer/profile/contact')}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Nous contacter
            </button>
            <button
              onClick={() => window.open('mailto:legal@mecago.app')}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200"
            >
              legal@mecago.app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
