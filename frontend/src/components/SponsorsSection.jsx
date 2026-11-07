import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ajusta la ruta a tu cliente de Supabase si es necesario

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Formulario nuevo patro
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchSponsors();
  }, []);

  // Rotación automática cada 3 segundos
  useEffect(() => {
    if (sponsors.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors]);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('active', true);
    if (!error && data) {
      setSponsors(data);
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
      alert('Error al añadir patrocinador');
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

  if (sponsors.length === 0 && !showAdmin) {
    return (
      <div style={{ margin: '15px 0', textAlign: 'center' }}>
        <button 
          onClick={() => setShowAdmin(true)}
          style={{ background: '#b91c1c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
        >
          + Configurar Patrocinadores
        </button>
      </div>
    );
  }

  const current = sponsors[currentIndex];

  return (
    <div style={{ width: '100%', margin: '15px 0', padding: '0 15px', boxSizing: 'border-box' }}>
      {/* Cabecera discreta para abrir el panel de administración rápido */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#6b7280' }}>
          Patrocinadores Oficiales
        </span>
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          style={{ background: 'none', border: 'none', color: '#b91c1c', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
        >
          {showAdmin ? 'Ocultar Panel' : '⚙️ Gestionar'}
        </button>
      </div>

      {/* Carrusel Visual (Solo si hay patrocinadores) */}
      {sponsors.length > 0 && !showAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
          border: '1px solid #fecaca',
          borderRadius: '16px',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.5s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={current.logo_url} 
              alt={current.name} 
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb' }} 
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#1f2937', fontWeight: 'bold' }}>{current.name}</h4>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Colaborador Utrerapp</span>
            </div>
          </div>
          {current.link && (
            <a 
              href={current.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: '#b91c1c', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}
            >
              Visitar
            </a>
          )}
        </div>
      )}

      {/* Panel de Gestión Rápida (Optimizado para móvil) */}
      {showAdmin && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '15px', marginTop: '10px' }}>
          <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#111827' }}>Panel Rápido de Patrocinadores</h3>
          
          <form onSubmit={handleAddSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Nombre del Patrocinador" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }}
              required
            />
            <input 
              type="text" 
              placeholder="URL del Logo (ej: https://...)" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }}
              required
            />
            <input 
              type="text" 
              placeholder="Enlace web o contacto (opcional)" 
              value={link} 
              onChange={(e) => setLink(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }}
            />
            <button 
              type="submit" 
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              + Añadir Patrocinador
            </button>
          </form>

          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sponsors.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{s.name}</span>
                <button 
                  onClick={() => handleDeleteSponsor(s.id)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}