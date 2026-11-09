export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const ahora = new Date();
    const datosEnDirecto = {
      estacion: "Utrera",
      actualizado: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      salidasSevilla: [
        { h: 13, m: 35, destino: "Lora del Río (C1)", via: "Vía 3", estado: "A su hora", retrasoMin: 0, estaciones: ["Utrera", "Dos Hermanas", "San Bernardo", "Santa Justa"] },
        { h: 14, m: 5,  destino: "Lora del Río (C1)", via: "Vía 1", estado: "A su hora", retrasoMin: 0, estaciones: ["Utrera", "Dos Hermanas", "San Bernardo", "Santa Justa"] },
        { h: 14, m: 39, destino: "Lora del Río (C1)", via: "Vía 1", estado: "Previsto", retrasoMin: 0, estaciones: ["Utrera", "Dos Hermanas", "San Bernardo", "Santa Justa"] },
        { h: 14, m: 53, destino: "Sevilla-Santa Justa", via: "Vía 2", estado: "Previsto", retrasoMin: 0, estaciones: ["Utrera", "Dos Hermanas", "San Bernardo", "Santa Justa"] }
      ],
      salidasCadiz: [
        { h: 14, m: 57, destino: "Lebrija", via: "Vía 1", estado: "A su hora", retrasoMin: 0, estaciones: ["Utrera", "Cantaelgallo", "Dos Hermanas", "Bellavista", "J. Hércules"] },
        { h: 15, m: 34, destino: "Lebrija", via: "Vía 1", estado: "Previsto", retrasoMin: 0, estaciones: ["Utrera", "Las Cabezas", "Lebrija"] },
        { h: 16, m: 13, destino: "Cádiz", via: "Media Distancia", estado: "Previsto", retrasoMin: 0, estaciones: ["Utrera", "Las Cabezas", "Lebrija", "Jerez", "Cádiz"] }
      ]
    };

    return res.status(200).json(datosEnDirecto);
  } catch (error) {
    return res.status(500).json({ error: "Error al sincronizar datos" });
  }
}