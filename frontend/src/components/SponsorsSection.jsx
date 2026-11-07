import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ajusta si tu ruta es diferente

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Formulario nuevo patrocinador
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchSponsors();
  }, []);

  // Rotación automática cada 3 segundos si hay varios
  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors]);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('active', true);
      if (!error && data) {
        setSponsors(data);
      }
    } catch (e) {
      console.log("Supabase sponsors table not ready yet");
    }
  };

  const handleAddSponsor = async (e) => {
    e.preventDefault();
    if (!name || !logoUrl) return;

    const { error } = await supabase.from('sponsors').insert([
      { name, logo_url: logoUrl, link, active: true }
    ]);

    if (!error) {
      setName('');
      setLogoUrl('');
      setLink('');
      fetchSponsors();
      alert('¡Patrocinador añadido con éxito!');
    } else {
      alert('Error al añadir patrocinador. Comprueba la tabla en Supabase.');
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (confirm('¿Seguro que quieres eliminar este patrocinador?')) {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      if (!error) {
        fetchSponsors();
      }
    }
  };

  const current = sponsors.length > 0 ? sponsors[currentIndex] : null;

  return (
    <div style={{ width: '100%', margin: '15px 0', padding: '0 15px', boxSizing: 'border-box' }}>
      
      {/* Cabecera de la sección con botón de gestión siempre visible */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#6b7280' }}>
          ⭐ Patrocinadores Oficiales
        </span>
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          style={{ 
            background: showAdmin ? '#374151' : '#b91c1c', 
            color: 'white', 
            border: 'none', 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '11px', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showAdmin ? 'Ver Carrusel' : '⚙️ Gestionar Patrocinadores'}
        </button>
      </div>

      {/* Si NO estamos en modo admin y hay patrocinadores: muestra el carrusel */}
      {sponsors.length > 0 && !showAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
          border: '1px solid #fecaca',
          borderRadius: '16px',
          padding: '12px 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={current.logo_url} 
              alt={current.name} 
              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e7eb' }} 
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#1f2937', fontWeight: 'bold' }}>{current.name}</h4>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>Patrocinador Utrerapp ({currentIndex + 1}/{sponsors.length})</span>
            </div>
          </div>
          {current.link && (
            <a 
              href={current.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: '#b91c1c', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Visitar
            </a>
          )}
        </div>
      )}

      {/* Si NO hay patrocinadores y NO estamos en modo admin: tarjeta informativa */}
      {sponsors.length === 0 && !showAdmin && (
        <div style={{
          background: '#f9fafb',
          border: '1px dashed #d1d5db',
          borderRadius: '16px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#4b5563' }}>Aún no hay patrocinadores añadidos.</p>
          <button 
            onClick={() => setShowAdmin(true)}
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Añadir el primero ahora
          </button>
        </div>
      )}

      {/* Panel de Gestión Rápida */}
      {showAdmin && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '15px', marginTop: '5px' }}>
          <h3 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#111827', fontWeight: 'bold' }}>Panel de Control de Patrocinadores</h3>
          
          <form onSubmit={handleAddSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Nombre del Negocio / Patrocinador" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', background: 'white' }}
              required
            />
            <input 
              type="text" 
              placeholder="URL del Logo (ej: https://...)" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', background: 'white' }}
              required
            />
            <input 
              type="text" 
              placeholder="Enlace web o contacto (opcional)" 
              value={link} 
              onChange={(e) => setLink(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', background: 'white' }}
            />
            <button 
              type="submit" 
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
            >
              + Guardar y Publicar Patrocinador
            </button>
          </form>

          {sponsors.length > 0 && (
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Patrocinadores actuales:</span>
              {sponsors.map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>{s.name}</span>
                  <button 
                    onClick={() => handleDeleteSponsor(s.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}