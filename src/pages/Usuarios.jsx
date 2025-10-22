import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: {
          'x-access-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.usuarios || []);
      } else {
        setError('Erro ao conectar ao servidor');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionColor = (permissao) => {
    const colors = {
      'administrador': '#dbeafe',
      'patrimonio': '#d1fae5',
      'tecnico': '#fef3c7',
      'visualizador': '#f3e8ff'
    };
    const textColors = {
      'administrador': '#0369a1',
      'patrimonio': '#065f46',
      'tecnico': '#92400e',
      'visualizador': '#6b21a8'
    };
    return { bg: colors[permissao] || '#f3f4f6', text: textColors[permissao] || '#374151' };
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Shield size={28} />
        <h1 style={{ margin: 0 }}>Usuários</h1>
      </div>

      {usuarios.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Nenhum usuário cadastrado
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nome de Usuário</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Permissão</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const permColor = getPermissionColor(usuario.permissao);
              return (
                <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{usuario.nome_usuario}</td>
                  <td style={{ padding: '12px' }}>{usuario.email || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: permColor.bg,
                      color: permColor.text,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {usuario.permissao}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
