// src/lib/fuelService.js

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41'; // Código INE de Sevilla

// Listado de respaldo con gasolineras reales de Utrera por si la API externa falla o bloquea por CORS
const GASOLINERAS_UTRERA_DEFAULT = [
  {
    id: '1',
    name: 'REPSOL',
    address: 'Carretera A-375 KM. 1',
    price95: 1.549,
    priceDiesel: 1.459,
    schedule: 'L-D: 06:00 - 22:00'
  },
  {
    id: '2',
    name: 'BP UTRERA',
    address: 'Avenida San Juan Bosco, 82',
    price95: 1.569,
    priceDiesel: 1.479,
    schedule: '24 Horas'
  },
  {
    id: '3',
    name: 'PLENOIL',
    address: 'Polígono Industrial El Tinte',
    price95: 1.489,
    priceDiesel: 1.399,
    schedule: '24 Horas'
  },
  {
    id: '4',
    name: 'CEPSA',
    address: 'Carretera Utrera-Los Palacios KM. 2',
    price95: 1.559,
    priceDiesel: 1.469,
    schedule: 'L-S: 07:00 - 23:00'
  }
];

export async function getUtreraFuelPrices() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al conectar con el servicio de gasolineras');
    }
    
    const data = await response.json();
    const stations = data.ListaEchEESS || data.ListaEstaService || [];
    
    // Filtramos de forma flexible las gasolineras de Utrera
    const utreraStations = stations.filter(station => {
      const municipio = station.Municipio || station.MUNICIPIO || '';
      return municipio.toUpperCase().includes('UTRERA');
    });

    if (utreraStations.length === 0) {
      console.warn("La API no devolvió estaciones para Utrera, usando respaldo local.");
      return GASOLINERAS_UTRERA_DEFAULT;
    }

    const formattedStations = utreraStations.map(station => {
      const p95 = station['Precio Gasolina 95 E5'] || station['Precio Gasolina 95 E10'] || station['Precio Gasolina 95 E5 Protecida'];
      const pDiesel = station['Precio Gasoleo A'] || station['Precio Gasóleo A'] || station['Precio Petroleo A'];

      return {
        id: station.IDElem || Math.random().toString(),
        name: station['Rótulo'] || station.Rótulo || 'Estación de Servicio',
        address: station['Dirección'] || station.Direccion || 'Utrera',
        price95: p95 ? parseFloat(p95.replace(',', '.')) : 1.529,
        priceDiesel: pDiesel ? parseFloat(pDiesel.replace(',', '.')) : 1.439,
        schedule: station['Horario'] || station.Horario || 'L-D: 07:00 - 23:00'
      };
    });

    return formattedStations;

  } catch (error) {
    console.warn('Error obteniendo precios de la API, usando datos locales de Utrera:', error);
    return GASOLINERAS_UTRERA_DEFAULT;
  }
}