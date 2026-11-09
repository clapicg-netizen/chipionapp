// src/lib/fuelService.js

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41'; // Código INE de Sevilla

export async function getUtreraFuelPrices() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al conectar con el servicio de gasolineras');
    }
    
    const data = await response.json();
    const stations = data.ListaEchEESS || data.ListaEstaService || [];
    
    console.log("Total estaciones recibidas para Sevilla:", stations.length);

    // Filtramos de forma flexible las gasolineras de Utrera
    const utreraStations = stations.filter(station => {
      const municipio = station.Municipio || station.MUNICIPIO || '';
      return municipio.toUpperCase().includes('UTRERA');
    });

    console.log("Estaciones filtradas para Utrera:", utreraStations);

    // Mapeamos los campos limpios asegurando las claves correctas de la API
    const formattedStations = utreraStations.map(station => {
      // Buscamos dinámicamente las propiedades de precios de 95 y Diésel
      const p95 = station['Precio Gasolina 95 E5'] || station['Precio Gasolina 95 E10'] || station['Precio Gasolina 95 E5 Protecida'];
      const pDiesel = station['Precio Gasoleo A'] || station['Precio Gasóleo A'] || station['Precio Petroleo A'];

      return {
        id: station.IDElem || Math.random().toString(),
        name: station['Rótulo'] || station.Rótulo || 'Estación de Servicio',
        address: station['Dirección'] || station.Direccion || 'Utrera',
        price95: p95 ? parseFloat(p95.replace(',', '.')) : null,
        priceDiesel: pDiesel ? parseFloat(pDiesel.replace(',', '.')) : null,
        schedule: station['Horario'] || station.Horario || ''
      };
    });

    return formattedStations;

  } catch (error) {
    console.error('Error obteniendo precios:', error);
    return [];
  }
}