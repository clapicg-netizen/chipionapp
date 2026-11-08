import React, { useState } from 'react';

export default function TrenesUtrera() {
    const [actualizado, setActualizado] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    const [cargando, setCargando] = useState(false);

    const recargarTrenes = () => {
        setCargando(true);
        setTimeout(() => {
            setActualizado(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
            setCargando(false);
        }, 500);
    };

    const compartirWhatsApp = (destino, hora) => {
        const texto = encodeURIComponent(`🚆 Tren desde Utrera hacia ${destino} a las ${hora}. ¡Consultado en Utrerapp!`);
        window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
    };

    return (
        <div className="space-y-4 font-sans pb-6">
            {/* Cabecera de estado */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">En directo</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Actualizado a las {actualizado}</p>
                </div>
                <button 
                    onClick={recargarTrenes} 
                    disabled={cargando}
                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs px-3.5 py-2 rounded-xl transition font-medium shadow-sm flex items-center gap-1.5"
                >
                    {cargando ? 'Actualizando...' : '🔄 Actualizar'}
                </button>
            </div>

            {/* SECCIÓN: DIRECCIÓN SEVILLA */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-600"></div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>📍 Hacia Sevilla</span>
                    </h3>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold">Cercanías C1</span>
                </div>

                {/* Tren principal / Destacado */}
                <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-100/60 mb-3">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Próximo a las 07:15</span>
                            <h4 className="text-lg font-extrabold text-slate-900">Sevilla-Santa Justa</h4>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">A su hora</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200/40">
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-800 text-white px-2 py-1 rounded-lg font-semibold">Vía 1</span>
                            <span className="text-xs text-slate-500">Recorrido habitual</span>
                        </div>
                        <button 
                            onClick={() => compartirWhatsApp("Sevilla-Santa Justa", "07:15")}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-medium transition shadow-sm flex items-center gap-1"
                        >
                            💬 Avisar
                        </button>
                    </div>
                </div>

                {/* Lista de siguientes trenes hacia Sevilla */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-sm">07:38</span>
                            <div>
                                <span className="font-semibold text-slate-700 block">Lora del Río (C1)</span>
                                <span className="text-[10px] text-slate-400">Vía 1</span>
                            </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">A su hora</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-sm">08:20</span>
                            <div>
                                <span className="font-semibold text-slate-700 block">Lebrija (C1)</span>
                                <span className="text-[10px] text-slate-400">Vía 2</span>
                            </div>
                        </div>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Retrasado (+5m)</span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: DIRECCIÓN CÁDIZ / LEBRIJA */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>📍 Hacia Cádiz / Lebrija</span>
                    </h3>
                    <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full font-semibold">Media Distancia / C1</span>
                </div>

                {/* Tren principal / Destacado */}
                <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100/60 mb-3">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Próximo a las 08:02</span>
                            <h4 className="text-lg font-extrabold text-slate-900">Cádiz (Media Distancia)</h4>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">Previsto</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200/40">
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-800 text-white px-2 py-1 rounded-lg font-semibold">Vía 2</span>
                            <span className="text-xs text-slate-500">Media Distancia</span>
                        </div>
                        <button 
                            onClick={() => compartirWhatsApp("Cádiz", "08:02")}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-medium transition shadow-sm flex items-center gap-1"
                        >
                            💬 Avisar
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400 font-medium">Utrerapp Live • Servicio de Estación</span>
            </div>
        </div>
    );
}