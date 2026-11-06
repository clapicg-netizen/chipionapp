// src/lib/consoService.js
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("ESTADO API KEY GEMINI:", apiKey ? "¡Clave cargada correctamente!" : "¡ADVERTENCIA: La clave está vacía!");

const ai = new GoogleGenAI({ apiKey: apiKey });

export async function obtenerRespuestaConso(mensajeUsuario, historialMensajes = []) {
  try {
    const contents = historialMensajes.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: mensajeUsuario }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: 'Eres Conso, el asistente virtual oficial de Utrera (Sevilla). Eres amable, cercano, servicial y utilizas expresiones locales o un tono muy cordial de pueblo ("vecino", "por Utrera"). Ayudas con información sobre farmacias de guardia, trenes de cercanías de la línea C-1, aparcamientos, autobuses y cualquier duda sobre la localidad.',
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error al conectar con Gemini:", error);
    return "Lo siento, vecino, en este momento no puedo conectar con el servicio.";
  }
}