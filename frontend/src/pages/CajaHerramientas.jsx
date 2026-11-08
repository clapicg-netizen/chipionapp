import React, { useState, useEffect } from 'react';

export default function CajaHerramientas({ setPaginaActual }) {
    // Estado para cambiar entre pestañas principales ('pdf', 'costes', 'estudio')
    const [pestanaActiva, setPestanaActiva] = useState('pdf');

    // Estado para sub-pestañas de estudio ('flash', 'repaso', 'pomodoro', 'enlaces')
    const [subEstudio, setSubEstudio] = useState('flash');

    // Estados para PDF
    const [textoPdf, setTextoPdf] = useState('');

    // Estados para Costes / Autónomos
    const [costeBase, setCosteBase] = useState('');
    const [margenBeneficio, setMargenBeneficio] = useState('');
    const [resultadoCostes, setResultadoCostes] = useState(null);

    // Estados para Opositores y Estudiantes (Repaso Espaciado)
    const [fechaEstudio, setFechaEstudio] = useState('');
    const [resultadoRepasos, setResultadoRepasos] = useState(null);

    // Estados para Pomodoro
    const [tiempoPomodoro, setTiempoPomodoro] = useState(25 * 60);
    const [pomodoroActivo, setPomodoroActivo] = useState(false);

    // Estados para Flashcards
    const [flashPregunta, setFlashPregunta] = useState('');
    const [flashRespuesta, setFlashRespuesta] = useState('');
    const [flashcardsLista, setFlashcardsLista] = useState([]);
    const [indiceActual, setIndiceActual] = useState(0);
    const [mostrandoRespuesta, setMostrandoRespuesta] = useState(false);

    // Cargar flashcards guardadas al iniciar
    useEffect(() => {
        const guardadas = localStorage.getItem('utrerapp_flashcards');
        if (guardadas) {
            setFlashcardsLista(JSON.parse(guardadas));
        }
    }, []);

    // Efecto para el temporizador Pomodoro
    useEffect(() => {
        let interval = null;
        if (pomodoroActivo && tiempoPomodoro > 0) {
            interval = setInterval(() => {
                setTiempoPomodoro((prev) => prev - 1);
            }, 1000);
        } else if (tiempoPomodoro === 0) {
            setPomodoroActivo(false);
            alert('¡Tiempo cumplido! Toca descansar un poco.');
        }
        return () => clearInterval(interval);
    }, [pomodoroActivo, tiempoPomodoro]);

    // Generar PDF
    const generarPDFDesdeTexto = () => {
        if (!textoPdf.trim()) {
            alert('Escribe algo de texto antes de generar el PDF.');
            return;
        }

        if (typeof window.jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => ejecutarCreacionPDF(textoPdf);
            document.head.appendChild(script);
        } else {
            ejecutarCreacionPDF(textoPdf);
        }
    };

    const ejecutarCreacionPDF = (texto) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(16);
        doc.text('Documento Generado - Utrerapp', 20, 20);
        doc.setFontSize(12);
        const lineas = doc.splitTextToSize(texto, 170);
        doc.text(lineas, 20, 35);
        doc.save('documento-utrerapp.pdf');
    };

    // Calcular Margen
    const calcularMargen = () => {
        const coste = parseFloat(costeBase);
        const margen = parseFloat(margenBeneficio);

        if (isNaN(coste) || isNaN(margen)) {
            alert('Introduce números válidos en ambos campos.');
            return;
        }

        const precioVenta = coste / (1 - margen / 100);
        const beneficio = precioVenta - coste;
        const conIva = precioVenta * 1.21;

        setResultadoCostes({
            precioVenta: precioVenta.toFixed(2),
            beneficio: beneficio.toFixed(2),
            conIva: conIva.toFixed(2),
        });
    };

    // Calcular Repasos Espaciados
    const calcularRepasos = () => {
        if (!fechaEstudio) {
            alert('Selecciona una fecha.');
            return;
        }
        const fechaBase = new Date(fechaEstudio);
        const intervalos = [1, 7, 14, 30, 90];
        const rep = intervalos.map((dias) => {
            let f = new Date(fechaBase);
            f.setDate(fechaBase.getDate() + dias);
            return {
                dias,
                fecha: f.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' }),
            };
        });
        setResultadoRepasos(rep);
    };

    // Funciones Pomodoro
    const formatearTiempoPomodoro = () => {
        const m = Math.floor(tiempoPomodoro / 60);
        const s = tiempoPomodoro % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Funciones Flashcards
    const guardarFlashcard = () => {
        if (!flashPregunta.trim() || !flashRespuesta.trim()) {
            alert('Rellena tanto la pregunta como la respuesta.');
            return;
        }
        const nuevaLista = [...flashcardsLista, { pregunta: flashPregunta, respuesta: flashRespuesta }];
        setFlashcardsLista(nuevaLista);
        localStorage.setItem('utrerapp_flashcards', JSON.stringify(nuevaLista));
        setFlashPregunta('');
        setFlashRespuesta('');
        setIndiceActual(nuevaLista.length - 1);
        setMostrandoRespuesta(false);
    };

    const voltearTarjeta = () => {
        setMostrandoRespuesta(!mostrandoRespuesta);
    };

    const tarjetaSiguiente = () => {
        if (flashcardsLista.length === 0) return;
        setIndiceActual((prev) => (prev + 1) % flashcardsLista.length);
        setMostrandoRespuesta(false);
    };

    const tarjetaAnterior = () => {
        if (flashcardsLista.length === 0) return;
        setIndiceActual((prev) => (prev - 1 + flashcardsLista.length) % flashcardsLista.length);
        setMostrandoRespuesta(false);
    };

    const borrarTarjetaActual = () => {
        if (flashcardsLista.length === 0) return;
        const nuevaLista = flashcardsLista.filter((_, idx) => idx !== indiceActual);
        setFlashcardsLista(nuevaLista);
        localStorage.setItem('utrerapp_flashcards', JSON.stringify(nuevaLista));
        setIndiceActual(Math.max(0, nuevaLista.length - 1));
        setMostrandoRespuesta(false);
    };

    return (
        <div className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md my-4">
            <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🛠️</span>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Caja de Herramientas Útiles</h2>
                    <p className="text-xs text-gray-500">Soluciones rápidas para el día a día, estudiantes y autónomos.</p>
                </div>
            </div>

            {/* Pestañas Principales */}
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                <button
                    onClick={() => setPestanaActiva('pdf')}
                    className={`py-2 px-4 font-semibold text-sm whitespace-nowrap flex items-center space-x-1 ${pestanaActiva === 'pdf' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                    <span>📄</span> <span>PDF</span>
                </button>
                <button
                    onClick={() => setPestanaActiva('costes')}
                    className={`py-2 px-4 font-semibold text-sm whitespace-nowrap flex items-center space-x-1 ${pestanaActiva === 'costes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                    <span>🧮</span> <span>Autónomos</span>
                </button>
                <button
                    onClick={() => setPestanaActiva('estudio')}
                    className={`py-2 px-4 font-semibold text-sm whitespace-nowrap flex items-center space-x-1 ${pestanaActiva === 'estudio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                    <span>🎓</span> <span>Estudiantes y Opositores</span>
                </button>
            </div>

            {/* 1. SECCIÓN PDF */}
            {pestanaActiva === 'pdf' && (
                <div className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-3">
                        <p className="text-xs font-bold text-blue-900">📄 Conversor exprés de Texto a PDF</p>
                        <p className="text-[11px] text-blue-700">Escribe o pega tus notas, apuntes o presupuestos y descárgalos al instante.</p>
                    </div>
                    <textarea
                        value={textoPdf}
                        onChange={(e) => setTextoPdf(e.target.value)}
                        rows="4"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                        placeholder="Escribe aquí tus apuntes o texto..."
                    />
                    <button
                        onClick={generarPDFDesdeTexto}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition"
                    >
                        Descargar como PDF 📥
                    </button>
                </div>
            )}

            {/* 2. SECCIÓN AUTÓNOMOS */}
            {pestanaActiva === 'costes' && (
                <div className="space-y-3">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg mb-3">
                        <p className="text-xs font-bold text-emerald-900">🧮 Calculadora de Costes y Márgenes</p>
                        <p className="text-[11px] text-emerald-700">Calcula precios de venta, beneficios netos e IVA estimado para tus trabajos.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-700 mb-1">Coste base (€)</label>
                            <input
                                type="number"
                                value={costeBase}
                                onChange={(e) => setCosteBase(e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs"
                                placeholder="Ej: 50"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-700 mb-1">Margen de beneficio (%)</label>
                            <input
                                type="number"
                                value={margenBeneficio}
                                onChange={(e) => setMargenBeneficio(e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs"
                                placeholder="Ej: 30"
                            />
                        </div>
                    </div>
                    <button
                        onClick={calcularMargen}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition"
                    >
                        Calcular Precio Final 🧮
                    </button>

                    {resultadoCostes && (
                        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                            <p className="font-bold text-gray-800">Resultados:</p>
                            <p>• Venta (sin IVA): <strong className="text-blue-600">{resultadoCostes.precioVenta} €</strong></p>
                            <p>• Beneficio: <strong className="text-emerald-600">{resultadoCostes.beneficio} €</strong></p>
                            <p>• Con IVA (21%): <strong className="text-gray-900">{resultadoCostes.conIva} €</strong></p>
                        </div>
                    )}
                </div>
            )}

            {/* 3. SECCIÓN ESTUDIANTES Y OPOSITORES */}
            {pestanaActiva === 'estudio' && (
                <div className="space-y-3">
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg mb-3">
                        <p className="text-xs font-bold text-purple-900">🎓 Kit Integral para Opositores y Estudiantes</p>
                        <p className="text-[11px] text-purple-700">Flashcards con memoria local, planificación de repasos, temporizador y recursos.</p>
                    </div>

                    {/* Sub-pestañas internas */}
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setSubEstudio('flash')}
                            className={`text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap ${subEstudio === 'flash' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            ⚡ Flashcards
                        </button>
                        <button
                            onClick={() => setSubEstudio('repaso')}
                            className={`text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap ${subEstudio === 'repaso' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            📅 Repaso
                        </button>
                        <button
                            onClick={() => setSubEstudio('pomodoro')}
                            className={`text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap ${subEstudio === 'pomodoro' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            ⏱️ Pomodoro
                        </button>
                        <button
                            onClick={() => setSubEstudio('enlaces')}
                            className={`text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap ${subEstudio === 'enlaces' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            🔗 Enlaces
                        </button>
                    </div>

                    {/* 3.1 Flashcards */}
                    {subEstudio === 'flash' && (
                        <div className="space-y-3 pt-2">
                            <p className="text-xs font-bold text-gray-700">Crea tus tarjetas de memoria (guardadas en el móvil):</p>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={flashPregunta}
                                    onChange={(e) => setFlashPregunta(e.target.value)}
                                    placeholder="Pregunta (ej: Art. 14 CE)"
                                    className="w-full p-2 border rounded-lg text-xs"
                                />
                                <input
                                    type="text"
                                    value={flashRespuesta}
                                    onChange={(e) => setFlashRespuesta(e.target.value)}
                                    placeholder="Respuesta (ej: Igualdad ante la ley)"
                                    className="w-full p-2 border rounded-lg text-xs"
                                />
                                <button
                                    onClick={guardarFlashcard}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-lg transition"
                                >
                                    Añadir Tarjeta 📝
                                </button>
                            </div>

                            {flashcardsLista.length > 0 ? (
                                <div className="mt-2">
                                    <div
                                        onClick={voltearTarjeta}
                                        className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl text-center cursor-pointer shadow-sm hover:bg-purple-100 transition"
                                    >
                                        <span className="text-[10px] text-purple-400 block mb-1">
                                            Tarjeta {indiceActual + 1} de {flashcardsLista.length}
                                        </span>
                                        <p className="text-sm font-bold text-purple-900 min-h-[40px] flex items-center justify-center">
                                            {mostrandoRespuesta ? flashcardsLista[indiceActual].respuesta : flashcardsLista[indiceActual].pregunta}
                                        </p>
                                        <span className="text-[10px] text-purple-500 block mt-2 font-semibold">👆 Toca para voltear</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <button onClick={tarjetaAnterior} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg">⬅️ Anterior</button>
                                        <button onClick={borrarTarjetaActual} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg">🗑️ Borrar</button>
                                        <button onClick={tarjetaSiguiente} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg">Siguiente ➡️</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-4">No hay tarjetas creadas todavía.</p>
                            )}
                        </div>
                    )}

                    {/* 3.2 Repaso Espaciado */}
                    {subEstudio === 'repaso' && (
                        <div className="space-y-3 pt-2">
                            <label className="block text-xs font-medium text-gray-700">¿Qué día estudiaste el tema por primera vez?</label>
                            <input
                                type="date"
                                value={fechaEstudio}
                                onChange={(e) => setFechaEstudio(e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs"
                            />
                            <button
                                onClick={calcularRepasos}
                                className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg"
                            >
                                Calcular Fechas de Repaso 📆
                            </button>

                            {resultadoRepasos && (
                                <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                                    <p className="font-bold text-gray-800 mb-1">Fechas de repaso recomendadas:</p>
                                    <ul className="space-y-1">
                                        {resultadoRepasos.map((r, idx) => (
                                            <li key={idx}>• <strong>Día +{r.dias}:</strong> {r.fecha}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3.3 Pomodoro */}
                    {subEstudio === 'pomodoro' && (
                        <div className="space-y-3 pt-2 text-center">
                            <div className="text-4xl font-extrabold text-gray-800 my-3">{formatearTiempoPomodoro()}</div>
                            <p className="text-xs text-gray-500 mb-3">Concentración máxima (25 min)</p>
                            <div className="flex space-x-2">
                                <button onClick={() => setPomodoroActivo(true)} className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg">Iniciar 🚀</button>
                                <button onClick={() => setPomodoroActivo(false)} className="flex-1 bg-amber-500 text-white text-xs font-bold py-2 rounded-lg">Pausar ⏸️</button>
                                <button onClick={() => { setPomodoroActivo(false); setTiempoPomodoro(25 * 60); }} className="flex-1 bg-gray-300 text-gray-700 text-xs font-bold py-2 rounded-lg">Reset 🔄</button>
                            </div>
                        </div>
                    )}

                    {/* 3.4 Enlaces Útiles */}
                    {subEstudio === 'enlaces' && (
                        <div className="space-y-2 pt-2">
                            <a href="https://www.khanacademy.org" target="_blank" rel="noreferrer" className="block p-2.5 bg-gray-50 border rounded-lg text-xs">
                                <strong>🌐 Khan Academy</strong>
                                <span className="block text-gray-500 text-[11px]">Cursos gratuitos de matemáticas y ciencias.</span>
                            </a>
                            <a href="https://www.quizlet.com" target="_blank" rel="noreferrer" className="block p-2.5 bg-gray-50 border rounded-lg text-xs">
                                <strong>📚 Quizlet / Gizmo</strong>
                                <span className="block text-gray-500 text-[11px]">Plataformas globales de fichas y tarjetas flash.</span>
                            </a>
                            <a href="https://neal.fun" target="_blank" rel="noreferrer" className="block p-2.5 bg-gray-50 border rounded-lg text-xs">
                                <strong>🎮 Neal.fun (Descanso mental)</strong>
                                <span className="block text-gray-500 text-[11px]">Minijuegos curiosos para los 5 minutos de descanso.</span>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}