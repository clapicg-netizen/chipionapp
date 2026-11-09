// frontend/src/lib/fuelService.js

export async function getUtreraFuelPrices() {
  try {
    const response = await fetch('/api/gasolineras');
    if (!response.ok) {
      throw new Error('Error al conectar con la pasarela de Utrerapp');
    }

    const data = await response.json();
    
    if (data.success && data.stations) {
      return data.stations;
    }

    return [];
  } catch (error) {
    console.error('Error obteniendo precios reales:', error);
    return [];
  }
}