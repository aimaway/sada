import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, AlertCircle, Search, Wrench, ShoppingBag } from 'lucide-react';

interface IntentTilesProps {
  onIntentSelect?: (intent: string) => void;
}

export const IntentTiles: React.FC<IntentTilesProps> = ({ onIntentSelect }) => {
  const navigate = useNavigate();

  const intents = [
    {
      id: 'explain',
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Expliquer mon problème',
      description: 'Décrivez en texte, voix ou photos',
      color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
      textColor: 'text-slate-900',
      route: '/customer/explain-problem',
    },
    {
      id: 'urgent',
      icon: <AlertCircle className="w-8 h-8" />,
      title: "J'ai un problème précis",
      description: 'Batterie, pneu, freins, clim, SOS',
      color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
      textColor: 'text-slate-900',
      route: '/customer/new-request?intent=urgent&family=0',
    },
    {
      id: 'diagnostic',
      icon: <Search className="w-8 h-8" />,
      title: 'Diagnostic',
      description: 'Scan électronique et analyse',
      color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
      textColor: 'text-slate-900',
      route: '/customer/diagnostic',
    },
    {
      id: 'maintenance',
      icon: <Wrench className="w-8 h-8" />,
      title: 'Vidange et entretien',
      description: 'Entretien régulier et maintenance',
      color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
      textColor: 'text-slate-900',
      route: '/customer/maintenance-request',
    },
    {
      id: 'parts',
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Acheter un produit',
      description: 'Pièces détachées et accessoires',
      color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
      textColor: 'text-slate-900',
      route: '/customer/shop',
    },
  ];

  const handleIntentClick = (intent: typeof intents[0]) => {
    if (onIntentSelect) {
      onIntentSelect(intent.id);
    }
    navigate(intent.route);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-900">Que souhaitez-vous faire ?</h2>
      <div className="grid grid-cols-1 gap-3">
        {intents.map((intent) => (
          <button
            key={intent.id}
            onClick={() => handleIntentClick(intent)}
            className={`p-5 rounded-2xl border-2 text-left transition-all hover:border-slate-900 hover:bg-slate-50 ${intent.color}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${intent.textColor === 'text-slate-900' ? 'bg-slate-100' : 'bg-white/20'}`}>
                {React.cloneElement(intent.icon, { className: `w-6 h-6 ${intent.textColor === 'text-slate-900' ? 'text-slate-700' : 'text-white'}` })}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-base mb-1 ${intent.textColor}`}>{intent.title}</h3>
                <p className={`text-sm ${intent.textColor === 'text-slate-900' ? 'text-slate-600' : 'opacity-90'}`}>{intent.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
