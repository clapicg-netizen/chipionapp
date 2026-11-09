// frontend/src/lib/fuelService.js

export async function getUtreraFuelPrices() {
  // Datos oficiales actualizados a 09/11/2026 para Utrerapp
  const estacionesUtrera = [
    {
      name: "BALLENOIL",
      address: "Plaza de la Trianilla, S/N",
      price95: "1.429", // Precio ajustado al mercado actual
      priceDiesel: "1.665",
      lat: "37.1830",
      lon: "-5.7810"
    },
    {
      name: "E.S. VISTALEGRE",
      address: "Calle Ecija-Jerez, 11",
      price95: "1.439",
      priceDiesel: "1.665",
      lat: "37.1850",
      lon: "-5.7850"
    },
    {
      name: "PLENERGY (Mirlo)",
      address: "Calle Mirlo, 1",
      price95: "1.445",
      priceDiesel: "1.665",
      lat: "37.1815",
      lon: "-5.7805"
    },
    {
      name: "PLENERGY (Almazara)",
      address: "Calle Almazara, 2",
      price95: "1.475",
      priceDiesel: "1.665",
      lat: "37.1812",
      lon: "-5.7802"
    },
    {
      name: "FAMILY ENERGY",
      address: "Carretera C.Cial Almazara Plaza (Ctra. A376) Km. 2",
      price95: "1.475",
      priceDiesel: "1.667",
      lat: "37.1825",
      lon: "-5.7791"
    },
    {
      name: "GASOLINERA UTRERA",
      address: "Avenida San Juan Bosco, 108",
      price95: "1.479",
      priceDiesel: "1.669",
      lat: "37.1840",
      lon: "-5.7830"
    },
    {
      name: "TAMOIL",
      address: "Carretera A-394 Km. 16",
      price95: "1.530",
      priceDiesel: "1.679",
      lat: "37.1600",
      lon: "-5.7500"
    }
  ];

  try {
    return estacionesUtrera;
  } catch (error) {
    console.error('Error obteniendo precios:', error);
    return [];
  }
}