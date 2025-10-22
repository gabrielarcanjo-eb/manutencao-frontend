import React, { useState, useEffect } from 'react';
import { Edit2, Plus } from 'lucide-react';

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [equipamentos, setEquipamentos] = useState([]); // Novo estado para equipamentos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    equipamento_id: '',
    setor: '',
    descricao_problema: '',
    tipo_manutencao: 'corretiva',
    status: 'aberta'
  });

  useEffect(() => {
    fetchOrdens();
    fetchEquipamentos(); // Buscar equipamentos ao carregar a página
  }, []);

  const fetchOrdens = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ordens-servico`, {
        headers: {
          'x-access-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrdens(data.ordens_servico || []);
      } else {
        setError('Erro ao conectar ao servidor');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipamentos = async () => {
    try {
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
        console.error('Erro ao buscar equipamentos');
      }
    } catch (err) {
      console.error('Erro ao buscar equipamentos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Garante que equipamento_id seja um número antes de enviar
    const payload = { ...formData, equipamento_id: parseInt(formData.equipamento_id) };
    
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/ordens-servico/${editingId}`
        : `${import.meta.env.VITE_API_URL}/ordens-servico`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({
          equipamento_id: '',
          setor: '',
          descricao_problema: '',
          tipo_manutencao: 'corretiva',
          status: 'aberta'
        });
        fetchOrdens();
      } else {
        const errorData = await response.json();
        console.error('Erro ao salvar ordem de serviço:', errorData);
        alert(`Erro ao salvar ordem de serviço: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao conectar ao servidor ou processar a requisição.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'aberta': '#dbeafe',
      'em_andamento': '#fef3c7',
      'fechada': '#d1fae5',
      'cancelada': '#fee2e2'
    };
    const textColors = {
      'aberta': '#0369a1',
      'em_andamento': '#92400e',
      'fechada': '#065f46',
      'cancelada': '#991b1b'
    };
    return { bg: colors[status] || '#f3f4f6', text: textColors[status] || '#374151' };
  };

  const getEquipamentoNome = (id) => {
    const eq = equipamentos.find(e => e.id === id);
    return eq ? eq.nome : 'Desconhecido';
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem' }}>Ordens de Serviço</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              equipamento_id: '',
              setor: '',
              descricao_problema: '',
              tipo_manutencao: 'corretiva',
              status: 'aberta'
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
          <Plus size={20} /> Nova Ordem
        </button>
      </div>

      {ordens.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Nenhuma ordem de serviço cadastrada
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Equipamento</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Setor</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Descrição</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Data Abertura</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((ordem) => {
              const statusColor = getStatusColor(ordem.status);
              return (
                <tr key={ordem.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{getEquipamentoNome(ordem.equipamento_id)}</td>
                  <td style={{ padding: '12px' }}>{ordem.setor}</td>
                  <td style={{ padding: '12px' }}>{ordem.descricao_problema.substring(0, 50)}...</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: ordem.tipo_manutencao === 'corretiva' ? '#dbeafe' : '#d1fae5',
                      color: ordem.tipo_manutencao === 'corretiva' ? '#0369a1' : '#065f46',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {ordem.tipo_manutencao}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {ordem.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(ordem.data_abertura).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setEditingId(ordem.id);
                        setFormData({
                          equipamento_id: ordem.equipamento_id,
                          setor: ordem.setor,
                          descricao_problema: ordem.descricao_problema,
                          tipo_manutencao: ordem.tipo_manutencao,
                          status: ordem.status
                        });
                        setShowModal(true);
                      }}
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
            <h2>{editingId ? 'Editar Ordem' : 'Nova Ordem de Serviço'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Equipamento</label>
                <select
                  value={formData.equipamento_id}
                  onChange={(e) => setFormData({ ...formData, equipamento_id: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Selecione um equipamento</option>
                  {equipamentos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nome} ({eq.numero_identificacao})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Setor</label>
                <input
                  type="text"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Descrição do Problema</label>
                <textarea
                  value={formData.descricao_problema}
                  onChange={(e) => setFormData({ ...formData, descricao_problema: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Tipo Manutenção</label>
                <select
                  value={formData.tipo_manutencao}
                  onChange={(e) => setFormData({ ...formData, tipo_manutencao: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="corretiva">Corretiva</option>
                  <option value="programada">Programada</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="aberta">Aberta</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="fechada">Fechada</option>
                  <option value="cancelada">Cancelada</option>
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

