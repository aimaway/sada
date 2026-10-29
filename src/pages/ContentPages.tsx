import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Award, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">À propos de TomoBily</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Notre Mission</h2>
          <p className="text-lg text-slate-600 mb-4">
            TomoBily est né d'une idée simple : rendre la réparation automobile accessible, transparente et abordable pour tous.
          </p>
          <p className="text-slate-600 mb-4">
            Fondée en 2024 à Casablanca, notre plateforme connecte les propriétaires de véhicules avec des mécaniciens vérifiés et qualifiés, permettant une réparation à domicile au prix juste.
          </p>
          <p className="text-slate-600">
            Notre vision est de devenir la référence de la réparation automobile au Maroc, en offrant un service de qualité, transparent et accessible à tous.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Notre Vision</h3>
            <p className="text-sm text-slate-600">
              Devenir la plateforme leader de réparation automobile au Maroc d'ici 2026.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nos Valeurs</h3>
            <p className="text-sm text-slate-600">
              Transparence, qualité, accessibilité et satisfaction client au cœur de tout.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Notre Engagement</h3>
            <p className="text-sm text-slate-600">
              Garantir un service de qualité avec des mécaniciens vérifiés et certifiés.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Nos Chiffres Clés</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-sm text-slate-600">Interventions réalisées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-sm text-slate-600">Mécaniciens vérifiés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.9/5</div>
              <div className="text-sm text-slate-600">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">30 min</div>
              <div className="text-sm text-slate-600">Temps de réponse</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Rejoignez l'aventure TomoBily</h2>
          <p className="mb-6 opacity-90">
            Que vous soyez client, mécanicien, vendeur ou tuner, il y a une place pour vous dans notre communauté.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            Commencer maintenant →
          </button>
        </div>
      </div>
    </div>
  );
};

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();

  const jobs = [
    {
      title: 'Développeur React Native Senior',
      type: 'CDI - Temps plein',
      location: 'Casablanca, Maroc',
      description: 'Rejoignez notre équipe technique pour développer l\'application mobile TomoBily.',
    },
    {
      title: 'Responsable Marketing Digital',
      type: 'CDI - Temps plein',
      location: 'Casablanca, Maroc',
      description: 'Développez notre présence en ligne et acquérez de nouveaux utilisateurs.',
    },
    {
      title: 'Support Client - Darija/ Français',
      type: 'CDI - Temps plein',
      location: 'Casablanca, Maroc',
      description: 'Assistez nos clients et mécaniciens avec professionnalisme et bienveillance.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Carrières</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Rejoignez notre équipe</h2>
          <p className="text-lg text-slate-600 mb-6">
            Chez TomoBily, nous croyons que les meilleures idées viennent de personnes diverses et talentueuses. 
            Rejoignez-nous pour révolutionner la réparation automobile au Maroc.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-600 mb-1">15+</div>
              <div className="text-sm text-slate-600">Employés passionnés</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-slate-600">Télétravail flexible</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">∞</div>
              <div className="text-sm text-slate-600">Possibilités de croissance</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Postes Ouverts</h2>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                  <div className="flex gap-3 text-sm text-slate-500">
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 mb-4">{job.description}</p>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Postuler →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  const articles = [
    {
      title: '5 signes que votre voiture a besoin d\'une révision',
      excerpt: 'Découvrez les signes avant-coureurs qui indiquent que votre véhicule nécessite une maintenance urgente...',
      date: '15 Mars 2024',
      category: 'Conseils',
      readTime: '5 min',
    },
    {
      title: 'Comment choisir le bon mécanicien pour votre voiture',
      excerpt: 'Guide complet pour trouver un mécanicien de confiance et éviter les mauvaises surprises...',
      date: '10 Mars 2024',
      category: 'Guides',
      readTime: '7 min',
    },
    {
      title: 'L\'entretien régulier : pourquoi c\'est essentiel',
      excerpt: 'Un entretien régulier peut prolonger la durée de vie de votre véhicule et vous faire économiser...',
      date: '5 Mars 2024',
      category: 'Conseils',
      readTime: '4 min',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Blog</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Conseils et Astuces Auto</h2>
          <p className="text-lg text-slate-600">
            Découvrez nos meilleurs conseils pour l'entretien et la réparation de votre véhicule
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article, i) => (
            <article key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-sm text-slate-500">{article.date}</span>
                    <span className="text-sm text-slate-500">• {article.readTime} de lecture</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{article.title}</h3>
                  <p className="text-slate-600 mb-4">{article.excerpt}</p>
                  <button className="text-emerald-600 font-medium hover:text-emerald-700">
                    Lire la suite →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment fonctionne TomoBily ?',
      answer: 'TomoBily vous permet de décrire votre problème automobile, de proposer un prix, et de recevoir des offres de mécaniciens vérifiés à proximité. Vous choisissez le mécanicien qui vous convient, et l\'intervention se fait à domicile.',
    },
    {
      question: 'Comment sont vérifiés les mécaniciens ?',
      answer: 'Tous nos mécaniciens passent par un processus de vérification rigoureux : pièce d\'identité, certificats professionnels, photos de l\'atelier, et références clients. Seuls les mécaniciens vérifiés peuvent intervenir via TomoBily.',
    },
    {
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons les paiements en espèces, par carte bancaire (CMI), Orange Money, inwi Money, Maroc Telecom, et Wafacash. Tous les paiements sont sécurisés et monitorés.',
    },
    {
      question: 'Que se passe-t-il si je ne suis pas satisfait ?',
      answer: 'Nous offrons une garantie de 30 jours sur toutes les interventions. Si vous n\'êtes pas satisfait, contactez notre support client et nous trouverons une solution (reprise gratuite ou remboursement).',
    },
    {
      question: 'Combien coûte le service TomoBily ?',
      answer: 'L\'utilisation de TomoBily est gratuite pour les clients. Nous prenons une commission de 10% sur le prix de l\'intervention, payée par le mécanicien. Aucun frais caché pour vous.',
    },
    {
      question: 'Dans quelles zones intervenez-vous ?',
      answer: 'Nous intervenons actuellement à Casablanca et ses environs. Nous prévoyons une expansion à Rabat et Marrakech dans les prochains mois.',
    },
    {
      question: 'Comment devenir mécanicien partenaire ?',
      answer: 'Inscrivez-vous sur notre plateforme, complétez votre profil avec vos certificats et références, et attendez la vérification de notre équipe. Une fois approuvé, vous pouvez commencer à recevoir des demandes.',
    },
    {
      question: 'Puis-je annuler une intervention ?',
      answer: 'Oui, vous pouvez annuler une intervention tant que le mécanicien n\'a pas commencé le travail. Si l\'annulation intervient après le début, des frais peuvent s\'appliquer.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">FAQ</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Questions Fréquentes</h2>
          <p className="text-lg text-slate-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</h3>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === index ? 'rotate-90' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-emerald-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Vous avez d'autres questions ?</h3>
          <p className="text-slate-600 mb-4">Notre équipe est là pour vous aider</p>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Conditions d'Utilisation</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-slate-500 mb-6">Dernière mise à jour : 15 Mars 2024</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptation des Conditions</h2>
            <p className="text-slate-600 mb-6">
              En utilisant la plateforme TomoBily, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description du Service</h2>
            <p className="text-slate-600 mb-6">
              TomoBily est une plateforme de mise en relation entre clients et mécaniciens vérifiés pour des interventions de réparation automobile à domicile.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Inscription et Compte</h2>
            <p className="text-slate-600 mb-6">
              Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de la confidentialité de votre compte.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Utilisation du Service</h2>
            <p className="text-slate-600 mb-6">
              Vous vous engagez à utiliser le service de manière légale et conforme à ces conditions. Toute utilisation frauduleuse ou abusive entraînera la suspension de votre compte.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Paiements et Commissions</h2>
            <p className="text-slate-600 mb-6">
              Les paiements sont effectués directement entre le client et le mécanicien. TomoBily prélève une commission de 10% sur le prix de l'intervention, payée par le mécanicien.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Garantie et Responsabilité</h2>
            <p className="text-slate-600 mb-6">
              TomoBily garantit la qualité des mécaniciens vérifiés. En cas de problème, notre support client est disponible pour trouver une solution satisfaisante.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Modification des Conditions</h2>
            <p className="text-slate-600 mb-6">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur cette page.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact</h2>
            <p className="text-slate-600">
              Pour toute question concernant ces conditions, contactez-nous à legal@tomobily.app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Politique de Confidentialité</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-slate-500 mb-6">Dernière mise à jour : 15 Mars 2024</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Collecte des Informations</h2>
            <p className="text-slate-600 mb-6">
              Nous collectons des informations lorsque vous vous inscrivez, utilisez nos services, ou interagissez avec notre plateforme. Ces informations incluent : nom, téléphone, email, localisation, et historique d'interventions.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Utilisation des Informations</h2>
            <p className="text-slate-600 mb-6">
              Vos informations sont utilisées pour : fournir et améliorer nos services, traiter les paiements, communiquer avec vous, et assurer la sécurité de la plateforme.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Partage des Informations</h2>
            <p className="text-slate-600 mb-6">
              Nous ne vendons pas vos informations personnelles. Nous partageons uniquement les informations nécessaires avec les mécaniciens pour effectuer les interventions.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sécurité des Données</h2>
            <p className="text-slate-600 mb-6">
              Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos informations : chiffrement, authentification sécurisée, et surveillance continue.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Vos Droits</h2>
            <p className="text-slate-600 mb-6">
              Vous avez le droit d'accéder, modifier, ou supprimer vos informations personnelles. Contactez-nous à privacy@tomobily.app pour exercer ces droits.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies</h2>
            <p className="text-slate-600 mb-6">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact</h2>
            <p className="text-slate-600">
              Pour toute question concernant notre politique de confidentialité, contactez-nous à privacy@tomobily.app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
