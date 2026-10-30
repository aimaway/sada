import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import {
  ArrowLeft, Mail, Phone, MessageCircle, Send, User, FileText,
  CheckCircle2, AlertCircle
} from 'lucide-react';

export const CustomerContact: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useApp();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.subject || !formData.message) {
      toast('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate('/customer/profile');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Message envoyé !</h2>
          <p className="text-sm text-slate-600 mb-4">
            Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <p className="text-xs text-slate-500">
            Temps de réponse estimé : 24-48 heures
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Nous contacter</h1>
            <p className="text-xs text-slate-500">Envoyez-nous un message</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Contact Options */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Contact rapide</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/customer/profile/help')}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-800">Chat en direct</p>
                <p className="text-xs text-slate-500">Réponse immédiate</p>
              </div>
            </button>

            <button
              onClick={() => window.open('tel:+212522000000')}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-800">Appeler le support</p>
                <p className="text-xs text-slate-500">+212 522 000 000</p>
              </div>
            </button>

            <button
              onClick={() => window.open('mailto:support@tomobily.app')}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-800">Envoyer un email</p>
                <p className="text-xs text-slate-500">support@tomobily.app</p>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Envoyer un message</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Sujet *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Question sur ma réservation"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Priorité</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Basse', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { id: 'normal', label: 'Normale', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                  { id: 'high', label: 'Haute', color: 'bg-red-50 border-red-200 text-red-700' },
                ].map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => setFormData({ ...formData, priority: priority.id })}
                    className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      formData.priority === priority.id
                        ? priority.color
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre question ou problème en détail..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                rows={6}
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.message.length}/1000 caractères
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Votre message sera traité dans les 24-48 heures. Pour les urgences, utilisez le chat en direct ou appelez-nous directement.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.subject || !formData.message}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Envoyer le message
            </button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Horaires de support</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Lundi - Vendredi</span>
              <span className="font-medium text-slate-800">8h00 - 20h00</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Samedi</span>
              <span className="font-medium text-slate-800">9h00 - 18h00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Dimanche</span>
              <span className="font-medium text-slate-800">Fermé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
