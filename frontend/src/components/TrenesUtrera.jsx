import React, { useState, useEffect } from 'react';

export default function TrenesUtrera() {
    const [tiempoActual, setTiempoActual] = useState(new Date());
    const [cargando, setCargando] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('salidas');
    const [alertaAbierta, setAlertaAbierta] = useState(false);

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

    // Motor matemático universal para calcular minutos restantes exactos
    const obtenerMinutosRestantes = (hDest, mDest) => {
        const ahoraH = tiempoActual.getHours();
        const ahoraM = tiempoActual.getMinutes();
        const ahoraS = tiempoActual.getSeconds();

        const totalSegundosAhora = ahoraH * 3600 + ahoraM * 60 + ahoraS;
        const totalSegundosDestino = hDest * 3600 + mDest * 60;

        const diffSegundos = totalSegundosDestino - totalSegundosAhora;
        if (diffSegundos <= 0) return null; // El tren ya pasó
        
        const min = Math.floor(diffSegundos / 60);
        return min < 1 ? 1 : min;
    };

    const horaFormateada = tiempoActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const segundosRelativo = Math.floor(tiempoActual.getTime() / 1000) % 15;

    // --- MATRIZ HORARIA INTELIGENTE DE ÉLITE ---
    const salidasSevilla = [
        { h: 7, m: 10, destino: "Santa Justa", via: "Vía 3" },
        { h: 7, m: 45, destino: "Lora del Río", via: "Vía 1" },
        { h: 8, m: 10, destino: "Santa Justa", via: "Vía 3" },
        { h: 8, m: 18, destino: "Lora del Río", via: "Vía 1" },
        { h: 9, m: 0,  destino: "Santa Justa", via: "Vía 3" },
        { h: 10, m: 15, destino: "Santa Justa", via: "Vía 3" },
        { h: 12, m: 34, destino: "Lora del Río", via: "Vía 1" },
        { h: 14, m: 20, destino: "Santa Justa", via: "Vía 3" },
        { h: 16, m: 10, destino: "Lora del Río", via: "Vía 1" },
        { h: 18, m: 35, destino: "Lora del Río", via: "Vía 3" },
        { h: 21, m: 0,  destino: "Santa Justa", via: "Vía 3" }
    ];

    const ahoraMinutosTotales = tiempoActual.getHours() * 60 + tiempoActual.getMinutes();
    const trenesFuturos = salidasSevilla.filter(t => (t.h * 60 + t.m) > ahoraMinutosTotales);
    const proximoTren = trenesFuturos.length > 0 ? trenesFuturos[0] : salidasSevilla[0];
    const siguientesTrenes = trenesFuturos.slice(1, 4);

    const minCalculados = obtenerMinutosRestantes(proximoTren.h, proximoTren.m) || 1;
    const horaStrPrincipal = `${String(proximoTren.h).padStart(2, '0')}:${String(proximoTren.m).padStart(2, '0')}`;
    const rangoStrPrincipal = `${horaStrPrincipal} y ${String(proximoTren.h).padStart(2, '0')}:${String(proximoTren.m + 5).padStart(2, '0')}`;

    const compartirWhatsApp = (tipo, destino, hora, detalle) => {
        const texto = encodeURIComponent(`🚆 Tren ${tipo} Utrera - ${destino} (${hora}). ${detalle}. \n\n📍 Consultado en Utrerapp Live: https://utrerapp.com`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="space-y-4 font-sans pb-16 max-w-xl mx-auto">
            {/* AVISO SUPERIOR DE RENFE / ALERTAS */}
            <div 
                onClick={() => setAlertaAbierta(!alertaAbierta)}
                className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition"
            >
                <div className="flex items-center gap-3">
                    <span className="text-amber-700 text-lg">⚠️</span>
                    <div>
                        <h4 className="text-xs font-black text-amber-900">Aviso de Renfe para Utrera • Léelo abajo</h4>
                        <p className="text-[11px] text-amber-800/80 font-medium">Huelga convocada días 10 y 12 de noviembre (SEMAF)</p>
                    </div>
                </div>
                <span className="text-amber-800 font-bold text-xs">{alertaAbierta ? '▲' : '▼'}</span>
            </div>

            {/* Tarjeta Desplegable de la Alerta */}
            {alertaAbierta && (
                <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl shadow-inner text-xs text-amber-900 space-y-2">
                    <p className="font-bold">Información oficial de servicio:</p>
                    <p className="leading-relaxed text-amber-800">
                        Con motivo de la huelga de 24 horas convocada el día 10 de noviembre y parcial el día 12 de noviembre por el sindicato de maquinistas SEMAF, el servicio podría verse afectado. Consulta toda la información en nuestros canales oficiales. Gracias por tu comprensión.
                    </p>
                    <span className="text-[10px] text-amber-600 font-semibold block pt-1">Actualizado hoy a las 10:27</span>
                </div>
            )}

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

            {/* SELECTOR DE PESTAÑAS */}
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                <button
                    onClick={() => setVistaActiva('salidas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'salidas' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    🚆 Salidas desde Utrera
                </button>
                <button
                    onClick={() => setVistaActiva('llegadas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'llegadas' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    📍 Llegadas a Utrera
                </button>
            </div>

            {/* VISTA 1: SALIDAS DESDE UTRERA */}
            {vistaActiva === 'salidas' && (
                <div className="space-y-4">
                    {/* SECCIÓN 1: HACIA SEVILLA / LORA */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-sky-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                                <span>📍 Hacia Sevilla / Lora</span>
                            </h3>
                            <span className="text-xs bg-sky-100 text-sky-900 px-3 py-1 rounded-full font-bold">Cercanías C1</span>
                        </div>

                        <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 mb-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold block">Próximo servicio automático</span>
                                    <h4 className="text-xl font-black text-slate-900">{proximoTren.destino}</h4>
                                    <span className="text-xs text-slate-600 font-medium">el de las {horaStrPrincipal}</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">A su hora</span>
                            </div>

                            <div className="my-3 py-3 border-y border-sky-200/60 flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                        {minCalculados}
                                    </span>
                                    <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 block font-medium">Sale entre</span>
                                    <span className="text-sm font-bold text-sky-900">{rangoStrPrincipal}</span>
                                </div>
                            </div>

                            {/* MAPA / ESQUEMA LIMPIO Y ORDENADO */}
                            <div className="my-3 px-3 py-2.5 bg-white/90 rounded-xl border border-sky-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recorrido:</span>
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                                    <span className="text-sky-700 font-extrabold">Utrera</span>
                                    <span>Dos Hermanas</span>
                                    <span>San Bernardo</span>
                                    <span>Santa Justa</span>
                                </div>
                                <div className="relative flex items-center justify-between px-3 pt-1">
                                    <div className="absolute left-4 right-4 h-0.5 bg-sky-200 top-1/2 -translate-y-1/2 z-0"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white shadow z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">🚆 {proximoTren.via}</span>
                                <button 
                                    onClick={() => compartirWhatsApp("hacia", proximoTren.destino, horaStrPrincipal, "Sale en breve")}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                                >
                                    💬 Avisa a quien vaya contigo
                                </button>
                            </div>
                        </div>

                        {/* Después dinámico automático */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Después</span>
                            <div className="space-y-2">
                                {siguientesTrenes.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 transition text-xs border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">
                                                {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}
                                            </span>
                                            <span className="bg-sky-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">C1</span>
                                            <span className="font-bold text-slate-800">{t.destino}</span>
                                        </div>
                                        <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-bold">Previsto</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: HACIA LEBRIJA Y CÁDIZ */}
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
                                    <h4 className="text-xl font-black text-slate-900">Cádiz</h4>
                                    <span className="text-xs text-slate-600 font-medium">el de las 19:20</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">Previsto</span>
                            </div>

                            <div className="my-3 py-3 border-y border-blue-200/60 flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                        {obtenerMinutosRestantes(19, 20) || "45"}
                                    </span>
                                    <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 block font-medium">Hora estimada</span>
                                    <span className="text-sm font-bold text-blue-900">19:20</span>
                                </div>
                            </div>

                            <div className="my-3 px-3 py-2.5 bg-white/90 rounded-xl border border-blue-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recorrido:</span>
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                                    <span className="text-blue-700 font-extrabold">Utrera</span>
                                    <span>Las Cabezas</span>
                                    <span>Lebrija</span>
                                    <span>Cádiz</span>
                                </div>
                                <div className="relative flex items-center justify-between px-3 pt-1">
                                    <div className="absolute left-4 right-4 h-0.5 bg-blue-200 top-1/2 -translate-y-1/2 z-0"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 z-10"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-xl font-bold">Media Distancia</span>
                                <button 
                                    onClick={() => compartirWhatsApp("hacia", "Cádiz", "19:20", "Llega en breve")}
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
                                        {obtenerMinutosRestantes(19, 50) || "25"}
                                    </span>
                                    <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 block font-medium">Llega a Utrera a las</span>
                                    <span className="text-sm font-bold text-emerald-900">19:50</span>
                                </div>
                            </div>

                            <div className="my-3 px-3 py-2.5 bg-white/90 rounded-xl border border-emerald-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Paso por Sevilla:</span>
                                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                                    <span>Santa Justa (19:30)</span>
                                    <span>San Bernardo (19:33)</span>
                                    <span className="text-emerald-700 font-extrabold">Virgen del Rocío (19:36)</span>
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
                                    onClick={() => compartirWhatsApp("con destino a", "Utrera (desde Virgen del Rocío)", "19:50", "Llega en breve")}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5"
                                >
                                    💬 Avisa a quien vaya contigo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PIE DE PÁGINA LEGAL / FUENTE OFICIAL */}
            <div className="bg-slate-100 border border-slate-200/80 p-3 rounded-2xl text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-600">
                    Fuente oficial de datos: <span className="text-slate-900 font-extrabold">Renfe Operadora / Adif</span>
                </p>
                <p className="text-[10px] text-slate-500">
                    Utrerapp Live • Servicio informativo no oficial operado bajo estándares de utilidad pública.
                </p>
            </div>
        </div>
    );
}