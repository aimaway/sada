import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Contactez-nous</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Restons en contact</h2>
            <p className="text-slate-600 mb-8">
              Notre équipe est disponible pour répondre à toutes vos questions. N'hésitez pas à nous contacter !
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Téléphone</h3>
                  <p className="text-slate-600">+212 5 22 00 00 00</p>
                  <p className="text-sm text-slate-500 mt-1">Du lundi au vendredi, 9h-18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">contact@mecago.app</p>
                  <p className="text-sm text-slate-500 mt-1">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Adresse</h3>
                  <p className="text-slate-600">Boulevard Mohammed V</p>
                  <p className="text-slate-600">Casablanca, Maroc</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Horaires</h3>
                  <p className="text-slate-600">Lundi - Vendredi : 9h - 18h</p>
                  <p className="text-slate-600">Samedi : 9h - 13h</p>
                  <p className="text-sm text-slate-500 mt-1">Support d'urgence 24/7 pour les clients Premium</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold text-slate-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Facebook className="w-5 h-5 text-slate-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Instagram className="w-5 h-5 text-slate-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Twitter className="w-5 h-5 text-slate-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-slate-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Sujet</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                  <option>Question générale</option>
                  <option>Support technique</option>
                  <option>Partenariat</option>
                  <option>Réclamation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Message</label>
                <textarea
                  rows={5}
                  placeholder="Votre message..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
