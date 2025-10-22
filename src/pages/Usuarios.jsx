import React, { useState, useEffect } from 'react';
import { Shield, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nome_usuario: '',
    email: '',
    senha: '',
    permissao: 'visualizador'
  });
  const [userPermission, setUserPermission] = useState('visualizador');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserPermission(decoded.permissao || 'visualizador');
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        setUserPermission('visualizador');
      }
    }
  }, []);

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        alert('Usuário criado com sucesso!');
        setShowModal(false);
        setNewUserData({
          nome_usuario: '',
          email: '',
          senha: '',
          permissao: 'visualizador'
        });
        fetchUsuarios();
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar usuário: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      alert('Erro ao conectar ao servidor ou processar a requisição.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Shield size={28} />
        <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2.25rem' }}>Usuários</h1>
      </div>
      {userPermission === 'administrador' && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} /> Novo Usuário
        </button>
      )}

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
                  <td style={{ padding: '12px' }}>{usuario.email || '-'}
                  </td>
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

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>Novo Usuário</h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Nome de Usuário</label>
                <input
                  type="text"
                  value={newUserData.nome_usuario}
                  onChange={(e) => setNewUserData({ ...newUserData, nome_usuario: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Senha</label>
                <input
                  type="password"
                  value={newUserData.senha}
                  onChange={(e) => setNewUserData({ ...newUserData, senha: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Permissão</label>
                <select
                  value={newUserData.permissao}
                  onChange={(e) => setNewUserData({ ...newUserData, permissao: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="visualizador">Visualizador</option>
                  <option value="tecnico">Técnico</option>
                  <option value="patrimonio">Patrimônio</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
