// src/pages/Market.jsx (Versión Autocontenida con Patrocinadores)
import React, { useState, useEffect } from "react";
import { Phone, Navigation, Search, MapPin, FileText, Video } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const COMERCIOS_DE_PRUEBA = [
  {
    id: 1,
    nombre: "Bar Alonsi",
    categoria: "Hostelería",
    descripcion: "El punto de encuentro de toda la vida en Utrera para disfrutar de unas buenas tapas.",
    direccion: "Plaza del Altozano, Utrera",
    telefono: "600000000",
    whatsapp: "34600000000",
    portada_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
  },
  {
    id: 2,
    nombre: "Panadería Artesana La Almazara",
    categoria: "Comercio",
    descripcion: "Panes tradicionales de hogaza, picos artesanales y dulces caseros de Utrera.",
    direccion: "Calle Ancha, Utrera",
    telefono: "611111111",
    whatsapp: "34611111111",
    portada_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
  }
];

export default function Market() {
  const [comercios, setComercios] = useState(COMERCIOS_DE_PRUEBA);
  const [categoriaSel, setCategoriaSel] = useState("Todos");
  const [comercioSel, setComercioSel] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Estados para Patrocinadores
  const [sponsors, setSponsors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdminSponsors, setShowAdminSponsors] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorLogo, setSponsorLogo] = useState('');
  const [sponsorLink, setSponsorLink] = useState('');

  const categorias = ["Todos", "Hostelería", "Comercio", "Servicios", "Salud y Belleza", "Inmobiliaria (Especial)", "Comida (Especial)"];

  useEffect(() => {
    async function fetchData() {
      setCargando(true);
      try {
        let tabla = 'comercios_utrera';
        if (categoriaSel === "Inmobiliaria (Especial)") {
          tabla = 'especial1_inmobiliaria';
        } else if (categoriaSel === "Comida (Especial)") {
          tabla = 'especial2_comida';
        }

        let query = supabase.from(tabla).select('*');
        if (categoriaSel && categoriaSel !== "Todos" && !categoriaSel.includes("Especial")) {
          query = query.eq('categoria', categoriaSel);
        }
        
        const { data, error } = await query;
        if (!error && data) {
          setComercios(data.length > 0 ? data : COMERCIOS_DE_PRUEBA);
        }
      } catch (err) {
        console.error("Usando datos locales por error de red:", err);
      } finally {
        setCargando(false);
      }
    }
    fetchData();
  }, [categoriaSel]);

  // Cargar y rotar patrocinadores
  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase.from('sponsors').select('*').eq('active', true);
      if (!error && data) setSponsors(data);
    } catch (e) {
      console.log("Tabla sponsors pendiente");
    }
  };

  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors]);

  const handleAddSponsor = async (e) => {
    e.preventDefault();
    if (!sponsorName || !sponsorLogo) return;
    const { error } = await supabase.from('sponsors').insert([{ name: sponsorName, logo_url: sponsorLogo, link: sponsorLink, active: true }]);
    if (!error) {
      setSponsorName(''); setSponsorLogo(''); setSponsorLink('');
      fetchSponsors();
      alert('¡Patrocinador añadido!');
    } else {
      alert('Error al añadir. ¿Has creado la tabla sponsors en Supabase?');
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (confirm('¿Borrar patrocinador?')) {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      if (!error) fetchSponsors();
    }
  };

  const comerciosFiltrados = comercios.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirMapa = (comercio) => {
    const direccionEscapada = encodeURIComponent(`${comercio.direccion || comercio.nombre}, Utrera`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${direccionEscapada}`, "_blank");
  };

  const currentSponsor = sponsors.length > 0 ? sponsors[currentIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800 font-sans">
      
      {/* Cabecera */}
      <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Guía Comercial Utrera</h1>
        <p className="text-xs text-slate-400 mt-1">Negocios, fichas especiales y servicios locales</p>
        
        {/* Buscador */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Buscar comercio o servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-sm border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      {/* CARRUSEL Y GESTIÓN DE PATROCINADORES */}
      <div className="px-4 mt-3 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">⭐ Patrocinadores</span>
          <button 
            onClick={() => setShowAdminSponsors(!showAdminSponsors)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold text-white ${showAdminSponsors ? 'bg-slate-700' : 'bg-red-700'}`}
          >
            {showAdminSponsors ? 'Ver Carrusel' : '⚙️ Gestionar'}
          </button>
        </div>

        {sponsors.length > 0 && !showAdminSponsors && (
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <img src={currentSponsor.logo_url} alt={currentSponsor.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{currentSponsor.name}</h4>
                <span className="text-[10px] text-slate-400">Patrocinador ({currentIndex + 1}/{sponsors.length})</span>
              </div>
            </div>
            {currentSponsor.link && (
              <a href={currentSponsor.link} target="_blank" rel="noreferrer" className="bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ml-2">Visitar</a>
            )}
          </div>
        )}

        {sponsors.length === 0 && !showAdminSponsors && (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">No hay patrocinadores todavía.</p>
            <button onClick={() => setShowAdminSponsors(true)} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold">+ Añadir el primero</button>
          </div>
        )}

        {showAdminSponsors && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md mt-1">
            <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase">Panel Rápido Patrocinadores</h3>
            <form onSubmit={handleAddSponsor} className="flex flex-col gap-2 mb-3">
              <input type="text" placeholder="Nombre" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} className="p-2 text-xs rounded-xl border border-slate-300" required />
              <input type="text" placeholder="URL Logo" value={sponsorLogo} onChange={(e) => setSponsorLogo(e.target.value)} className="p-2 text-xs rounded-xl border border-slate-300" required />
              <input type="text" placeholder="Enlace web (opcional)" value={sponsorLink} onChange={(e) => setSponsorLink(e.target.value)} className="p-2 text-xs rounded-xl border border-slate-300" />
              <button type="submit" className="bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">+ Guardar Patrocinador</button>
            </form>
            {sponsors.length > 0 && (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pt-1 border-t border-slate-100">
                {sponsors.map((s) => (
                  <div key={s.id} className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-medium truncate max-w-[180px]">{s.name}</span>
                    <button onClick={() => handleDeleteSponsor(s.id)} className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">Borrar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categorías */}
      <div className="px-4 mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSel(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              categoriaSel === cat
                ? "bg-slate-900 text-white"
                : cat.includes("Especial")
                ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Comercios */}
      <div className="px-4 mt-4 space-y-4 max-w-lg mx-auto">
        {cargando ? (
          <div className="text-center py-12"><p className="text-slate-500 text-xs font-bold animate-pulse">Cargando...</p></div>
        ) : comerciosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><p className="text-slate-500 font-medium text-sm">No hay comercios.</p></div>
        ) : (
          comerciosFiltrados.map((comercio) => (
            <div key={comercio.id || comercio.nombre} onClick={() => setComercioSel(comercio)} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                  <img src={comercio.portada_url || comercio.logo_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} alt={comercio.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-base truncate">{comercio.nombre}</h3>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-0.5">{comercio.categoria}</p>
                  {comercio.direccion && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate"><MapPin size={12} className="text-slate-400 flex-shrink-0" /><span className="truncate">{comercio.direccion}</span></p>
                  )}
                  {comercio.descripcion && (<p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{comercio.descripcion}</p>)}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setComercioSel(comercio); }} className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center">👁️ Ver Ficha Completa</button>
            </div>
          ))
        )}
      </div>

      {/* MODAL DETALLE */}
      {comercioSel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-5">
            <button onClick={() => setComercioSel(null)} className="absolute top-4 right-4 bg-slate-100 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">✕</button>
            <div className="h-48 bg-slate-100 rounded-2xl overflow-hidden relative mb-4 border border-slate-100">
              <img src={comercioSel.portada_url || comercioSel.logo_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} alt={comercioSel.nombre} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">{comercioSel.nombre}</h2>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mt-0.5">{comercioSel.categoria}</p>
            {comercioSel.direccion && (<p className="text-xs text-slate-500 mt-3">📍 {comercioSel.direccion}</p>)}
            {comercioSel.descripcion && (<p className="text-sm text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{comercioSel.descripcion}</p>)}
            {comercioSel.carta_pdf_url && (
              <a href={comercioSel.carta_pdf_url} target="_blank" rel="noreferrer" className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow"><FileText size={16} /> Ver Carta / Menú en PDF</a>
            )}
            {comercioSel.video_url && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><Video size={14} className="text-rose-600" /> Vídeo Promocional</p>
                <div className="rounded-xl overflow-hidden bg-black aspect-video"><iframe src={comercioSel.video_url} title="Vídeo" className="w-full h-full" allowFullScreen /></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {comercioSel.whatsapp && (
                <a href={`https://wa.me/${comercioSel.whatsapp.replace(/\+/g, "")}`} target="_blank" rel="noreferrer" className="py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow">💬 WhatsApp</a>
              )}
              {comercioSel.telefono && (
                <a href={`tel:${comercioSel.telefono}`} className="py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"><Phone size={14} className="text-emerald-600" /> Llamar</a>
              )}
            </div>
            <button onClick={() => abrirMapa(comercioSel)} className="mt-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"><Navigation size={14} className="text-sky-600" /> Cómo Llegar</button>
          </div>
        </div>
      )}
    </div>
  );
}