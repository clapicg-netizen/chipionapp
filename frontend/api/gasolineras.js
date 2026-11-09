// frontend/src/components/GasolinerasWidget.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, AlertCircle } from 'lucide-react';

export default function GasolinerasWidget() {
  const [estaciones, setEstaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarPreciosUtrera() {
      try {
        // Endpoint oficial directo para Utrera (Código INE: 3095)
        const respuesta = await fetch(
          'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/3095',
          { cache: 'no-store' }
        );
        
        if (!respuesta.ok) {
          throw new Error('Error al conectar con la fuente oficial.');
        }

        const datos = await respuesta.json();
        const lista = datos.ListaEstacionesServicio || [];

        if (lista.length === 0) {
          setEstaciones([]);
          setCargando(false);
          return;
        }

        // Mapear y limpiar los datos de cada estación
        const procesadas = lista.map(item => ({
          nombre: item['Rótulo'] || 'Estación de Servicio',
          direccion: item['Dirección'] || 'Utrera',
          precioG95: parseFloat((item['Precio Gasolina 95 E5'] || '999').replace(',', '.')) || 999,
          precioDiesel: parseFloat((item['Precio Dísel A'] || item['Precio Diésel A'] || item['Precio Diesel A'] || '999').replace(',', '.')) || 999,
          lat: (item['Latitud (WGS84)'] || '').replace(',', '.'),
          lon: (item['Longitud (WGS84)'] || '').replace(',', '.')
        }));

        // Ordenar de más barata a más cara según Gasolina 95
        procesadas.sort((a, b) => a.precioG95 - b.precioG95);

        setEstaciones(procesadas);
        setCargando(false);
      } catch (err) {
        console.error("Error cargando gasolineras:", err);
        setError("No se pudieron cargar los precios actualizados.");
        setCargando(false);
      }
    }

    cargarPreciosUtrera();
  }, []);

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100 my-4">
        <div className="animate-spin text-2xl mb-2">⛽</div>
        <p className="text-xs font-semibold text-slate-500">Consultando precios oficiales en tiempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 rounded-3xl p-6 text-center text-rose-600 my-4 border border-rose-100 text-xs font-medium">
        {error}
      </div>
    );
  }

  if (estaciones.length === 0) {
    return (
      <div className="bg-amber-50 rounded-3xl p-6 text-center text-amber-700 my-4 border border-amber-100 text-xs flex items-center justify-center gap-2">
        <AlertCircle size={16} /> No se han encontrado estaciones activas en Utrera en este momento.
      </div>
    );
  }

  const precioMinimoG95 = estaciones[0].precioG95 !== 999 ? estaciones[0].precioG95 : null;

  return (
    <div className="space-y-3">
      {precioMinimoG95 && (
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
      )}

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
                {est.precioG95 === 999 ? 'No disponible' : `${est.precioG95} €/L`}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Diésel A</span>
              <span className="text-base font-black text-slate-800">
                {est.precioDiesel === 999 ? 'No disponible' : `${est.precioDiesel} €/L`}
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
        Fuente oficial: Ministerio para la Transición Ecológica
      </p>
    </div>
  );
}