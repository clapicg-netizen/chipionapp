import React, { useState, useEffect } from 'react';
import { getUtreraFuelPrices } from '../lib/fuelService';

export default function GasolinerasWidget() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrices() {
      const data = await getUtreraFuelPrices();
      setStations(data);
      setLoading(false);
    }
    loadPrices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 text-center text-gray-500 my-4">
        ⛽ Consultando precios en las gasolineras de Utrera...
      </div>
    );
  }

  if (stations.length === 0) {
    return null; // Si hay algún fallo o no hay datos, no muestra nada
  }

  // Ordenamos para encontrar las más económicas de 95 y Diésel
  const sortedBy95 = [...stations].filter(s => s.price95).sort((a, b) => a.price95 - b.price95);
  const sortedByDiesel = [...stations].filter(s => s.priceDiesel).sort((a, b) => a.priceDiesel - b.priceDiesel);

  const cheapest95 = sortedBy95[0];
  const cheapestDiesel = sortedByDiesel[0];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 my-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>⛽</span> Gasolineras en Utrera
        </h3>
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
          En tiempo real
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gasolina 95 */}
        {cheapest95 && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 font-medium uppercase">Gasolina 95 (Más barata)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xl font-extrabold text-blue-600">{cheapest95.price95} €/L</span>
              <span className="text-sm font-semibold text-gray-700">{cheapest95.name}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">{cheapest95.address}</p>
          </div>
        )}

        {/* Diésel A */}
        {cheapestDiesel && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 font-medium uppercase">Diésel A (Más barato)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xl font-extrabold text-blue-600">{cheapestDiesel.priceDiesel} €/L</span>
              <span className="text-sm font-semibold text-gray-700">{cheapestDiesel.name}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">{cheapestDiesel.address}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 text-right mt-3">
        Fuente: Ministerio para la Transición Ecológica
      </p>
    </div>
  );
}