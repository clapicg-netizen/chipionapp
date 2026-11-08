import React, { useState } from 'react';

export default function TrenesUtrera() {
    const [actualizado, setActualizado] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    const [cargando, setCargando] = useState(false);

    const proximosTrenes = [
        { id: "c1_sevilla_01", horaPrevista: "07:15", destino: "Sevilla-Santa Justa (C1)", estado: "A su hora", retrasoMin: 0, via: "1", tipo: "Cercanías" },
        { id: "c1_lora_02", horaPrevista: "07:38", destino: "Lora del Río (C1)", estado: "A su hora", retrasoMin: 0, via: "1", tipo: "Cercanías" },
        { id: "md_cadiz_03", horaPrevista: "08:02", destino: "Cádiz (Media Distancia)", estado: "Previsto", retrasoMin: 0, via: "2", tipo: "Media Distancia" },
        { id: "c1_lebrija_04", horaPrevista: "08:20", destino: "Lebrija (C1)", estado: "Retrasado", retrasoMin: 5, via: "2", tipo: "Cercanías" }
    ];

    const recargarTrenes = () => {
        setCargando(true);
        setTimeout(() => {
            setActualizado(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
            setCargando(false);
        }, 500);
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 font-sans my-4">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                        <span>🚆</span> Estación de Utrera
                    </h3>
                    <p className="text-xs text-gray-400">Actualizado a las {actualizado}</p>
                </div>
                <button 
                    onClick={recargarTrenes} 
                    disabled={cargando}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs px-3 py-2 rounded-xl transition font-medium shadow-sm flex items-center gap-1"
                >
                    {cargando ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            <div className="space-y-2.5">
                {proximosTrenes.map(tren => {
                    const esRetraso = tren.estado === "Retrasado";
                    const colorBorde = esRetraso ? "border-amber-500 bg-amber-50/20" : "border-green-500 bg-gray-50/50";
                    const badgeColor = esRetraso ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800";

                    return (
                        <div key={tren.id} className={`flex items-center justify-between p-3 rounded-xl border-l-4 ${colorBorde} transition hover:bg-gray-50`}>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-bold text-gray-700">{tren.horaPrevista}</span>
                                    <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-semibold">Vía {tren.via}</span>
                                    <span className="text-[10px] text-gray-400">• {tren.tipo}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 block">{tren.destino}</span>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block ${badgeColor} text-xs px-2.5 py-1 rounded-full font-medium`}>
                                    {tren.estado} {tren.retrasoMin > 0 ? `(+${tren.retrasoMin}m)` : ''}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400">
                <span>Cercanías C1 y Media Distancia</span>
                <span className="font-medium text-blue-600">Utrerapp Live</span>
            </div>
        </div>
    );
}