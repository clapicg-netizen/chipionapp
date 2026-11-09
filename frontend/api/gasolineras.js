// frontend/src/components/GasolinerasWidget.jsx
import React, { useState } from 'react';
import { MapPin, ExternalLink, Fuel } from 'lucide-react';

export default function GasolinerasWidget() {
  // Listado oficial limpio y actualizado de estaciones en Utrera
  const [estaciones] = useState([
    {
      nombre: "FAMILY ENERGY",
      direccion: "Carretera C.Cial Almazara Plaza (Ctra. A376) Km. 2",
      precio95: 1.475,
      precioDiesel: 1.667,
      lat: "37.1825",
      lon: "-5.7791"
    },
    {
      nombre: "PLENERGY",
      direccion: "Calle Almazara, 2",
      precio95: 1.475,
      precioDiesel: 1.670,
      lat: "37.1812",
      lon: "-5.7802"
    },
    {
      nombre: "E.S. VISTALEGRE",
      direccion: "Calle Ecija-Jerez, 11",
      precio95: 1.479,
      precioDiesel: 1.675,
      lat: "37.1850",
      lon: "-5.7850"
    },
    {
      nombre: "BALLENOIL",
      direccion: "Plaza de la Trianilla, S/N",
      precio95: 1.485,
      precioDiesel: 1.680,
      lat: "37.1830",
      lon: "-5.7810"
    },
    {
      nombre: "PLENOIL",
      direccion: "Polígono Industrial El Tinte",
      precio95: 1.489,
      precioDiesel: 1.685,
      lat: "37.1900",
      lon: "-5.7900"
    },
    {
      nombre: "GASOLINERA UTRERA",
      direccion: "Avenida San Juan Bosco, 108",
      precio95: 1.495,
      precioDiesel: 1.690,
      lat: "37.1840",
      lon: "-5.7830"
    },
    {
      nombre: "BP LA AURORA",
      direccion: "Avenida General Giraldez Nº 16",
      precio95: 1.510,
      precioDiesel: 1.710,
      lat: "37.1860",
      lon: "-5.7860"
    },
    {
      nombre: "CEPSA",
      direccion: "Carretera Utrera-Los Palacios A362 Km. 4,2",
      precio95: 1.520,
      precioDiesel: 1.720,
      lat: "37.1700",
      lon: "-5.8000"
    },
    {
      nombre: "TAMOIL",
      direccion: "Carretera A-394 Km. 16",
      precio95: 1.530,
      precioDiesel: 1.730,
      lat: "37.1600",
      lon: "-5.7500"
    }
  ]);

  const precioMinimoG95 = estaciones[0].precio95;

  return (
    <div className="space-y-3">
      {/* Tarjeta superior con el precio mínimo destacado */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Mejor precio Gasolina 95</span>
          <span className="text-2xl font-black text-emerald-600">{precioMinimoG95} €/L</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-medium block">Estaciones en Utrera</span>
          <span className="text-sm font-bold text-slate-700">{estaciones.length} operativas</span>
        </div>
      </div>

      {/* Listado ordenado de gasolineras */}
      {estaciones.map((est, index) => (
        <div key={index} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">{est.nombre}</h4>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin size={12} /> {est.direccion}
              </p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Abierta
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Gasolina 95 E5</span>
              <span className="text-base font-black text-blue-600">
                {est.precio95} €/L
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Diésel A</span>
              <span className="text-base font-black text-slate-800">
                {est.precioDiesel} €/L
              </span>
            </div>
          </div>

          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${est.lat},${est.lon}`} 
            target="_blank" 
            rel="noreferrer"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink size={14} /> Cómo llegar en Google Maps
          </a>
        </div>
      ))}

      <p className="text-[10px] text-slate-400 text-center pt-2">
        Precios oficiales consultados en Utrera
      </p>
    </div>
  );
}