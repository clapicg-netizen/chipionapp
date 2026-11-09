/**
 * Módulo de Gasolineras para Utrerapp
 * Consulta los precios en tiempo real de Utrera desde la API oficial del Ministerio
 * Evita problemas de caché con cache: 'no-store'
 */

async function cargarPreciosGasolineras() {
  const container = document.getElementById('gasolineras-container');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading-spinner">Actualizando precios de gasolineras...</div>';

    // Llamada a la API oficial del Ministerio para Utrera (Filtro Municipio: 3095)
    // cache: 'no-store' obliga al navegador a descargar siempre los datos frescos del día
    const respuesta = await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/3095', {
      cache: 'no-store'
    });
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con el servicio de precios.');
    }

    const datos = await respuesta.json();
    const estaciones = datos.ListaEstacionesServicio;

    if (!estaciones || estaciones.length === 0) {
      container.innerHTML = '<p class="error-msg">No se encontraron estaciones de servicio disponibles en este momento.</p>';
      return;
    }

    renderizarTarjetas(estaciones);

  } catch (error) {
    console.error("Error al cargar los precios de las gasolineras:", error);
    container.innerHTML = '<p class="error-msg">Error al cargar los precios actualizados. Comprueba tu conexión.</p>';
  }
}

function renderizarTarjetas(estaciones) {
  const container = document.getElementById('gasolineras-container');
  container.innerHTML = '';

  estaciones.forEach(estacion => {
    const rotulo = estacion['Rótulo'] || 'Gasolinera';
    const direccion = estacion['Dirección'] || '';
    const precio95 = estacion['Precio Gasolina 95 E5'] ? estacion['Precio Gasolina 95 E5'] + ' €/L' : 'No disponible';
    const precioDiesel = estacion['Precio Dísel A'] ? estacion['Precio Dísel A'] + ' €/L' : 'No disponible';
    
    const card = document.createElement('div');
    card.className = 'gas-card';
    card.innerHTML = `
      <div class="gas-header">
        <h3>${rotulo}</h3>
        <span class="badge abierta">ACTUALIZADO</span>
      </div>
      <p class="gas-address">${direccion}</p>
      <div class="gas-prices">
        <div class="price-item">
          <span class="fuel-label">Gasolina 95 E5</span>
          <span class="fuel-value">${precio95}</span>
        </div>
        <div class="price-item">
          <span class="fuel-label">Diésel A</span>
          <span class="fuel-value">${precioDiesel}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Ejecutar al cargar la vista de gasolineras
cargarPreciosGasolineras();