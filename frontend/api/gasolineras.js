/**
 * Módulo de Gasolineras para Utrerapp - Blindado
 */

async function cargarPreciosGasolineras() {
  const container = document.getElementById('gasolineras-container');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading-spinner" style="text-align:center; padding:20px; color:#666;">Actualizando precios de gasolineras...</div>';

    const respuesta = await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/41', {
      cache: 'no-store'
    });
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con el servicio de precios.');
    }

    const datos = await respuesta.json();
    const todasLasEstaciones = datos.ListaEstacionesServicio;

    if (!todasLasEstaciones || todasLasEstaciones.length === 0) {
      container.innerHTML = '<p class="error-msg" style="text-align:center; padding:20px; color:#e11d48;">No se pudieron cargar los datos de las estaciones.</p>';
      return;
    }

    // Filtro blindado: busca por municipio (quitando tildes) o por código postal 41710
    const estacionesUtrera = todasLasEstaciones.filter(estacion => {
      const municipio = (estacion['Municipio'] || '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
      
      const cp = (estacion['C.P.'] || '');
      const direccion = (estacion['Dirección'] || '').toUpperCase();

      return municipio.includes('UTRERA') || cp === '41710' || direccion.includes('UTRERA');
    });

    if (estacionesUtrera.length === 0) {
      container.innerHTML = '<p class="error-msg" style="text-align:center; padding:20px; color:#e11d48;">No se han encontrado estaciones de servicio activas en Utrera en este momento.</p>';
      return;
    }

    // Ordenar de más barata a más cara según Gasolina 95
    estacionesUtrera.sort((a, b) => {
      const pA = parseFloat((a['Precio Gasolina 95 E5'] || '999').replace(',', '.')) || 999;
      const pB = parseFloat((b['Precio Gasolina 95 E5'] || '999').replace(',', '.')) || 999;
      return pA - pB;
    });

    renderizarTarjetas(estacionesUtrera);

  } catch (error) {
    console.error("Error al cargar los precios de las gasolineras:", error);
    container.innerHTML = '<p class="error-msg" style="text-align:center; padding:20px; color:#e11d48;">Error al cargar los precios actualizados. Comprueba tu conexión.</p>';
  }
}

function renderizarTarjetas(estaciones) {
  const container = document.getElementById('gasolineras-container');
  container.innerHTML = '';

  estaciones.forEach(estacion => {
    const rotulo = estacion['Rótulo'] || 'Gasolinera';
    const direccion = estacion['Dirección'] || '';
    
    const rawPrecio95 = estacion['Precio Gasolina 95 E5'];
    const rawPrecioDiesel = estacion['Precio Diésel A'] || estacion['Precio Diesel A'];

    const precio95 = rawPrecio95 ? rawPrecio95 + ' €/L' : 'No disponible';
    const precioDiesel = rawPrecioDiesel ? rawPrecioDiesel + ' €/L' : 'No disponible';
    
    const card = document.createElement('div');
    card.className = 'gas-card';
    card.style.cssText = 'background:#fff; border:1px solid #e1e4e8; border-radius:16px; padding:16px; margin-bottom:12px; box-shadow:0 2px 4px rgba(0,0,0,0.02);';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <h3 style="margin:0; font-size:1.1rem; color:#111; font-weight:bold;">${rotulo}</h3>
        <span style="font-size:10px; background:#e0f2fe; color:#0369a1; font-weight:bold; padding:2px 8px; border-radius:99px;">ACTUALIZADO</span>
      </div>
      <p style="font-size:0.85rem; color:#666; margin:0 0 12px 0;">${direccion}</p>
      <div style="display:flex; gap:12px;">
        <div style="background:#eef2ff; color:#312e81; padding:8px 12px; border-radius:12px; font-size:0.9rem; flex:1;">
          <span style="font-size:10px; font-bold; display:block; opacity:0.8;">Gasolina 95 E5</span>
          <strong>${precio95}</strong>
        </div>
        <div style="background:#f0fdf4; color:#166534; padding:8px 12px; border-radius:12px; font-size:0.9rem; flex:1;">
          <span style="font-size:10px; font-bold; display:block; opacity:0.8;">Diésel A</span>
          <strong>${precioDiesel}</strong>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Ejecutar al cargar la vista de gasolineras
cargarPreciosGasolineras();