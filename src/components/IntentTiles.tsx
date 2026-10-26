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
      color: 'from-blue-500 to-blue-600',
      route: '/customer/new-request?intent=explain&family=urgent',
    },
    {
      id: 'urgent',
      icon: <AlertCircle className="w-8 h-8" />,
      title: "J'ai un problème précis",
      description: 'Batterie, pneu, freins, clim, SOS',
      color: 'from-red-500 to-red-600',
      route: '/customer/new-request?intent=urgent&family=urgent',
    },
    {
      id: 'diagnostic',
      icon: <Search className="w-8 h-8" />,
      title: 'Diagnostic',
      description: 'Scan électronique et analyse',
      color: 'from-purple-500 to-purple-600',
      route: '/customer/new-request?intent=diagnostic&family=diagnostic',
    },
    {
      id: 'maintenance',
      icon: <Wrench className="w-8 h-8" />,
      title: 'Vidange et entretien',
      description: 'Entretien régulier et maintenance',
      color: 'from-green-500 to-green-600',
      route: '/customer/new-request?intent=maintenance&family=maintenance',
    },
    {
      id: 'parts',
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Acheter un produit',
      description: 'Pièces détachées et accessoires',
      color: 'from-orange-500 to-orange-600',
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
      <h2 className="text-lg font-bold text-slate-800">Que souhaitez-vous faire ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intents.map((intent) => (
          <button
            key={intent.id}
            onClick={() => handleIntentClick(intent)}
            className={`bg-gradient-to-br ${intent.color} text-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all hover:scale-105 group`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-xl p-3 group-hover:bg-white/30 transition-colors">
                {intent.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{intent.title}</h3>
                <p className="text-sm opacity-90">{intent.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
