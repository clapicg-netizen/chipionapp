// frontend/src/pages/Gasolineras.jsx
import React from "react";
import GasolinerasWidget from "../components/GasolinerasWidget";
import { ArrowLeft, Fuel } from "lucide-react";

export default function Gasolineras({ setPaginaActual, setTab }) {
  const volverAHome = (e) => {
    e.preventDefault();
    const fnNavegacion = setPaginaActual || setTab;
    if (typeof fnNavegacion === "function") {
      fnNavegacion("home"); // O la ruta principal que uses
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-800 font-sans">
      {/* CABECERA DE LA SECCIÓN */}
      <div className="bg-slate-900 text-white p-5 rounded-b-3xl shadow-lg relative">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={volverAHome}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <Fuel size={12} /> Ahorro Diario
            </p>
            <h1 className="text-xl font-black mt-0.5">Gasolineras en Utrera</h1>
          </div>
          <div className="w-10"></div> {/* Espaciador simétrico */}
        </div>
      </div>

      {/* CONTENIDO (WIDGET DE PRECIOS) */}
      <div className="px-4 mt-5 max-w-md mx-auto">
        <p className="text-xs text-slate-500 mb-2">
          Precios actualizados en tiempo real de todas las estaciones de servicio del municipio para ayudarte a ahorrar en cada repostaje.
        </p>
        <GasolinerasWidget />
      </div>
    </div>
  );
}