import React, { useState } from 'react';
import { Wrench, FileText, Calculator, GraduationCap, ArrowLeft } from 'lucide-react';

export default function CajaHerramientas({ setPaginaActual }) {
  const [pestanaActiva, setPestanaActiva] = useState('pdf');
  
  // Estados para Texto a PDF
  const [textoPdf, setTextoPdf] = useState('');

  // Estados para Costes y Márgenes
  const [costeBase, setCosteBase] = useState('');
  const [margenDeseado, setMargenDeseado] = useState('');
  const [resultadoCostes, setResultadoCostes] = useState(null);

  // Estados para Opositores / Estudiantes
  const [subEstudio, setSubEstudio] = useState('repaso');
  const [fechaEstudio, setFechaEstudio] = useState('');
  const [resultadoRepasos, setResultadoRepasos] = useState(null);

  // Pomodoro
  const [tiempoPomodoro, setTiempoPomodoro] = useState(25 * 60);
  const [enPausaPomodoro, setEnPausaPomodoro] = useState(true);

  // Flashcards
  const [preguntaFlash, setPreguntaFlash] = useState('');
  const [respuestaFlash, setRespuestaFlash] = useState('');
  const [listaFlash, setListaFlash] = useState([]);
  const [indiceFlash, setIndiceFlash] = useState(0);
  const [mostrandoRespuesta, setMostrandoRespuesta] = useState(false);

  // Lógica PDF
  const generarPDF = () => {
    if (!textoPdf.trim()) {
      alert("Escribe algo de texto antes de generar el PDF.");
      return;
    }
    if (typeof window.jspdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => ejecutarCreacionPDF();
      document.head.appendChild(script);
    } else {
      ejecutarCreacionPDF();
    }
  };

  const ejecutarCreacionPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Documento - Utrerapp", 20, 20);
    doc.setFontSize(12);
    const lineas = doc.splitTextToSize(textoPdf, 170);
    doc.text(lineas, 20, 35);
    doc.save("documento-utrerapp.pdf");
  };

  // Lógica Costes
  const calcularMargen = () => {
    const coste = parseFloat(costeBase);
    const margen = parseFloat(margenDeseado);
    if (isNaN(coste) || isNaN(margen)) {
      alert("Introduce números válidos.");
      return;
    }
    const precioVenta = coste / (1 - (margen / 100));
    const beneficio = precioVenta - coste;
    const conIva = precioVenta * 1.21;
    setResultadoCostes({ precioVenta, beneficio, conIva });
  };

  // Lógica Repaso Espaciado
  const calcularRepasos = () => {
    if (!fechaEstudio) {
      alert("Selecciona una fecha.");
      return;
    }
    const base = new Date(fechaEstudio);
    const intervalos = [1, 7, 14, 30, 90];
    const fechas = intervalos.map(dias => {
      const f = new Date(base);
      f.setDate(base.getDate() + dias);
      return { dias, fecha: f.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) };
    });
    setResultadoRepasos(fechas);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <button 
          onClick={() => setPaginaActual('home')}
          className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg font-medium text-slate-700 transition flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Volver
        </button>
        <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Wrench size={16} className="text-amber-600" /> Caja de Herramientas
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Pestañas Principales */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl mb-4">
        <button 
          onClick={() => setPestanaActiva('pdf')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${pestanaActiva === 'pdf' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600'}`}
        >
          📄 PDF
        </button>
        <button 
          onClick={() => setPestanaActiva('costes')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${pestanaActiva === 'costes' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600'}`}
        >
          🧮 Autónomos
        </button>
        <button 
          onClick={() => setPestanaActiva('estudio')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${pestanaActiva === 'estudio' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600'}`}
        >
          🎓 Estudio
        </button>
      </div>

      {/* Contenido Pestaña 1: PDF */}
      {pestanaActiva === 'pdf' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Conversor de Texto a PDF</h3>
          <p className="text-xs text-slate-500 mb-3">Escribe o pega tus apuntes y descárgalos al instante.</p>
          <textarea 
            value={textoPdf}
            onChange={(e) => setTextoPdf(e.target.value)}
            rows="5"
            className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none mb-3"
            placeholder="Escribe aquí el contenido..."
          ></textarea>
          <button 
            onClick={generarPDF}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
          >
            Descargar PDF 📥
          </button>
        </div>
      )}

      {/* Contenido Pestaña 2: Autónomos y Costes */}
      {pestanaActiva === 'costes' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Calculadora de Márgenes</h3>
          <p className="text-xs text-slate-500 mb-3">Calcula el precio de venta y beneficios para tu negocio.</p>
          <div className="space-y-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coste Base (€)</label>
              <input 
                type="number" 
                value={costeBase} 
                onChange={(e) => setCosteBase(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                placeholder="Ej: 30" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Margen de Beneficio deseado (%)</label>
              <input 
                type="number" 
                value={margenDeseado} 
                onChange={(e) => setMargenDeseado(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                placeholder="Ej: 35" 
              />
            </div>
          </div>
          <button 
            onClick={calcularMargen}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md mb-3"
          >
            Calcular Precio 🧮
          </button>
          {resultadoCostes && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
              <p>• Precio Venta (sin IVA): <strong className="text-blue-600">{resultadoCostes.precioVenta.toFixed(2)} €</strong></p>
              <p>• Beneficio Neto: <strong className="text-emerald-600">{resultadoCostes.beneficio.toFixed(2)} €</strong></p>
              <p>• Precio Final (con IVA 21%): <strong className="text-slate-900">{resultadoCostes.conIva.toFixed(2)} €</strong></p>
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña 3: Estudiantes y Opositores */}
      {pestanaActiva === 'estudio' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex space-x-1 mb-3 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setSubEstudio('repaso')}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${subEstudio === 'repaso' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              📅 Repasos
            </button>
            <button 
              onClick={() => setSubEstudio('flash')}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${subEstudio === 'flash' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              ⚡ Flashcards
            </button>
          </div>

          {subEstudio === 'repaso' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fecha en que estudiaste el tema:</label>
              <input 
                type="date" 
                value={fechaEstudio}
                onChange={(e) => setFechaEstudio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none mb-3" 
              />
              <button 
                onClick={calcularRepasos}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md mb-3"
              >
                Calcular Fechas Clave 📆
              </button>
              {resultadoRepasos && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <p className="font-bold text-slate-700 mb-1">Días recomendados para repasar:</p>
                  {resultadoRepasos.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-slate-500">Día +{item.dias}:</span>
                      <strong className="text-blue-600">{item.fecha}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {subEstudio === 'flash' && (
            <div>
              <div className="space-y-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Pregunta (ej: Art. 14 CE)" 
                  value={preguntaFlash}
                  onChange={(e) => setPreguntaFlash(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Respuesta (ej: Igualdad ante la ley)" 
                  value={respuestaFlash}
                  onChange={(e) => setRespuestaFlash(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                />
                <button 
                  onClick={() => {
                    if (!preguntaFlash || !respuestaFlash) return;
                    setListaFlash([...listaFlash, { p: preguntaFlash, r: respuestaFlash }]);
                    setIndiceFlash(listaFlash.length);
                    setPreguntaFlash('');
                    setRespuestaFlash('');
                    setMostrandoRespuesta(false);
                  }}
                  className="w-full bg-purple-600 text-white text-xs font-bold py-2 rounded-xl"
                >
                  Añadir Tarjeta 📝
                </button>
              </div>

              {listaFlash.length > 0 && (
                <div 
                  onClick={() => setMostrandoRespuesta(!mostrandoRespuesta)}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center cursor-pointer mt-2"
                >
                  <p className="text-[10px] text-purple-400 mb-1">Tarjeta {indiceFlash + 1} de {listaFlash.length} (Pulsa para girar)</p>
                  <p className="text-xs font-bold text-purple-900">
                    {mostrandoRespuesta ? listaFlash[indiceFlash].r : listaFlash[indiceFlash].p}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}