import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar } from '../shared/components';
import {
  ArrowLeft, MessageCircle, Phone, Image as ImageIcon, Mic, Send, Search,
  User, Car, MapPin, CreditCard, Gift, Globe, Bell, Shield, HelpCircle,
  FileText, LogOut, ChevronRight, Camera, Volume2
} from 'lucide-react';

// J. Messages Tab - Unified Inbox
export function MessagesTab() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const conversations = [
    {
      id: 'c1', name: 'Ahmed Benali', type: 'mechanic', avatar_color: 'bg-emerald-500',
      last_message: 'Parfait, j\'arrive dans 5 minutes', time: '14:30', unread: 2,
      job_id: 'J-156', job_label: '🔋 Batterie'
    },
    {
      id: 'c2', name: 'AutoPièces Maroc', type: 'seller', avatar_color: 'bg-blue-500',
      last_message: 'Votre commande est en route 🚚', time: '12:15', unread: 1,
      job_id: 'SO-45', job_label: '🛢️ Huile + Filtre'
    },
    {
      id: 'c3', name: 'Karim Tazi', type: 'mechanic', avatar_color: 'bg-purple-500',
      last_message: 'Merci pour votre avis ! À bientôt 👋', time: 'Hier', unread: 0,
      job_id: 'J-150', job_label: '🛢️ Vidange'
    },
    {
      id: 'c4', name: 'PneusExpress', type: 'seller', avatar_color: 'bg-amber-500',
      last_message: 'Les pneus sont disponibles, on livre demain', time: 'Lun', unread: 0,
      job_id: 'SO-38', job_label: '🛞 Pneus Michelin'
    },
  ];

  const quickReplies = [
    language === 'fr' ? 'D\'accord, merci !' : 'حسناً، شكراً!',
    language === 'fr' ? 'J\'arrive dans 5 min' : 'سأصل في 5 دقائق',
    language === 'fr' ? 'C\'est noté 👍' : 'تم 📝',
    language === 'fr' ? 'Merci beaucoup !' : 'شكراً جزيلاً!',
  ];

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSelectedChat(null)} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <Avatar name={conversations.find(c => c.id === selectedChat)?.name || ''} size="sm" />
          <div className="flex-1">
            <p className="font-semibold text-slate-800 text-sm">{conversations.find(c => c.id === selectedChat)?.name}</p>
            <p className="text-xs text-emerald-600">🟢 {language === 'fr' ? 'En ligne' : 'متصل'}</p>
          </div>
          <button className="p-2 rounded-xl bg-emerald-100">
            <Phone className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        {/* Job context */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
          <p className="text-xs text-blue-700">
            📋 {language === 'fr' ? 'Concernant :' : 'فيما يتعلق بـ:'} {conversations.find(c => c.id === selectedChat)?.job_label}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
              <p className="text-sm">Bonjour ! Je suis en route vers vous.</p>
              <p className="text-[10px] text-slate-400 mt-1">14:05</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-emerald-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
              <p className="text-sm">Super, je vous attends en bas.</p>
              <p className="text-[10px] text-emerald-100 mt-1">14:06</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
              <p className="text-sm">Parfait, j'arrive dans 5 minutes</p>
              <p className="text-[10px] text-slate-400 mt-1">14:30</p>
            </div>
          </div>
          {/* Voice message */}
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                </button>
                <div className="flex-1">
                  <div className="h-6 bg-slate-100 rounded-full flex items-center px-2">
                    <div className="flex gap-0.5">
                      {[3, 5, 8, 4, 6, 9, 5, 7, 3, 6, 8, 4].map((h, i) => (
                        <div key={i} className="w-0.5 bg-emerald-500 rounded-full" style={{ height: `${h * 2}px` }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">0:12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick replies */}
        <div className="bg-white border-t border-slate-100 px-4 py-2 overflow-x-auto">
          <div className="flex gap-2">
            {quickReplies.map((reply, i) => (
              <button key={i} className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-700 whitespace-nowrap hover:bg-slate-200">
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-100 p-3 flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100">
            <ImageIcon className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <Camera className="w-5 h-5 text-slate-400" />
          </button>
          <input
            type="text"
            placeholder={language === 'fr' ? 'Message...' : 'رسالة...'}
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm outline-none"
          />
          <button className="p-2 rounded-full hover:bg-slate-100">
            <Mic className="w-5 h-5 text-slate-400" />
          </button>
          <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <h1 className="font-semibold text-slate-800">{language === 'fr' ? 'Messages' : 'الرسائل'}</h1>
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'fr' ? 'Rechercher...' : 'بحث...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-2">
        {conversations.map(conv => (
          <Card key={conv.id} className="p-3" onClick={() => setSelectedChat(conv.id)}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={conv.name} size="md" />
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 text-sm">{conv.name}</p>
                  <span className="text-xs text-slate-400">{conv.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.last_message}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{conv.job_label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// K. Profile Screen
export function ProfileScreen() {
  const { language, user, logout } = useApp();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: language === 'fr' ? 'Mon véhicule' : 'سيارتي',
      items: [
        { icon: <Car className="w-5 h-5" />, label: language === 'fr' ? 'Mon garage' : 'كراجي', route: '/customer/vehicles' },
        { icon: <MapPin className="w-5 h-5" />, label: language === 'fr' ? 'Adresses enregistrées' : 'العناوين المحفوظة', route: '#' },
      ]
    },
    {
      title: language === 'fr' ? 'Paiement & Portefeuille' : 'الدفع والمحفظة',
      items: [
        { icon: <CreditCard className="w-5 h-5" />, label: language === 'fr' ? 'Méthodes de paiement' : 'طرق الدفع', route: '#' },
        { icon: <Gift className="w-5 h-5" />, label: language === 'fr' ? 'Portefeuille & codes promo' : 'المحفظة وأكواد الخصم', route: '#' },
      ]
    },
    {
      title: language === 'fr' ? 'Compte' : 'الحساب',
      items: [
        { icon: <Globe className="w-5 h-5" />, label: language === 'fr' ? 'Langue' : 'اللغة', route: '#', value: language === 'fr' ? 'Français' : 'العربية' },
        { icon: <Bell className="w-5 h-5" />, label: language === 'fr' ? 'Notifications' : 'الإشعارات', route: '#' },
        { icon: <Gift className="w-5 h-5" />, label: language === 'fr' ? 'Code de parrainage' : 'كود الإحالة', route: '#', badge: '+50 MAD' },
      ]
    },
    {
      title: language === 'fr' ? 'Sécurité & Support' : 'الأمان والدعم',
      items: [
        { icon: <Shield className="w-5 h-5" />, label: language === 'fr' ? 'Centre de sécurité' : 'مركز الأمان', route: '#' },
        { icon: <HelpCircle className="w-5 h-5" />, label: language === 'fr' ? 'Support & FAQ' : 'الدعم والأسئلة', route: '#' },
        { icon: <FileText className="w-5 h-5" />, label: language === 'fr' ? 'Conditions & Confidentialité' : 'الشروط والخصوصية', route: '#' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Avatar name={user?.full_name || 'User'} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{user?.full_name}</h1>
            <p className="text-sm text-slate-500">{user?.phone}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                ⭐ {language === 'fr' ? 'Membre Fidèle' : 'عضو مخلص'}
              </span>
              <span className="text-xs text-slate-400">• 1,250 pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-slate-800">12</p>
            <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Jobs' : 'أعمال'}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-amber-600">4.9</p>
            <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Note moy.' : 'متوسط'}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-emerald-600">1,250</p>
            <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Points' : 'نقاط'}</p>
          </Card>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, i) => (
          <div key={i}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-1">{section.title}</h3>
            <Card className="overflow-hidden">
              {section.items.map((item, j) => (
                <button
                  key={j}
                  onClick={() => item.route !== '#' && navigate(item.route)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm text-slate-800 text-start">{item.label}</span>
                  {item.value && <span className="text-xs text-slate-500">{item.value}</span>}
                  {item.badge && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{item.badge}</span>}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Referral Banner */}
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎁</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{language === 'fr' ? 'Parrainez un ami' : 'ادعُ صديقاً'}</p>
              <p className="text-xs opacity-80">{language === 'fr' ? 'Gagnez 50 MAD pour chaque ami invité' : 'اكسب 50 درهم لكل صديق تدعوه'}</p>
            </div>
            <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium">
              {language === 'fr' ? 'Inviter' : 'دعوة'}
            </button>
          </div>
        </Card>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">{language === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
        </button>
      </div>
    </div>
  );
}
