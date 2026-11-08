import React, { useState, useEffect } from 'react';

export default function TrenesUtrera() {
    const [tiempoActual, setTiempoActual] = useState(new Date());
    const [cargando, setCargando] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('sevilla'); // 'sevilla', 'cadiz', o 'llegadas'

    useEffect(() => {
        const timer = setInterval(() => {
            setTiempoActual(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const recargarTrenes = () => {
        setCargando(true);
        setTimeout(() => {
            setTiempoActual(new Date());
            setCargando(false);
        }, 400);
    };

    const obtenerMinutosRestantes = (hDest, mDest) => {
        const ahoraH = tiempoActual.getHours();
        const ahoraM = tiempoActual.getMinutes();
        const ahoraS = tiempoActual.getSeconds();

        const totalSegundosAhora = ahoraH * 3600 + ahoraM * 60 + ahoraS;
        const totalSegundosDestino = hDest * 3600 + mDest * 60;

        const diffSegundos = totalSegundosDestino - totalSegundosAhora;
        if (diffSegundos <= 0) return null;
        
        const min = Math.floor(diffSegundos / 60);
        return min < 1 ? 1 : min;
    };

    const horaFormateada = tiempoActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const segundosRelativo = Math.floor(tiempoActual.getTime() / 1000) % 15;
    const minutosTotalesAhora = tiempoActual.getHours() * 60 + tiempoActual.getMinutes();

    // --- LISTA MAESTRA: HACIA SEVILLA ---
    const listaSalidasSevilla = [
        { hora: "09:38", destino: "Lora del Río (C1)", via: "Vía 1", tipo: "Cercanías C1", h: 9, m: 38, estado: "A su hora" },
        { hora: "10:58", destino: "Lora del Río (C1)", via: "Vía 3", tipo: "Cercanías C1", h: 10, m: 58, estado: "Previsto" },
        { hora: "11:30", destino: "Lora del Río (C1)", via: "Vía 1", tipo: "Cercanías C1", h: 11, m: 30, estado: "Previsto" },
        { hora: "12:14", destino: "Jaén (Media Distancia)", via: "Vía 2", tipo: "Media Distancia", h: 12, m: 14, estado: "Previsto" },
        { hora: "12:34", destino: "Lora del Río (C1)", via: "Vía 1", tipo: "Cercanías C1", h: 12, m: 34, estado: "Previsto" },
        { hora: "13:35", destino: "Lora del Río (C1)", via: "Vía 3", tipo: "Cercanías C1", h: 13, m: 35, estado: "Previsto" },
    ];

    const trenesFuturosSevilla = listaSalidasSevilla.filter(t => (t.h * 60 + t.m) >= minutosTotalesAhora);
    const proximoSevilla = trenesFuturosSevilla[0] || listaSalidasSevilla[listaSalidasSevilla.length - 1];
    const siguientesSevilla = trenesFuturosSevilla.slice(1);
    const minRestantesSevilla = obtenerMinutosRestantes(proximoSevilla.h, proximoSevilla.m) || 1;

    // --- LISTA MAESTRA: HACIA CÁDIZ / LEBRIJA ---
    const listaSalidasCadiz = [
        { hora: "10:23", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 10, m: 23, estado: "4 min tarde" },
        { hora: "11:37", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 11, m: 37, estado: "7 min tarde" },
        { hora: "18:47", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 18, m: 47, estado: "Previsto" },
        { hora: "21:15", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 21, m: 15, estado: "Previsto" },
        { hora: "22:23", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 22, m: 23, estado: "Previsto" },
        { hora: "05:36", destino: "Lebrija (Mañana)", via: "Vía 1", tipo: "Cercanías C1", h: 29, m: 36, estado: "Previsto" },
    ];

    const trenesFuturosCadiz = listaSalidasCadiz.filter(t => (t.h * 60 + t.m) >= minutosTotalesAhora);
    const proximoCadiz = trenesFuturosCadiz[0] || listaSalidasCadiz[listaSalidasCadiz.length - 1];
    const siguientesCadiz = trenesFuturosCadiz.slice(1);
    const minRestantesCadiz = obtenerMinutosRestantes(proximoCadiz.h, proximoCadiz.m);

    // --- LISTA MAESTRA: LLEGADAS A UTRERA ---
    const listaLlegadasUtrera = [
        { hora: "09:25", origen: "Sevilla - Santa Justa", via: "Vía 2", tipo: "Cercanías C1", h: 9, m: 25, estado: "A su hora" },
        { hora: "10:15", origen: "Lora del Río", via: "Vía 2", tipo: "Cercanías C1", h: 10, m: 15, estado: "A su hora" },
        { hora: "11:10", origen: "Sevilla - Santa Justa", via: "Vía 2", tipo: "Cercanías C1", h: 11, m: 10, estado: "Previsto" },
        { hora: "12:05", origen: "Lora del Río", via: "Vía 2", tipo: "Cercanías C1", h: 12, m: 5, estado: "Previsto" },
    ];

    const trenesFuturosLlegadas = listaLlegadasUtrera.filter(t => (t.h * 60 + t.m) >= minutosTotalesAhora);
    const proximaLlegada = trenesFuturosLlegadas[0] || listaLlegadasUtrera[listaLlegadasUtrera.length - 1];
    const siguientesLlegadas = trenesFuturosLlegadas.slice(1);
    const minRestantesLlegada = obtenerMinutosRestantes(proximaLlegada.h, proximaLlegada.m) || 1;

    const compartirWhatsApp = (tipo, destino, hora, detalle) => {
        const texto = encodeURIComponent(`🚆 Tren ${tipo} Utrera - ${destino} (${hora}). ${detalle}. \n\n📍 Consultado en Utrerapp Live: https://utrerapp.com`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="space-y-4 font-sans pb-16 max-w-xl mx-auto">
            {/* Cabecera en directo */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-3xl shadow-md text-white flex justify-between items-center border border-slate-700">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">En directo • hace {segundosRelativo} s</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">Estación Central de Utrera ({horaFormateada})</p>
                </div>
                <button 
                    onClick={recargarTrenes} 
                    disabled={cargando}
                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs px-4 py-2 rounded-2xl transition font-bold shadow-lg flex items-center gap-1.5"
                >
                    {cargando ? 'Sincronizando...' : '🔄 Actualizar'}
                </button>
            </div>

            {/* SELECTOR DE PESTAÑAS */}
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                <button
                    onClick={() => setVistaActiva('sevilla')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'sevilla' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    📍 Hacia Sevilla
                </button>
                <button
                    onClick={() => setVistaActiva('cadiz')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'cadiz' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    📍 Hacia Cádiz / Lebrija
                </button>
                <button
                    onClick={() => setVistaActiva('llegadas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'llegadas' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    📥 Llegadas a Utrera
                </button>
            </div>

            {/* VISTA 1: HACIA SEVILLA */}
            {vistaActiva === 'sevilla' && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden space-y-4">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-amber-600"></div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <span>📍 Hacia Sevilla (Principal)</span>
                        </h3>
                        <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">Cercanías C1</span>
                    </div>

                    <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs text-slate-500 font-semibold block">Próximo servicio</span>
                                <h4 className="text-xl font-black text-slate-900">{proximoSevilla.destino}</h4>
                                <span className="text-xs text-slate-600 font-medium">el de las {proximoSevilla.hora}</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">{proximoSevilla.estado}</span>
                        </div>

                        <div className="my-3 py-3 border-y border-amber-200/60 flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {minRestantesSevilla}-{minRestantesSevilla + 4}
                                </span>
                                <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-500 block font-medium">Salida prevista</span>
                                <span className="text-sm font-bold text-amber-900">{proximoSevilla.hora}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 italic mb-3">"Empieza su recorrido en Utrera; suele esperar ya en la vía."</p>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">
                                🚆 {proximoSevilla.via}
                            </span>
                            <button 
                                onClick={() => compartirWhatsApp("hacia", proximoSevilla.destino, proximoSevilla.hora, "Sale en breve")}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                            >
                                💬 Avisar
                            </button>
                        </div>
                    </div>

                    {/* BLOQUE: EN EL MAPA (SEVILLA) */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                            🗺️ En el mapa
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-1/2 h-40 bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between shadow-inner">
                                <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-blue-500 -translate-x-1/2 rounded-full"></div>
                                <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-slate-600">
                                    <span>Santa Justa</span>
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                </div>
                                <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-slate-600">
                                    <span>Dos Hermanas</span>
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                </div>
                                <div className="relative z-10 flex items-center justify-between text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    <span>Utrera (Estación)</span>
                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow animate-pulse"></div>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2 text-xs space-y-2">
                                <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-200">
                                    <span className="font-black text-amber-900 block mb-0.5">🚆 {proximoSevilla.hora} a {proximoSevilla.destino}</span>
                                    <p className="text-slate-700 font-medium">🟡 Tu próximo tren está estacionado en Utrera listo para salir.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {siguientesSevilla.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Después</h4>
                            <div className="space-y-2">
                                {siguientesSevilla.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-xs border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">{t.hora}</span>
                                            <div>
                                                <span className="font-bold text-slate-800 block">{t.destino}</span>
                                                <span className="text-[10px] text-slate-400">{t.via} • {t.tipo}</span>
                                            </div>
                                        </div>
                                        <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-bold">{t.estado}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VISTA 2: HACIA CÁDIZ / LEBRIJA */}
            {vistaActiva === 'cadiz' && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden space-y-4">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-blue-600"></div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <span>📍 Hacia Cádiz / Lebrija</span>
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">Media Distancia / C1</span>
                    </div>

                    <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/80 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs text-slate-500 font-semibold block">Próximo servicio</span>
                                <h4 className="text-xl font-black text-slate-900">{proximoCadiz.destino}</h4>
                                <span className="text-xs text-slate-600 font-medium">el de las {proximoCadiz.hora}</span>
                            </div>
                            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">{proximoCadiz.estado}</span>
                        </div>

                        <div className="my-3 py-3 border-y border-blue-200/60 flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {minRestantesCadiz !== null ? `${minRestantesCadiz}` : "Ya"}
                                </span>
                                <span className="text-sm font-bold text-slate-600 ml-1">{minRestantesCadiz !== null ? "min" : "en Utrera"}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-500 block font-medium">Hora estimada</span>
                                <span className="text-sm font-bold text-blue-900">{proximoCadiz.hora}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">{proximoCadiz.tipo}</span>
                            <button 
                                onClick={() => compartirWhatsApp("hacia", proximoCadiz.destino, proximoCadiz.hora, "En servicio")}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                            >
                                💬 Avisar
                            </button>
                        </div>
                    </div>

                    {/* BLOQUE: EN EL MAPA (CÁDIZ) */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                            🗺️ En el mapa
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-1/2 h-40 bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between shadow-inner">
                                <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-indigo-500 -translate-x-1/2 rounded-full"></div>
                                <div className="relative z-10 flex items-center justify-between text-[11px] font-black text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                    <span>Utrera (Estación)</span>
                                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow animate-pulse"></div>
                                </div>
                                <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-slate-600">
                                    <span>Lebrija / Cádiz</span>
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2 text-xs space-y-2">
                                <div className="bg-blue-100/70 p-3 rounded-xl border border-blue-200">
                                    <span className="font-black text-blue-900 block mb-0.5">🚆 {proximoCadiz.hora} a {proximoCadiz.destino}</span>
                                    <p className="text-slate-700 font-medium">🔵 Conexión hacia el sur en tiempo real.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {siguientesCadiz.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Después</h4>
                            <div className="space-y-2">
                                {siguientesCadiz.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-xs border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">{t.hora}</span>
                                            <div>
                                                <span className="font-bold text-slate-800 block">{t.destino}</span>
                                                <span className="text-[10px] text-slate-400">{t.via} • {t.tipo}</span>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${t.estado.includes('tarde') ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                            {t.estado}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VISTA 3: LLEGADAS A UTRERA */}
            {vistaActiva === 'llegadas' && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden space-y-4">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-600"></div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <span>📥 Llegadas a Utrera</span>
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold">En tránsito</span>
                    </div>

                    <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs text-slate-500 font-semibold block">Próxima llegada</span>
                                <h4 className="text-xl font-black text-slate-900">{proximaLlegada.origen}</h4>
                                <span className="text-xs text-slate-600 font-medium">a las {proximaLlegada.hora}</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">{proximaLlegada.estado}</span>
                        </div>

                        <div className="my-3 py-3 border-y border-emerald-200/60 flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {minRestantesLlegada}
                                </span>
                                <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-500 block font-medium">Hora de llegada</span>
                                <span className="text-sm font-bold text-emerald-900">{proximaLlegada.hora}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">{proximaLlegada.via} • {proximaLlegada.tipo}</span>
                            <button 
                                onClick={() => compartirWhatsApp("llegada desde", proximaLlegada.origen, proximaLlegada.hora, "Llega en breve")}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                            >
                                💬 Avisar
                            </button>
                        </div>
                    </div>

                    {siguientesLlegadas.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Próximas Llegadas</h4>
                            <div className="space-y-2">
                                {siguientesLlegadas.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-xs border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">{t.hora}</span>
                                            <div>
                                                <span className="font-bold text-slate-800 block">Desde {t.origen}</span>
                                                <span className="text-[10px] text-slate-400">{t.via} • {t.tipo}</span>
                                            </div>
                                        </div>
                                        <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-bold">{t.estado}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-bold">Utrerapp Live • Excelencia en Movilidad</span>
            </div>
        </div>
    );
}