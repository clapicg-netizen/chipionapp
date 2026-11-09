import React, { useState, useEffect } from 'react';

export default function TrenesUtrera() {
    const [datosTrenes, setDatosTrenes] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [pestanaActiva, setPestanaActiva] = useState('sevilla'); // 'sevilla' o 'cadiz'
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
        ? datosTrenes.salidasSevilla.filter(t => (t.h * 60 + t.m) > (proximoSevilla.h * 60 + proximoSevilla.m))
        : [];

    const proximoCadiz = datosTrenes ? obtenerProximo(datosTrenes.salidasCadiz) : null;
    const minCadiz = proximoCadiz ? Math.max((proximoCadiz.h * 60 + proximoCadiz.m) - ahoraMinutos, 1) : 0;
    const siguientesCadiz = datosTrenes && proximoCadiz 
        ? datosTrenes.salidasCadiz.filter(t => (t.h * 60 + t.m) > (proximoCadiz.h * 60 + proximoCadiz.m))
        : [];

    const compartirWhatsApp = (tipo, destino, hora, detalle) => {
        const texto = encodeURIComponent(`🚆 Tren ${tipo} Utrera - ${destino} (${hora}). ${detalle}. \n\n📍 Utrerapp Live: https://utrerapp.com`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#fbf9f4] text-[#2c2416] font-sans pb-20 max-w-xl mx-auto px-4 pt-3 selection:bg-amber-200">
            
            {/* CABECERA PRINCIPAL TIPO AUTOR */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-amber-900/10">
                <h1 className="text-2xl font-black tracking-tight text-[#4a3b2c] font-serif">
                    El tren <span className="text-[#a67c37] font-sans font-bold text-lg">en Utrera</span>
                </h1>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchTrenes}
                        disabled={cargando}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs flex items-center gap-1"
                    >
                        <span>{cargando ? '⌛' : '⚡'}</span> {cargando ? 'Actualizando' : 'Ahora'}
                    </button>
                </div>
            </div>

            {/* PESTAÑAS SUPERIORES ESTILO LÍNEA */}
            <div className="flex gap-4 mb-6 border-b border-amber-900/10 pb-2">
                <button
                    onClick={() => setPestanaActiva('sevilla')}
                    className={`text-lg font-black transition pb-2 relative font-serif ${
                        pestanaActiva === 'sevilla' ? 'text-[#3a2e22] border-b-2 border-[#a67c37]' : 'text-amber-900/40 hover:text-amber-900/70'
                    }`}
                >
                    A Sevilla
                </button>
                <button
                    onClick={() => setPestanaActiva('cadiz')}
                    className={`text-lg font-black transition pb-2 relative font-serif ${
                        pestanaActiva === 'cadiz' ? 'text-[#3a2e22] border-b-2 border-[#a67c37]' : 'text-amber-900/40 hover:text-amber-900/70'
                    }`}
                >
                    A Lebrija y Cádiz
                </button>
            </div>

            {/* AVISO OFICIAL INTEGRADO */}
            <div 
                onClick={() => setAlertaAbierta(!alertaAbierta)}
                className="bg-[#f2ece1] border border-amber-900/15 p-3.5 rounded-2xl shadow-xs mb-6 cursor-pointer hover:bg-[#ede5d8] transition flex items-center justify-between"
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-amber-800 text-base">⚠️</span>
                    <span className="text-xs font-bold text-[#4a3b2c]">
                        Aviso de Renfe para Utrera · <span className="underline font-normal">léelo abajo</span>
                    </span>
                </div>
                <span className="text-amber-900/60 text-xs font-bold">{alertaAbierta ? '▲' : '▼'}</span>
            </div>

            {alertaAbierta && (
                <div className="bg-[#f2ece1] border border-amber-900/20 p-4 rounded-2xl text-xs text-[#4a3b2c] space-y-1 mb-6 shadow-inner">
                    <p className="font-bold">Con motivo de la huelga convocada por el sindicato de maquinistas semaf, el servicio se verá muy afectado.</p>
                    <span className="text-[10px] text-amber-900/60 font-semibold block">Desde ayer a las 19:51</span>
                </div>
            )}

            {/* ================= VISTA SEVILLA ================= */}
            {pestanaActiva === 'sevilla' && proximoSevilla && (
                <div className="space-y-6">
                    {/* TARJETA PRINCIPAL PRÓXIMO TREN */}
                    <div className="bg-white rounded-3xl p-6 shadow-xs border border-amber-900/10 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-sky-700 text-white text-[11px] font-black px-2 py-0.5 rounded-md">C1</span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{proximoSevilla.destino}</h3>
                            </div>
                            <span className="bg-emerald-100/80 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">
                                {proximoSevilla.estado}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 font-medium">el de las <span className="font-bold text-slate-700">{String(proximoSevilla.h).padStart(2, '0')}:{String(proximoSevilla.m).padStart(2, '0')}</span></p>

                        <div className="flex items-baseline justify-between my-4">
                            <div>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                    {minSevilla}–{minSevilla + 5}
                                </span>
                                <span className="text-base font-bold text-slate-600 ml-1">min</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-400 block font-medium">Sale entre</span>
                                <span className="text-sm font-black text-slate-900">
                                    {String(proximoSevilla.h).padStart(2, '0')}:{String(proximoSevilla.m).padStart(2, '0')} y {String(proximoSevilla.h).padStart(2, '0')}:{String(proximoSevilla.m + 5).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 my-4">
                            <span className="bg-[#2c2416] text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs">
                                📌 {proximoSevilla.via}
                            </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium mb-5 bg-[#fbf9f4] p-3 rounded-xl border border-amber-900/5">
                            Empieza su recorrido en Utrera; suele esperar ya en la vía.
                        </p>

                        <button 
                            onClick={() => compartirWhatsApp("hacia", proximoSevilla.destino, `${proximoSevilla.h}:${proximoSevilla.m}`, "Sale en breve")}
                            className="w-full bg-[#d9a441] hover:bg-[#c89435] text-[#2c2416] font-bold text-xs py-3.5 px-4 rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
                        >
                            <span>📤</span> Avisa a quien vaya contigo
                        </button>
                    </div>

                    {/* SECCIÓN DESPUÉS */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-black text-[#4a3b2c] uppercase tracking-wider font-serif">Después</h3>
                        <div className="bg-white rounded-3xl p-4 shadow-xs border border-amber-900/10 divide-y divide-amber-900/5">
                            {siguientesSevilla.map((t, idx) => (
                                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-slate-900 text-sm">{String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}</span>
                                        <span className="bg-sky-700 text-white px-2 py-0.5 rounded text-[10px] font-bold">C1</span>
                                        <span className="font-bold text-slate-800">{t.destino}</span>
                                    </div>
                                    <span className="bg-amber-100/60 text-amber-900 px-3 py-1 rounded-full font-bold">{t.estado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= VISTA CÁDIZ ================= */}
            {pestanaActiva === 'cadiz' && proximoCadiz && (
                <div className="space-y-6">
                    {/* TARJETA PRINCIPAL PRÓXIMO TREN CÁDIZ */}
                    <div className="bg-white rounded-3xl p-6 shadow-xs border border-amber-900/10 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#2c2416] text-white text-[11px] font-black px-2 py-0.5 rounded-md">MD</span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{proximoCadiz.destino}</h3>
                            </div>
                            <span className="bg-emerald-100/80 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">
                                {proximoCadiz.estado}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 font-medium">el de las <span className="font-bold text-slate-700">{String(proximoCadiz.h).padStart(2, '0')}:{String(proximoCadiz.m).padStart(2, '0')}</span></p>

                        <div className="flex items-baseline justify-between my-4">
                            <div>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                    {minCadiz}
                                </span>
                                <span className="text-base font-bold text-slate-600 ml-1">min</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-400 block font-medium">Hora estimada</span>
                                <span className="text-sm font-black text-slate-900">
                                    {String(proximoCadiz.h).padStart(2, '0')}:{String(proximoCadiz.m).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 my-4">
                            <span className="bg-[#2c2416] text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs">
                                📌 {proximoCadiz.via}
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium mb-5 bg-[#fbf9f4] p-3 rounded-xl border border-amber-900/5">
                            Posición por GPS de Renfe
                        </p>

                        <button 
                            onClick={() => compartirWhatsApp("hacia", proximoCadiz.destino, `${proximoCadiz.h}:${proximoCadiz.m}`, "Llega en breve")}
                            className="w-full bg-[#d9a441] hover:bg-[#c89435] text-[#2c2416] font-bold text-xs py-3.5 px-4 rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
                        >
                            <span>📤</span> Avisa a quien vaya contigo
                        </button>
                    </div>

                    {/* SECCIÓN DESPUÉS */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-black text-[#4a3b2c] uppercase tracking-wider font-serif">Después</h3>
                        <div className="bg-white rounded-3xl p-4 shadow-xs border border-amber-900/10 divide-y divide-amber-900/5">
                            {siguientesCadiz.map((t, idx) => (
                                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-slate-900 text-sm">{String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}</span>
                                        <span className="bg-[#2c2416] text-white px-2 py-0.5 rounded text-[10px] font-bold">MD</span>
                                        <span className="font-bold text-slate-800">{t.destino}</span>
                                    </div>
                                    <span className="bg-amber-100/60 text-amber-900 px-3 py-1 rounded-full font-bold">{t.estado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PIE LEGAL */}
            <div className="mt-8 text-center space-y-1 pt-4 border-t border-amber-900/10 text-xs text-amber-900/60">
                <p className="font-bold">Fuente oficial: Renfe / Adif</p>
                <p className="text-[10px]">Utrerapp Live · Servicio automatizado.</p>
            </div>
        </div>
    );
}