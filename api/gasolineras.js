// api/gasolineras.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await fetch(
      'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41',
      {
        headers: {
          'User-Agent': 'Utrerapp-PWA/1.0',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    const stations = data.ListaEchEESS || data.ListaEstaService || [];

    // Filtramos las estaciones de Utrera de forma totalmente flexible
    const utreraStations = stations.filter(station => {
      const municipio = (station.Municipio || station.MUNICIPIO || '').trim();
      return municipio.toUpperCase() === 'UTRERA';
    });

    console.log(`Estaciones encontradas en Utrera: ${utreraStations.length}`);

    const formattedStations = utreraStations.map(station => {
      // El Ministerio usa claves exactas para los precios en España
      const p95 = station['Precio Gasolina 95 E5'] || station['Precio Gasolina 95 E10'] || station['Precio Gasolina 95 E5 Protecida'] || '';
      const pDiesel = station['Precio Gasoleo A'] || station['Precio Gasóleo A'] || station['Precio Petroleo A'] || '';

      return {
        id: station.IDElem || Math.random().toString(),
        name: (station['Rótulo'] || station.Rótulo || 'Estación de Servicio').trim(),
        address: (station['Dirección'] || station.Direccion || 'Utrera').trim(),
        price95: p95 ? parseFloat(p95.replace(',', '.')) : null,
        priceDiesel: pDiesel ? parseFloat(pDiesel.replace(',', '.')) : null,
        schedule: (station['Horario'] || station.Horario || 'Consultar en estación').trim()
      };
    });

    // Ordenamos por precio de Gasolina 95 de menor a mayor para dar el mejor servicio
    formattedStations.sort((a, b) => {
      if (!a.price95) return 1;
      if (!b.price95) return -1;
      return a.price95 - b.price95;
    });

    return res.status(200).json({ success: true, stations: formattedStations });

  } catch (error) {
    console.error('Error detallado en serverless function:', error);
    return res.status(500).json({ success: false, error: error.message, stations: [] });
  }
}