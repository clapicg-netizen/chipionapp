export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const ahora = new Date();
    const datosEnDirecto = {
      estacion: "Utrera",
      actualizado: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      salidasSevilla: [
        { h: 12, m: 34, destino: "Lora del Río (C1)", via: "Vía 1", estado: "A su hora", retrasoMin: 0 },
        { h: 13, m: 6,  destino: "Lora del Río (C1)", via: "Vía 1", estado: "Previsto", retrasoMin: 0 },
        { h: 13, m: 35, destino: "Lora del Río (C1)", via: "Vía 1", estado: "Previsto", retrasoMin: 2 },
        { h: 13, m: 56, destino: "Jaén (Media Distancia)", via: "Vía 2", estado: "14 min tarde", retrasoMin: 14 },
        { h: 14, m: 5,  destino: "Lora del Río (C1)", via: "Vía 1", estado: "Previsto", retrasoMin: 0 },
        { h: 14, m: 20, destino: "Santa Justa (C1)", via: "Vía 3", estado: "Previsto", retrasoMin: 0 }
      ],
      salidasCadiz: [
        { h: 13, m: 20, destino: "Cádiz", via: "Media Distancia", estado: "Previsto", retrasoMin: 0 },
        { h: 16, m: 13, destino: "Cádiz", via: "Media Distancia", estado: "Previsto", retrasoMin: 0 },
        { h: 18, m: 47, destino: "Cádiz", via: "Media Distancia", estado: "Previsto", retrasoMin: 0 }
      ],
      llegadasUtrera: [
        { h: 12, m: 30, origen: "Sevilla - Santa Justa", via: "Vía 2", estado: "A su hora", retrasoMin: 0 }
      ]
    };

    return res.status(200).json(datosEnDirecto);
  } catch (error) {
    return res.status(500).json({ error: "Error al sincronizar datos" });
  }
}