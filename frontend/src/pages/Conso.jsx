import React, { useState, useEffect, useRef } from 'react';
import { obtenerRespuestaConso } from '../lib/consoService';
import { Pill, Train, Car, Send } from 'lucide-react';

// Coordenadas de las estaciones clave de la línea C-1
const STATIONS = [
  { name: 'Estación de Utrera', lat: 37.2185, lon: -5.7813 },
  { name: 'Apeadero Canta el Gallo', lat: 37.2350, lon: -5.8150 },
  { name: 'Estación de San Bernardo (Sevilla)', lat: 37.3772, lon: -5.9794 }
];

// Fórmula de Haversine para calcular la distancia en metros entre dos coordenadas GPS
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la tierra en metros
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
      text: '¡Hola! Soy Conso, tu asistente virtual de Utrera. 👋\nPuedes preguntarme por las farmacias de guardia de hoy, el tiempo, trenes, aparcamientos o cualquier duda sobre nuestra ciudad.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Horarios base de salida hacia Sevilla (Línea C-1)
  const trainSchedules = [
    '06:15', '06:45', '07:15', '07:45', '08:10', '08:35', '09:05', '09:35',
    '10:20', '10:50', '11:20', '11:50', '12:20', '12:50', '13:20', '13:50',
    '14:20', '14:50', '15:20', '15:50', '16:20', '16:50', '17:20', '17:50',
    '18:20', '18:50', '19:20', '19:50', '20:20', '20:50', '21:30', '22:30'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const getNextTrain = () => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (let timeStr of trainSchedules) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const trainTimeMinutes = hours * 60 + minutes;
      if (trainTimeMinutes >= currentTimeMinutes) {
        return timeStr;
      }
    }
    return '06:15 (del día siguiente)';
  };

  const handleRenfeQuery = () => {
    setLoading(true);
    const userMessage = { sender: 'user', text: '🚆 Próximo Cercanías Renfe C1' };
    
    if (!navigator.geolocation) {
      const nextTrain = getNextTrain();
      const botMessage = {
        sender: 'bot',
        text: `El próximo tren sale a las ${nextTrain} según Renfe. (Tu dispositivo no soporta geolocalización).`,
        buttons: [
          { label: '🗺️ Ir a Estación de Utrera', url: 'https://maps.google.com/?q=Estacion+Renfe+Utrera' },
          { label: '📱 Web oficial Renfe', url: 'https://www.renfe.com' }
        ]
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let closestStation = STATIONS[0];
        let minDistance = calculateDistance(userLat, userLon, closestStation.lat, closestStation.lon);

        for (let i = 1; i < STATIONS.length; i++) {
          const dist = calculateDistance(userLat, userLon, STATIONS[i].lat, STATIONS[i].lon);
          if (dist < minDistance) {
            minDistance = dist;
            closestStation = STATIONS[i];
          }
        }

        const nextTrain = getNextTrain();
        const distanceText = minDistance < 1000 ? `${minDistance} metros` : `${(minDistance / 1000).toFixed(1)} km`;

        const botMessage = {
          sender: 'bot',
          text: `El próximo tren sale a las ${nextTrain} según Renfe, te encuentras a ${distanceText} de la ${closestStation.name}.`,
          buttons: [
            { label: `🗺️ Ir a ${closestStation.name}`, url: `https://maps.google.com/?q=${encodeURIComponent(closestStation.name)}` },
            { label: '📱 Consultar horarios oficiales Renfe', url: 'https://www.renfe.com' }
          ]
        };

        setMessages((prev) => [...prev, userMessage, botMessage]);
        setLoading(false);
      },
      (error) => {
        const nextTrain = getNextTrain();
        const botMessage = {
          sender: 'bot',
          text: `El próximo tren sale a las ${nextTrain} según Renfe. (No se pudo obtener la ubicación GPS: ${error.message}).`,
          buttons: [
            { label: '🗺️ Ir a Estación de Utrera', url: 'https://maps.google.com/?q=Estacion+Renfe+Utrera' },
            { label: '📱 Web oficial Renfe', url: 'https://www.renfe.com' }
          ]
        };
        setMessages((prev) => [...prev, userMessage, botMessage]);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    if (text.toLowerCase().includes('renfe') || text.toLowerCase().includes('tren') || text.toLowerCase().includes('cercanias')) {
      handleRenfeQuery();
      return;
    }

    try {
      const botReplyText = await obtenerRespuestaConso(text, updatedMessages);
      setMessages((prev) => [...prev, { sender: 'bot', text: botReplyText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Lo siento, ha ocurrido un error al conectar con Conso en este momento.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'farmacia') {
      const userMessage = { sender: 'user', text: '🏥 Farmacia de Guardia hoy' };
      const botMessage = {
        sender: 'bot',
        text: `🏥 **FARMACIA DE GUARDIA HOY EN UTRERA**\n\n**Ldo/a. Francisco Javier González Mancha**\n📍 Dirección: Real, 29\n📞 Teléfono: 954861840\n⏰ Horarios: Turno de Guardia 24 horas`,
        buttons: [
          { label: '🗺️ Te llevo a Francisco Javier González Mancha', url: 'https://maps.google.com/?q=Real+29+Utrera' },
          { label: '📞 Llamar a Francisco Javier González Mancha (954861840)', url: 'tel:954861840' }
        ]
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    } else if (action === 'trenes') {
      handleRenfeQuery();
    } else if (action === 'aparcar') {
      const userMessage = { sender: 'user', text: '🚗 ¿Dónde puedo aparcar en Utrera?' };
      const botMessage = {
        sender: 'bot',
        text: `🚗 **ZONAS DE APARCAMIENTO RECOMENDADAS EN UTRERA**\n\n• **Aparcamiento Pza. de la Moretina**: Céntrico y amplio.\n• **Explanada de la Feria**: Gran capacidad y fácil acceso.\n• **Estación de RENFE**: Ideal para combinaciones con Sevilla.`,
        buttons: [
          { label: '🗺️ Ver Aparcamientos en Mapas', url: 'https://maps.google.com/?q=Aparcamiento+Utrera' }
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
                          className="block w-full text-center bg-[#781834] hover:bg-[#5e1228] text-white font-semibold py-2 px-3 rounded-xl text-xs shadow-sm transition"
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
          placeholder="Pregúntale a Conso sobre Utrera, el tiempo, trenes..."
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