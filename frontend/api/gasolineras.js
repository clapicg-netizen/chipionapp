/**
 * Módulo de Gasolineras para Utrerapp
 * Descarga las estaciones de Sevilla y filtra por Utrera para evitar fallos de códigos INE
 */

async function cargarPreciosGasolineras() {
  const container = document.getElementById('gasolineras-container');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading-spinner">Actualizando precios de gasolineras...</div>';

    // Usamos el endpoint de toda la provincia de Sevilla para filtrar localmente por Utrera
    const respuesta = await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41', {
      cache: 'no-store'
    });
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con el servicio de precios.');
    }

    const datos = await respuesta.json();
    const todasLasEstaciones = datos.ListaEstacionesServicio;

    if (!todasLasEstaciones || todasLasEstaciones.length === 0) {
      container.innerHTML = '<p class="error-msg">No se pudieron cargar los datos de las estaciones.</p>';
      return;
    }

    // Filtramos estrictamente las que pertenezcan a Utrera
    const estacionesUtrera = todasLasEstaciones.filter(estacion => {
      const municipio = (estacion['Municipio'] || '').toUpperCase();
      return municipio.includes('UTRERA');
    });

    if (estacionesUtrera.length === 0) {
      container.innerHTML = '<p class="error-msg">No se han encontrado estaciones de servicio activas en Utrera en este momento.</p>';
      return;
    }

    renderizarTarjetas(estacionesUtrera);

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