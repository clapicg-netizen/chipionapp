import React, { useState, useEffect } from 'react';
import { getUtreraFuelPrices } from '../lib/fuelService';

export default function GasolinerasWidget() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await getUtreraFuelPrices();
        console.log("Datos de gasolineras recibidos:", data);
        if (data && Array.isArray(data)) {
          setStations(data);
        }
      } catch (err) {
        console.error("Error al cargar gasolineras:", err);
        setError("No se pudieron cargar los precios en este momento.");
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-slate-500 my-4 border border-slate-100">
        <div className="animate-spin text-2xl mb-2">⛽</div>
        <p className="text-xs font-semibold">Consultando precios en tiempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 rounded-2xl shadow-sm p-6 text-center text-rose-600 my-4 border border-rose-100 text-xs font-medium">
        {error}
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="bg-amber-50 rounded-2xl shadow-sm p-6 text-center text-amber-700 my-4 border border-amber-100 text-xs">
        ⚠️ No se han encontrado estaciones de servicio activas en Utrera en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stations.map((station, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{station.name || "Estación de Servicio"}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{station.address || "Utrera"}</p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">
              Abierta
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block">Gasolina 95 E5</span>
              <span className="text-base font-black text-blue-600">
                {station.price95 ? `${station.price95} €/L` : "No disponible"}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block">Diésel A</span>
              <span className="text-base font-black text-slate-800">
                {station.priceDiesel ? `${station.priceDiesel} €/L` : "No disponible"}
              </span>
            </div>
          </div>
        </div>
      ))}

      <p className="text-[10px] text-slate-400 text-center pt-2">
        Fuente oficial: Ministerio para la Transición Ecológica
      </p>
    </div>
  );
}