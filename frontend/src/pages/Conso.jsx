import React, { useState, useEffect, useRef } from 'react';
import { obtenerRespuestaConso } from '../lib/consoService';
import { Pill, Train, Car, Send } from 'lucide-react';

const STATIONS = [
  { name: 'Estación de Utrera', lat: 37.2185, lon: -5.7813 },
  { name: 'Apeadero Canta el Gallo', lat: 37.2350, lon: -5.8150 },
  { name: 'Estación de San Bernardo (Sevilla)', lat: 37.3772, lon: -5.9794 }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function Conso({ setPaginaActual }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy Conso, tu asistente oficial de Utrera. Puedes consultar las farmacias de guardia, los horarios de trenes hacia Sevilla o Utrera, o el estado de aparcamientos en tiempo real.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const botReplyText = await obtenerRespuestaConso(text, updatedMessages);
      setMessages((prev) => [...prev, { sender: 'bot', text: botReplyText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Disculpa, ha ocurrido un error al conectar con Conso en este momento.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'farmacia') {
      const userMessage = { sender: 'user', text: 'Farmacias de guardia hoy' };
      const botMessage = {
        sender: 'bot',
        text: 'FARMACIAS DE GUARDIA HOY EN UTRERA\n\n• Farmacias de Turno (09:00 a 22:00h):\n- Farmacia 1: C/ Real, 29 (Tel: 954 86 18 40)\n- Farmacia 2: Av. San Juan Bosco, 45\n- Farmacia 3: Pl. de la Trianilla, 12\n\n• Guardia de Noche (22:00 a 09:00h):\n- Servicio nocturno 24 horas en farmacia asignada de guardia.',
        buttons: [
          { label: 'Ver Ubicación de Farmacias', url: 'https://maps.google.com/?q=Farmacias+Utrera' },
          { label: 'Llamar a Farmacia de Guardia (954861840)', url: 'tel:954861840' }
        ]
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    } else if (action === 'trenes') {
      const userMessage = { sender: 'user', text: 'Próximos trenes Cercanías C-1' };
      const botMessage = {
        sender: 'bot',
        text: 'CERCANÍAS RENFE LÍNEA C-1 (UTRERA)\n\nSelecciona tu dirección para consultar los horarios oficiales en directo:',
        buttons: [
          { label: 'Dirección Sevilla (Horarios Renfe)', url: 'https://www.renfe.com/es/es/cercanias/cercanias-sevilla/horarios#/buscar' },
          { label: 'Dirección Utrera (Horarios Renfe)', url: 'https://www.renfe.com/es/es/cercanias/cercanias-sevilla/horarios#/buscar' }
        ]
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    } else if (action === 'aparcar') {
      const userMessage = { sender: 'user', text: 'Estado de aparcamientos en tiempo real' };
      const botMessage = {
        sender: 'bot',
        text: 'APARCAMIENTOS MUNICIPALES - HOLA UTRERA\n\nConsulta en tiempo real las plazas libres y ocupadas en los aparcamientos públicos de Utrera:',
        buttons: [
          { label: 'Ver Plazas en Hola Utrera (Parking)', url: 'https://holautrera.com/parking' },
          { label: 'Cómo llegar a los aparcamientos', url: 'https://maps.google.com/?q=Aparcamiento+Publico+Utrera' }
        ]
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-28">
      {/* Cabecera Oficial */}
      <div className="bg-[#781834] text-white p-4 flex items-center shadow-md">
        <div className="bg-[#9c2446] p-2.5 rounded-xl mr-3 text-xl shadow-inner">
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">Conso IA</h1>
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
          </div>
          <p className="text-xs text-rose-200">Asistente Oficial de Utrera</p>
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#781834] text-white rounded-br-none font-medium shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {msg.sender === 'bot' && (
                  <span className="text-amber-500 mt-0.5 text-base">✨</span>
                )}
                <div>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  {msg.buttons && (
                    <div className="mt-3 space-y-2">
                      {msg.buttons.map((btn, bIdx) => (
                        <a
                          key={bIdx}
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center bg-[#781834] hover:bg-[#5e1228] text-white font-semibold py-2.5 px-3 rounded-xl text-xs shadow-sm transition"
                        >
                          {btn.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 animate-pulse shadow-sm flex items-center gap-2">
              <span className="text-amber-500">✨</span> Conso está procesando tu solicitud...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Botones de Acceso Rápido */}
      <div className="px-4 py-2 grid grid-cols-3 gap-2 bg-slate-50">
        <button
          onClick={() => handleQuickAction('farmacia')}
          className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold py-3 px-2 rounded-2xl border border-rose-200 shadow-sm transition cursor-pointer"
        >
          <Pill size={16} className="text-rose-600" />
          <span>Farmacias</span>
        </button>

        <button
          onClick={() => handleQuickAction('trenes')}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-3 px-2 rounded-2xl border border-slate-200 shadow-sm transition cursor-pointer"
        >
          <Train size={16} className="text-slate-600" />
          <span>Trenes</span>
        </button>

        <button
          onClick={() => handleQuickAction('aparcar')}
          className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold py-3 px-2 rounded-2xl border border-sky-200 shadow-sm transition cursor-pointer"
        >
          <Car size={16} className="text-sky-600" />
          <span>Aparcar</span>
        </button>
      </div>

      {/* Input de texto inferior */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Pregúntale a Conso sobre farmacias, trenes, aparcamientos..."
          className="flex-1 border border-slate-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#781834]"
        />
        <button
          onClick={() => handleSendMessage()}
          className="bg-[#781834] hover:bg-[#5e1228] text-white px-5 py-3 rounded-full shadow-md transition flex items-center justify-center font-medium text-xs gap-1 cursor-pointer"
        >
          <span>Enviar</span>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}