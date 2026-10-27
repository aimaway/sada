import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import { ArrowLeft, Send, Package, Plus, Minus } from 'lucide-react';

export function NegotiationScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'mechanic', content: 'Bonjour ! Je suis en route.', type: 'text' },
    { id: '2', sender: 'mechanic', content: 'Je propose 320 MAD avec batterie Bosch.', type: 'price_offer', price: 320 },
  ]);
  const [counterPrice, setCounterPrice] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <p className="font-semibold text-sm">Discussion avec Ahmed</p>
          <p className="text-xs text-emerald-600">🟢 En route • 12 min</p>
        </div>
      </div>
      <div className="bg-emerald-50 px-4 py-2 flex items-center gap-2">
        <span className="text-xs">Négocier:</span>
        <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} placeholder="250" className="flex-1 px-3 py-1.5 border rounded-lg text-sm text-center" />
        <Button size="sm" onClick={() => { setMessages([...messages, { id: Date.now().toString(), sender: 'customer', content: `Je propose ${counterPrice} MAD`, type: 'price_offer' }]); setCounterPrice(''); }}>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === 'customer' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
              <p className="text-sm">{msg.content}</p>
              {msg.type === 'price_offer' && <p className="text-xs mt-1 opacity-80">💰 {msg.price} MAD</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border-t p-3 flex items-center gap-2">
        <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></button>
        <input type="text" placeholder="Message..." className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm outline-none" />
        <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center"><Send className="w-4 h-4 text-white" /></button>
      </div>
    </div>
  );
}
