import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const pageStyle = {
  padding: '20px',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#333',
}

const buttonStyle = {
  background: '#667eea',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  marginBottom: '20px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'white',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
}

const thStyle = {
  background: '#f5f5f5',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '1px solid #ddd',
  color: '#333',
}

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  color: '#666',
}

const badgeStyle = {
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'inline-block',
}

const statusBadgeStyle = (status) => {
  const colors = {
    aberta: { background: '#ffc107', color: '#000' },
    em_andamento: { background: '#17a2b8', color: '#fff' },
    fechada: { background: '#28a745', color: '#fff' },
    cancelada: { background: '#dc3545', color: '#fff' },
  }
  return { ...badgeStyle, ...colors[status] }
}

const emptyMessageStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#999',
  background: 'white',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const loadingStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#667eea',
  fontSize: '16px',
}

function OrdensServico({ token }) {
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrdens()
  }, [])

  const fetchOrdens = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/ordens-servico`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrdens(data)
      } else {
        setError('Erro ao carregar ordens de serviço')
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Ordens de Serviço</h1>
      <button style={buttonStyle}>+ Nova Ordem de Serviço</button>

      {loading && <div style={loadingStyle}>Carregando ordens de serviço...</div>}
      {error && <div style={{ ...emptyMessageStyle, color: '#dc3545' }}>{error}</div>}
      {!loading && !error && ordens.length === 0 && (
        <div style={emptyMessageStyle}>Nenhuma ordem de serviço cadastrada</div>
      )}

      {!loading && !error && ordens.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Setor</th>
              <th style={thStyle}>Descrição</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Data Abertura</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((ordem) => (
              <tr key={ordem.id}>
                <td style={tdStyle}>{ordem.id}</td>
                <td style={tdStyle}>{ordem.setor}</td>
                <td style={tdStyle}>{ordem.descricao_problema?.substring(0, 50)}...</td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(ordem.status)}>{ordem.status}</span>
                </td>
                <td style={tdStyle}>{ordem.tipo_manutencao}</td>
                <td style={tdStyle}>{ordem.data_abertura}</td>
                <td style={tdStyle}>
                  <button style={{ ...buttonStyle, background: '#28a745', marginRight: '5px' }}>Editar</button>
                  <button style={{ ...buttonStyle, background: '#dc3545' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OrdensServico

