import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
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
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    valor_compra: '',
    data_compra: '',
    tipo_posse: 'proprio',
    numero_identificacao: ''
  });

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const fetchEquipamentos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/equipamentos`, {
        headers: {
          'x-access-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEquipamentos(data.equipamentos || []);
      } else {
        setError('Erro ao conectar ao servidor');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/equipamentos/${editingId}`
        : `${import.meta.env.VITE_API_URL}/equipamentos`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({
          nome: '',
          marca: '',
          valor_compra: '',
          data_compra: '',
          tipo_posse: 'proprio',
          numero_identificacao: ''
        });
        fetchEquipamentos();
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este equipamento?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/equipamentos/${id}`, {
          method: 'DELETE',
          headers: {
            'x-access-token': token
          }
        });

        if (response.ok) {
          fetchEquipamentos();
        }
      } catch (err) {
        console.error('Erro:', err);
      }
    }
  };

  const handleEdit = (equipamento) => {
    setEditingId(equipamento.id);
    setFormData({
      nome: equipamento.nome,
      marca: equipamento.marca,
      valor_compra: equipamento.valor_compra,
      data_compra: equipamento.data_compra,
      tipo_posse: equipamento.tipo_posse,
      numero_identificacao: equipamento.numero_identificacao
    });
    setShowModal(true);
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem' }}>Equipamentos</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              nome: '',
              marca: '',
              valor_compra: '',
              data_compra: '',
              tipo_posse: 'proprio',
              numero_identificacao: ''
            });
            setShowModal(true);
          }}
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
          <Plus size={20} /> Novo Equipamento
        </button>
      </div>

      {equipamentos.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Nenhum equipamento cadastrado
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Marca</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Valor Compra</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Data Compra</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tipo Posse</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.map((eq) => (
              <tr key={eq.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{eq.nome}</td>
                <td style={{ padding: '12px' }}>{eq.marca}</td>
                <td style={{ padding: '12px' }}>R$ {parseFloat(eq.valor_compra).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>{new Date(eq.data_compra).toLocaleDateString('pt-BR')}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: eq.tipo_posse === 'proprio' ? '#dbeafe' : '#fef3c7',
                    color: eq.tipo_posse === 'proprio' ? '#0369a1' : '#92400e',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {eq.tipo_posse}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(eq)}
                    style={{
                      padding: '6px 12px',
                      marginRight: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
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
            <h2>{editingId ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Marca</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Valor Compra</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor_compra}
                  onChange={(e) => setFormData({ ...formData, valor_compra: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Data Compra</label>
                <input
                  type="date"
                  value={formData.data_compra}
                  onChange={(e) => setFormData({ ...formData, data_compra: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Tipo Posse</label>
                <select
                  value={formData.tipo_posse}
                  onChange={(e) => setFormData({ ...formData, tipo_posse: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="proprio">Próprio</option>
                  <option value="comodato">Comodato</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Número Identificação</label>
                <input
                  type="text"
                  value={formData.numero_identificacao}
                  onChange={(e) => setFormData({ ...formData, numero_identificacao: e.target.value })}
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
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
