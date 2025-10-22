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

function Fornecedores({ token }) {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFornecedores()
  }, [])

  const fetchFornecedores = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/fornecedores`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFornecedores(data)
      } else {
        setError('Erro ao carregar fornecedores')
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
      <h1 style={titleStyle}>Gestão de Fornecedores</h1>
      <button style={buttonStyle}>+ Adicionar Fornecedor</button>

      {loading && <div style={loadingStyle}>Carregando fornecedores...</div>}
      {error && <div style={{ ...emptyMessageStyle, color: '#dc3545' }}>{error}</div>}
      {!loading && !error && fornecedores.length === 0 && (
        <div style={emptyMessageStyle}>Nenhum fornecedor cadastrado</div>
      )}

      {!loading && !error && fornecedores.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Contato</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefone</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td style={tdStyle}>{fornecedor.id}</td>
                <td style={tdStyle}>{fornecedor.nome}</td>
                <td style={tdStyle}>{fornecedor.contato}</td>
                <td style={tdStyle}>{fornecedor.email}</td>
                <td style={tdStyle}>{fornecedor.telefone}</td>
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

export default Fornecedores

