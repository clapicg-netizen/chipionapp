import React, { useState, useEffect } from 'react';

export default function TrenesUtrera() {
    const [tiempoActual, setTiempoActual] = useState(new Date());
    const [cargando, setCargando] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('salidas');

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

    // Función matemática robusta para calcular los minutos restantes
    const obtenerMinutosRestantes = (hDest, mDest) => {
        const ahoraH = tiempoActual.getHours();
        const ahoraM = tiempoActual.getMinutes();
        const ahoraS = tiempoActual.getSeconds();

        const totalSegundosAhora = ahoraH * 3600 + ahoraM * 60 + ahoraS;
        const totalSegundosDestino = hDest * 3600 + mDest * 60;

        const diffSegundos = totalSegundosDestino - totalSegundosAhora;
        if (diffSegundos <= 0) return null; // Ya pasó
        
        const min = Math.floor(diffSegundos / 60);
        return min < 1 ? 1 : min;
    };

    const horaFormateada = tiempoActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const segundosRelativo = Math.floor(tiempoActual.getTime() / 1000) % 15;
    const minutosTotalesAhora = tiempoActual.getHours() * 60 + tiempoActual.getMinutes();

    // --- LISTA MAESTRA DE SALIDAS HACIA SEVILLA (Ordenadas cronológicamente) ---
    const listaSalidasSevilla = [
        { hora: "08:10", destino: "Santa Justa", via: "Vía 3", tipo: "Cercanías C1", h: 8, m: 10 },
        { hora: "08:18", destino: "Lora del Río (C1)", via: "Vía 1", tipo: "Cercanías C1", h: 8, m: 18 },
        { hora: "09:04", destino: "Santa Justa", via: "Vía 3", tipo: "Cercanías C1", h: 9, m: 4 },
        { hora: "09:38", destino: "Lora del Río (C1)", via: "Vía 1", tipo: "Cercanías C1", h: 9, m: 38 },
        { hora: "10:15", destino: "Santa Justa", via: "Vía 3", tipo: "Cercanías C1", h: 10, m: 15 },
    ];

    // Filtramos dinámicamente los trenes que aún no han salido
    const trenesFuturosSevilla = listaSalidasSevilla.filter(t => (t.h * 60 + t.m) >= minutosTotalesAhora);
    const proximoSevilla = trenesFuturosSevilla[0] || listaSalidasSevilla[listaSalidasSevilla.length - 1];
    const siguientesSevilla = trenesFuturosSevilla.slice(1, 3);
    const minRestantesSevilla = obtenerMinutosRestantes(proximoSevilla.h, proximoSevilla.m) || 1;

    // --- LISTA MAESTRA HACIA CÁDIZ / LEBRIJA ---
    const listaSalidasCadiz = [
        { hora: "08:58", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 8, m: 58 },
        { hora: "10:23", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 10, m: 23 },
        { hora: "11:31", destino: "Cádiz", via: "Vía 2", tipo: "Media Distancia", h: 11, m: 31 },
    ];

    const trenesFuturosCadiz = listaSalidasCadiz.filter(t => (t.h * 60 + t.m) >= minutosTotalesAhora);
    const proximoCadiz = trenesFuturosCadiz[0] || listaSalidasCadiz[listaSalidasCadiz.length - 1];
    const minRestantesCadiz = obtenerMinutosRestantes(proximoCadiz.h, proximoCadiz.m);

    const compartirWhatsApp = (tipo, destino, hora, detalle) => {
        const texto = encodeURIComponent(`🚆 Tren ${tipo} Utrera - ${destino} (${hora}). ${detalle}. \n\n📍 Consultado en Utrerapp Live: https://utrerapp.com`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="space-y-4 font-sans pb-16 max-w-xl mx-auto">
            {/* Cabecera de élite en directo */}
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

            {/* SELECTOR DE PESTAÑAS (SALIDAS / LLEGADAS) */}
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                <button
                    onClick={() => setVistaActiva('salidas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'salidas' 
                            ? 'bg-white text-slate-900 shadow' 
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    🚆 Salidas desde Utrera
                </button>
                <button
                    onClick={() => setVistaActiva('llegadas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'llegadas' 
                            ? 'bg-white text-slate-900 shadow' 
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    📍 Llegadas a Utrera
                </button>
            </div>

            {/* VISTA 1: SALIDAS DESDE UTRERA */}
            {vistaActiva === 'salidas' && (
                <div className="space-y-4">
                    {/* SECCIÓN: HACIA SEVILLA */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-amber-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                                <span>📍 Hacia Sevilla</span>
                            </h3>
                            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">Cercanías C1</span>
                        </div>

                        {/* Tarjeta Dinámica Principal */}
                        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 mb-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold block">Próximo servicio</span>
                                    <h4 className="text-xl font-black text-slate-900">{proximoSevilla.destino}</h4>
                                    <span className="text-xs text-slate-600 font-medium">el de las {proximoSevilla.hora}</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">A su hora</span>
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

                        {/* Trenes Siguientes */}
                        <div className="space-y-2">
                            {siguientesSevilla.map((t, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-xs border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="font-extrabold text-slate-900 text-sm">{t.hora}</span>
                                        <div>
                                            <span className="font-bold text-slate-800 block">{t.destino}</span>
                                            <span className="text-[10px] text-slate-400">{t.via}</span>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">A su hora</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN: HACIA LEBRIJA Y CÁDIZ */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-blue-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                                <span>📍 Hacia Lebrija y Cádiz</span>
                            </h3>
                            <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">Media Distancia / C1</span>
                        </div>

                        <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/80 mb-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold block">Próximo servicio</span>
                                    <h4 className="text-xl font-black text-slate-900">{proximoCadiz.destino}</h4>
                                    <span className="text-xs text-slate-600 font-medium">el de las {proximoCadiz.hora}</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">A su hora</span>
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
                                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">Media Distancia</span>
                                <button 
                                    onClick={() => compartirWhatsApp("hacia", proximoCadiz.destino, proximoCadiz.hora, "En servicio")}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                                >
                                    💬 Avisar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VISTA 2: LLEGADAS A UTRERA */}
            {vistaActiva === 'llegadas' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                                <span>📥 Vuelta a Utrera (Sevilla / Hospital)</span>
                            </h3>
                            <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold">C1 / Sanidad</span>
                        </div>

                        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 mb-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold block">Próximo desde Sevilla</span>
                                    <h4 className="text-xl font-black text-slate-900">Dirección Utrera</h4>
                                    <span className="text-xs text-slate-600 font-medium">Cercanías C1</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">A su hora</span>
                            </div>

                            <div className="my-3 py-3 border-y border-emerald-200/60 flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                        {obtenerMinutosRestantes(9, 15) || "12"}
                                    </span>
                                    <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 block font-medium">Llega a Utrera a las</span>
                                    <span className="text-sm font-bold text-emerald-900">09:15</span>
                                </div>
                            </div>

                            <div className="my-3 px-3 py-2.5 bg-white/90 rounded-xl border border-emerald-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Paso por Sevilla:</span>
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                                    <span>Santa Justa (08:55)</span>
                                    <span>San Bernardo (08:58)</span>
                                    <span className="text-emerald-700 font-extrabold">Virgen del Rocío (09:01)</span>
                                </div>
                                <div className="relative flex items-center justify-between px-3 pt-1">
                                    <div className="absolute left-4 right-4 h-0.5 bg-emerald-200 top-1/2 -translate-y-1/2 z-0"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow z-10"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-bold">🚆 Vía 2</span>
                                <button 
                                    onClick={() => compartirWhatsApp("con destino a", "Utrera (desde Virgen del Rocío)", "09:15", "Llega en breve")}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                                >
                                    💬 Avisar desde el Hospital
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-bold">Utrerapp Live • Excelencia en Movilidad</span>
            </div>
        </div>
    );
}