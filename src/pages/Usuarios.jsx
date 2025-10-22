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

const permissionBadgeStyle = (permission) => {
  const colors = {
    administrador: { background: '#dc3545', color: '#fff' },
    patrimonio: { background: '#007bff', color: '#fff' },
    tecnico: { background: '#28a745', color: '#fff' },
    visualizador: { background: '#6c757d', color: '#fff' },
  }
  return { ...badgeStyle, ...colors[permission] }
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

function Usuarios({ token }) {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      } else {
        setError('Erro ao carregar usuários')
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
      <h1 style={titleStyle}>Gestão de Usuários</h1>
      <button style={buttonStyle}>+ Adicionar Usuário</button>

      {loading && <div style={loadingStyle}>Carregando usuários...</div>}
      {error && <div style={{ ...emptyMessageStyle, color: '#dc3545' }}>{error}</div>}
      {!loading && !error && usuarios.length === 0 && (
        <div style={emptyMessageStyle}>Nenhum usuário cadastrado</div>
      )}

      {!loading && !error && usuarios.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nome de Usuário</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Permissão</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td style={tdStyle}>{usuario.id}</td>
                <td style={tdStyle}>{usuario.nome_usuario}</td>
                <td style={tdStyle}>{usuario.email}</td>
                <td style={tdStyle}>
                  <span style={permissionBadgeStyle(usuario.permissao)}>{usuario.permissao}</span>
                </td>
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

export default Usuarios

