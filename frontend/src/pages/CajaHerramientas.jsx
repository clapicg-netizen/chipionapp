import React, { useState } from 'react';
import { Wrench, FileText, Calculator, GraduationCap, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

export default function CajaHerramientas({ setPaginaActual }) {
  const [pestanaActiva, setPestanaActiva] = useState('pdf');
  
  // Estados para Subir Archivo a PDF
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [contenidoLeido, setContenidoLeido] = useState('');

  // Estados para Costes y Autónomos Avanzados
  const [costeBase, setCosteBase] = useState('');
  const [margenDeseado, setMargenDeseado] = useState('');
  const [tipoIrpf, setTipoIrpf] = useState('15');
  const [resultadoCostes, setResultadoCostes] = useState(null);

  // Estados para Estudiantes y Opositores (Método tradicional de repaso)
  const [subEstudio, setSubEstudio] = useState('repaso');
  const [fechaEstudio, setFechaEstudio] = useState('');
  const [resultadoRepasos, setResultadoRepasos] = useState(null);

  // Planificador de Temas (Método de estudio clásico)
  const [numTemasTotal, setNumTemasTotal] = useState('');
  const [temasPorSemana, setTemasPorSemana] = useState('');
  const [planEstudio, setPlanEstudio] = useState(null);

  // Lógica para leer archivo y pasarlo a PDF
  const manejarSubidaArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setNombreArchivo(archivo.name);

    const lector = new FileReader();
    lector.onload = (evento) => {
      setContenidoLeido(evento.target.result);
    };
    // Si es texto plano o similar
    lector.readAsText(archivo);
  };

  const generarPDFDesdeArchivo = () => {
    if (!contenidoLeido.trim()) {
      alert("Sube un archivo de texto válido o escribe contenido.");
      return;
    }
    if (typeof window.jspdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => ejecutarCreacionPDF(contenidoLeido);
      document.head.appendChild(script);
    } else {
      ejecutarCreacionPDF(contenidoLeido);
    }
  };

  const ejecutarCreacionPDF = (texto) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Documento convertido - Utrerapp", 20, 20);
    doc.setFontSize(10);
    const lineas = doc.splitTextToSize(texto, 170);
    doc.text(lineas, 20, 35);
    doc.save("convertido-utrerapp.pdf");
  };

  // Lógica Autónomos Completa (Coste + Margen + IVA + IRPF)
  const calcularAutonomo = () => {
    const coste = parseFloat(costeBase);
    const margen = parseFloat(margenDeseado);
    const irpf = parseFloat(tipoIrpf);

    if (isNaN(coste) || isNaN(margen)) {
      alert("Introduce números válidos para coste y margen.");
      return;
    }

    const precioVentaSinIva = coste / (1 - (margen / 100));
    const beneficioNeto = precioVentaSinIva - coste;
    const cuotaIva = precioVentaSinIva * 0.21;
    const precioTotalConIva = precioVentaSinIva + cuotaIva;
    const retencionIrpf = precioVentaSinIva * (irpf / 100);
    const liquidoEnBolsillo = precioVentaSinIva - retencionIrpf - coste + beneficioNeto; // Estimación limpia

    setResultadoCostes({
      precioVentaSinIva,
      beneficioNeto,
      cuotaIva,
      precioTotalConIva,
      retencionIrpf
    });
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

  // Planificador de vueltas para opositores
  const calcularPlanOposicion = () => {
    const total = parseInt(numTemasTotal);
    const ritmo = parseInt(temasPorSemana);
    if (isNaN(total) || isNaN(ritmo) || ritmo <= 0) {
      alert("Introduce el número total de temas y un ritmo semanal válido.");
      return;
    }
    const semanasEstimadas = Math.ceil(total / ritmo);
    setPlanEstudio({ semanas: semanasEstimadas, total });
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <button 
          onClick={() => setPaginaActual('home')}
          className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg font-medium text-slate-700 transition flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </button>
        <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Wrench size={16} className="text-amber-600" /> Caja de Herramientas
        </h2>
        <div className="w-12"></div>
      </div>

      {/* TEXTO DE BIENVENIDA SOLICITADO */}
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed shadow-sm">
        <p className="font-bold mb-1">🛠️ ¡Bienvenidos a la Caja de Herramientas!</p>
        En todas las casas hay una caja de herramientas y esta no iba a ser menos. Aquí tenéis algunas para empezar, y si estimáis que falta alguna, comunicárnoslo.
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

      {/* Contenido Pestaña 1: Subir Archivo a PDF */}
      {pestanaActiva === 'pdf' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Conversor de Documento a PDF</h3>
          <p className="text-xs text-slate-500">Sube tus apuntes (TXT/Word) y conviértelos a PDF al instante de forma limpia.</p>
          
          <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition">
            <Upload size={24} className="text-amber-600 mb-2" />
            <span className="text-xs font-bold text-slate-700">{nombreArchivo ? nombreArchivo : "Pulsa para subir archivo"}</span>
            <span className="text-[10px] text-slate-400 mt-1">Formatos compatibles (.txt, .md, texto)</span>
            <input type="file" onChange={manejarSubidaArchivo} className="hidden" accept=".txt,.md,.doc,.docx" />
          </label>

          {nombreArchivo && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">
              <CheckCircle2 size={16} /> Archivo cargado listo para exportar.
            </div>
          )}

          <button 
            onClick={generarPDFDesdeArchivo}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
          >
            Convertir y Descargar PDF 📥
          </button>
        </div>
      )}

      {/* Contenido Pestaña 2: Autónomos Avanzado */}
      {pestanaActiva === 'costes' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Calculadora Profesional de Costes y Precios</h3>
          <p className="text-xs text-slate-500">Calcula precios de venta, beneficio, IVA y retenciones para autónomos.</p>
          
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coste Base de Producción / Compra (€)</label>
              <input 
                type="number" 
                value={costeBase} 
                onChange={(e) => setCosteBase(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                placeholder="Ej: 40" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Margen de Beneficio deseado (%)</label>
              <input 
                type="number" 
                value={margenDeseado} 
                onChange={(e) => setMargenDeseado(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                placeholder="Ej: 30" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Retención IRPF aplicable (%)</label>
              <select 
                value={tipoIrpf} 
                onChange={(e) => setTipoIrpf(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none bg-white"
              >
                <option value="15">15% (General)</option>
                <option value="7">7% (Nuevos autónomos)</option>
                <option value="0">0% (Sin retención)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={calcularAutonomo}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
          >
            Calcular Presupuesto Profesional 🧮
          </button>

          {resultadoCostes && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
              <p>• Precio Venta (sin IVA): <strong className="text-blue-600">{resultadoCostes.precioVentaSinIva.toFixed(2)} €</strong></p>
              <p>• Beneficio Neto: <strong className="text-emerald-600">{resultadoCostes.beneficioNeto.toFixed(2)} €</strong></p>
              <p>• IVA (21%): <span className="text-slate-700">{resultadoCostes.cuotaIva.toFixed(2)} €</span></p>
              <p>• Retención IRPF: <span className="text-rose-600">-{resultadoCostes.retencionIrpf.toFixed(2)} €</span></p>
              <div className="pt-1 border-t border-slate-200">
                <p className="font-bold text-slate-900">• Total Factura Cliente (con IVA): <span className="text-amber-700">{resultadoCostes.precioTotalConIva.toFixed(2)} €</span></p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña 3: Estudiantes y Oposiciones (Método Clásico) */}
      {pestanaActiva === 'estudio' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div className="flex space-x-1 mb-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setSubEstudio('repaso')}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${subEstudio === 'repaso' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              📅 Repaso Espaciado
            </button>
            <button 
              onClick={() => setSubEstudio('planificador')}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${subEstudio === 'planificador' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              📚 Plan Vueltas
            </button>
          </div>

          {subEstudio === 'repaso' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Calcula los días clave en el calendario para consolidar la memoria a largo plazo.</p>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fecha en que estudiaste el tema por 1ª vez:</label>
                <input 
                  type="date" 
                  value={fechaEstudio}
                  onChange={(e) => setFechaEstudio(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                />
              </div>
              <button 
                onClick={calcularRepasos}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
              >
                Calcular Fechas de Repaso 📆
              </button>

              {resultadoRepasos && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <p className="font-bold text-slate-700 mb-1">Días recomendados para repasar:</p>
                  {resultadoRepasos.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-slate-500">Repaso Día +{item.dias}:</span>
                      <strong className="text-blue-600">{item.fecha}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {subEstudio === 'planificador' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Organiza tus vueltas al temario de oposición de forma realista.</p>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Número total de temas del temario:</label>
                <input 
                  type="number" 
                  value={numTemasTotal}
                  onChange={(e) => setNumTemasTotal(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                  placeholder="Ej: 45"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Temas que estudias / repasas por semana:</label>
                <input 
                  type="number" 
                  value={temasPorSemana}
                  onChange={(e) => setTemasPorSemana(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none" 
                  placeholder="Ej: 3"
                />
              </div>
              <button 
                onClick={calcularPlanOposicion}
                className="w-full bg-purple-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
              >
                Calcular Tiempo de Vuelta ⏱️
              </button>

              {planEstudio && (
                <div className="p-3 bg-purple-50 rounded-xl text-xs space-y-1 border border-purple-100 text-purple-900">
                  <p>• Temas totales: <strong>{planEstudio.total}</strong></p>
                  <p>• Duración estimada de la vuelta: <strong className="text-purple-700">{planEstudio.semanas} semanas</strong> (aprox. {Math.round(planEstudio.semanas / 4)} meses).</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}