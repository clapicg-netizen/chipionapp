// App.js     // src/App.js
import React, { useState, useEffect } from 'react';
// import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import GuiaComercial from './pages/GuiaComercial';
import Farmacias from './pages/Farmacias';
import Salud from './pages/Salud';
import Sanidad from './pages/Sanidad';
import AdminSanidad from './pages/AdminSanidad';
import AgendaGestiones from './pages/AgendaGestiones';
import QueVer from './pages/QueVer';
import MenuAgenda from './pages/MenuAgenda';
import Conso from './pages/Conso';
import PanelComercio from './pages/PanelComercio';
import Admin from './pages/Admin';
import Tablon from './pages/Tablon';
import Teatro from './pages/Teatro';
import Noticias from './pages/Noticias';
import CajaHerramientas from './pages/CajaHerramientas';
import Gasolineras from './pages/Gasolineras'; // <--- 1. IMPORTACIÓN AÑADIDA
import TrenesUtrera from './components/TrenesUtrera';
import { Store, MessageSquare, Home as HomeIcon, Newspaper, Train, Wrench } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [paginaActual, setPaginaActual] = useState('home');
  const [comercioIdUrl, setComercioIdUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Detectar si se entra con enlace directo de comercio
    const idComercio = params.get('id');
    if (idComercio) {
      setComercioIdUrl(idComercio);
      setPaginaActual('panel-comercio');
      return;
    }

    // Detectar si se entra con enlace directo a trenes desde WhatsApp
    const vistaParam = params.get('vista');
    if (vistaParam === 'trenes') {
      setPaginaActual('trenes');
    }
  }, []);

  const renderizarPagina = () => {
    if (comercioIdUrl && paginaActual === 'panel-comercio') {
      return <PanelComercio comercioId={comercioIdUrl} setPaginaActual={setPaginaActual} />;
    }

    switch (paginaActual) {
      case 'home':
        return <Home setPaginaActual={setPaginaActual} setTab={setPaginaActual} />;
      case 'market':
      case 'hosteleria':
        return <GuiaComercial setPaginaActual={setPaginaActual} categoriaInicial={paginaActual === 'hosteleria' ? 'hosteleria' : null} />;
      case 'farmacias':
        return <Farmacias setPaginaActual={setPaginaActual} />;
      case 'salud':
        return <Salud setPaginaActual={setPaginaActual} />;
      case 'sanidad':
        return <Sanidad setPaginaActual={setPaginaActual} />;
      case 'admin-sanidad':
        return <AdminSanidad setPaginaActual={setPaginaActual} supabase={supabase} />;
      case 'agenda-gestiones':
        return <AgendaGestiones setPaginaActual={setPaginaActual} />;
      case 'que-ver':
        return <QueVer setPaginaActual={setPaginaActual} />;
      case 'menu-agenda':
        return <MenuAgenda setPaginaActual={setPaginaActual} />;
      case 'teatro':
        return <Teatro setPaginaActual={setPaginaActual} />;
      case 'noticias':
        return <Noticias setPaginaActual={setPaginaActual} />;
      case 'conso':
        return <Conso setPaginaActual={setPaginaActual} />;
      case 'caja-herramientas':
        return <CajaHerramientas setPaginaActual={setPaginaActual} />;
      case 'gasolineras':
        return <Gasolineras setPaginaActual={setPaginaActual} />; // <--- 2. RUTA AÑADIDA
      case 'tablon':
        return <Tablon setPaginaActual={setPaginaActual} />;
      case 'admin':
        return <Admin setPaginaActual={setPaginaActual} />;
      case 'trenes':
        return (
          <div className="max-w-md mx-auto p-4 pb-24">
            <div className="flex items-center justify-between mb-2 pt-2">
              <button 
                onClick={() => setPaginaActual('home')}
                className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg font-medium text-slate-700 transition"
              >
                ← Volver
              </button>
              <h2 className="font-bold text-slate-800 text-sm">Estado del Tren</h2>
              <div className="w-12"></div>
            </div>
            <TrenesUtrera />
          </div>
        );
      default:
        return <Home setPaginaActual={setPaginaActual} setTab={setPaginaActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {renderizarPagina()}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 flex justify-around items-center z-50 shadow-lg max-w-md mx-auto rounded-t-3xl">
        <button 
          onClick={() => setPaginaActual('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${paginaActual === 'home' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <HomeIcon size={20} />
          <span className="text-[10px]">Inicio</span>
        </button>

        <button 
          onClick={() => setPaginaActual('market')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${paginaActual === 'market' || paginaActual === 'hosteleria' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Store size={20} />
          <span className="text-[10px]">Comercio</span>
        </button>

        <button 
          onClick={() => setPaginaActual('caja-herramientas')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${paginaActual === 'caja-herramientas' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Wrench size={20} />
          <span className="text-[10px]">Herramientas</span>
        </button>

        <button 
          onClick={() => setPaginaActual('trenes')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${paginaActual === 'trenes' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Train size={20} />
          <span className="text-[10px]">Trenes</span>
        </button>

        <button 
          onClick={() => setPaginaActual('conso')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${paginaActual === 'conso' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px]">Conso IA</span>
        </button>
      </div>
    </div>
  );
}