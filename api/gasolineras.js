// api/gasolineras.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await fetch(
      'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41'
    );

    if (!response.ok) {
      throw new Error('Error al conectar con la API oficial del Ministerio');
    }

    const data = await response.json();
    const stations = data.ListaEchEESS || data.ListaEstaService || [];

    const utreraStations = stations.filter(station => {
      const municipio = station.Municipio || station.MUNICIPIO || '';
      return municipio.toUpperCase().includes('UTRERA');
    });

    const formattedStations = utreraStations.map(station => {
      const p95 = station['Precio Gasolina 95 E5'] || station['Precio Gasolina 95 E10'] || station['Precio Gasolina 95 E5 Protecida'];
      const pDiesel = station['Precio Gasoleo A'] || station['Precio Gasóleo A'] || station['Precio Petroleo A'];

      return {
        id: station.IDElem || Math.random().toString(),
        name: station['Rótulo'] || station.Rótulo || 'Estación de Servicio',
        address: station['Dirección'] || station.Direccion || 'Utrera',
        price95: p95 ? parseFloat(p95.replace(',', '.')) : null,
        priceDiesel: pDiesel ? parseFloat(pDiesel.replace(',', '.')) : null,
        schedule: station['Horario'] || station.Horario || 'Consultar en estación'
      };
    });

    return res.status(200).json({ success: true, stations: formattedStations });

  } catch (error) {
    console.error('Error en serverless function de gasolineras:', error);
    return res.status(500).json({ success: false, error: error.message, stations: [] });
  }
}