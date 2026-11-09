import React, { useState, useEffect } from 'react';

export default function TrenesUtrera() {
    const [datosTrenes, setDatosTrenes] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [vistaActiva, setVistaActiva] = useState('salidas');
    const [alertaAbierta, setAlertaAbierta] = useState(false);
    const [tiempoActual, setTiempoActual] = useState(new Date());

    const fetchTrenes = async () => {
        try {
            setCargando(true);
            const res = await fetch('/api/trenes');
            const data = await res.json();
            setDatosTrenes(data);
        } catch (err) {
            console.error("Error sincronizando trenes:", err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchTrenes();
        const intervalApi = setInterval(fetchTrenes, 30000);
        const timerClock = setInterval(() => setTiempoActual(new Date()), 1000);

        return () => {
            clearInterval(intervalApi);
            clearInterval(timerClock);
        };
    }, []);

    const ahoraMinutos = tiempoActual.getHours() * 60 + tiempoActual.getMinutes();

    const obtenerProximo = (lista) => {
        if (!lista) return null;
        const futuros = lista.filter(t => (t.h * 60 + t.m) >= ahoraMinutos);
        return futuros.length > 0 ? futuros[0] : lista[0];
    };

    const proximoSevilla = datosTrenes ? obtenerProximo(datosTrenes.salidasSevilla) : null;
    const minSevilla = proximoSevilla ? Math.max((proximoSevilla.h * 60 + proximoSevilla.m) - ahoraMinutos, 1) : 0;
    const siguientesSevilla = datosTrenes && proximoSevilla 
        ? datosTrenes.salidasSevilla.filter(t => (t.h * 60 + t.m) > (proximoSevilla.h * 60 + proximoSevilla.m)).slice(0, 3) 
        : [];

    const proximoCadiz = datosTrenes ? obtenerProximo(datosTrenes.salidasCadiz) : null;
    const minCadiz = proximoCadiz ? Math.max((proximoCadiz.h * 60 + proximoCadiz.m) - ahoraMinutos, 1) : 0;

    const compartirWhatsApp = (tipo, destino, hora, detalle) => {
        const texto = encodeURIComponent(`🚆 Tren ${tipo} Utrera - ${destino} (${hora}). ${detalle}. \n\n📍 Utrerapp Live: https://utrerapp.com`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="space-y-4 font-sans pb-16 max-w-xl mx-auto">
            {/* AVISO OFICIAL */}
            <div 
                onClick={() => setAlertaAbierta(!alertaAbierta)}
                className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition"
            >
                <div className="flex items-center gap-3">
                    <span className="text-amber-700 text-lg">⚠️</span>
                    <div>
                        <h4 className="text-xs font-black text-amber-900">Aviso de Renfe para Utrera</h4>
                        <p className="text-[11px] text-amber-800/80 font-medium">Huelga convocada sindicato SEMAF</p>
                    </div>
                </div>
                <span className="text-amber-800 font-bold text-xs">{alertaAbierta ? '▲' : '▼'}</span>
            </div>

            {alertaAbierta && (
                <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl shadow-inner text-xs text-amber-900 space-y-2">
                    <p className="font-bold">Información oficial:</p>
                    <p className="leading-relaxed text-amber-800">
                        El servicio de cercanías y media distancia puede verse afectado por convocatorias de huelga. Consulta los paneles de estación.
                    </p>
                </div>
            )}

            {/* CABECERA EN DIRECTO */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-3xl shadow-md text-white flex justify-between items-center border border-slate-700">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Sincronizado con Renfe</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">Estación Central de Utrera ({tiempoActual.toLocaleTimeString()})</p>
                </div>
                <button 
                    onClick={fetchTrenes} 
                    disabled={cargando}
                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs px-4 py-2 rounded-2xl transition font-bold shadow-lg"
                >
                    {cargando ? 'Actualizando...' : '🔄 Actualizar'}
                </button>
            </div>

            {/* PESTAÑAS */}
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                <button
                    onClick={() => setVistaActiva('salidas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'salidas' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                    }`}
                >
                    🚆 Salidas desde Utrera
                </button>
                <button
                    onClick={() => setVistaActiva('llegadas')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        vistaActiva === 'llegadas' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                    }`}
                >
                    📍 Llegadas a Utrera
                </button>
            </div>

            {/* VISTA SALIDAS */}
            {vistaActiva === 'salidas' && proximoSevilla && (
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-sky-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-900 text-lg">📍 Hacia Sevilla / Lora</h3>
                            <span className="text-xs bg-sky-100 text-sky-900 px-3 py-1 rounded-full font-bold">Cercanías C1</span>
                        </div>

                        <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 mb-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold block">Próximo servicio en directo</span>
                                    <h4 className="text-xl font-black text-slate-900">{proximoSevilla.destino}</h4>
                                    <span className="text-xs text-slate-600 font-medium">Salida oficial: {String(proximoSevilla.h).padStart(2, '0')}:{String(proximoSevilla.m).padStart(2, '0')}</span>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${proximoSevilla.retrasoMin > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                    {proximoSevilla.estado}
                                </span>
                            </div>

                            <div className="my-3 py-3 border-y border-sky-200/60 flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{minSevilla}</span>
                                    <span className="text-sm font-bold text-slate-600 ml-1">min</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 block font-medium">Vía asignada</span>
                                    <span className="text-sm font-bold text-sky-900">{proximoSevilla.via}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => compartirWhatsApp("hacia", proximoSevilla.destino, `${proximoSevilla.h}:${proximoSevilla.m}`, "Sale en breve")}
                                className="w-full mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold transition shadow flex items-center justify-center gap-1.5"
                            >
                                💬 Avisa a quien vaya contigo
                            </button>
                        </div>

                        {/* DESPUÉS */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Después</span>
                            <div className="space-y-2">
                                {siguientesSevilla.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">{String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}</span>
                                            <span className="font-bold text-slate-800">{t.destino}</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full font-bold ${t.retrasoMin > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'}`}>
                                            {t.estado}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PIE LEGAL */}
            <div className="bg-slate-100 border border-slate-200/80 p-3 rounded-2xl text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-600">
                    Fuente oficial de datos: <span className="text-slate-900 font-extrabold">Renfe Operadora / Adif</span>
                </p>
                <p className="text-[10px] text-slate-500">Utrerapp Live • Servicio automatizado en tiempo real.</p>
            </div>
        </div>
    );
}