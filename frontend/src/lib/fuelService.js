// src/lib/fuelService.js

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41'; // Código INE de Sevilla

export async function getUtreraFuelPrices() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al conectar con el servicio de gasolineras');
    }
    
    const data = await response.json();
    const stations = data.ListaEstaService || [];
    
    // Filtramos exclusivamente las gasolineras de Utrera
    const utreraStations = stations.filter(station => 
      station.Municipio && station.Municipio.toUpperCase() === 'UTRERA'
    );

    // Mapeamos los campos limpios
    const formattedStations = utreraStations.map(station => ({
      id: station.IDElem,
      name: station['Rótulo'] || 'Sin nombre',
      address: station['Dirección'],
      price95: station['Precio Gasolina 95 E5'] ? parseFloat(station['Precio Gasolina 95 E5'].replace(',', '.')) : null,
      priceDiesel: station['Precio Petroleo A'] ? parseFloat(station['Precio Petroleo A'].replace(',', '.')) : null,
      schedule: station['Horario']
    }));

    return formattedStations;

  } catch (error) {
    console.error('Error obteniendo precios:', error);
    return [];
  }
}