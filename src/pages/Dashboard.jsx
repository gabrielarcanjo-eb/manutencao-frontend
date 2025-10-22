import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Equipamentos from './Equipamentos'
import OrdensServico from './OrdensServico'
import Fornecedores from './Fornecedores'
import Usuarios from './Usuarios'

const dashboardContainerStyle = {
  minHeight: '100vh',
  background: '#f5f5f5',
  display: 'flex',
}

const headerStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '20px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
}

const logoutButtonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  border: '1px solid white',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
}

const contentStyle = {
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
}

const cardStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const cardTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333',
}

const permissionStyle = {
  background: '#e8f4f8',
  padding: '10px 15px',
  borderRadius: '4px',
  fontSize: '14px',
  color: '#333',
  marginBottom: '20px',
}

const mainContentStyle = {
  marginLeft: '250px',
  minHeight: '100vh',
  background: '#f5f5f5',
  flex: 1,
}

function Dashboard({ onLogout, userPermission }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      onLogout()
    }, 500)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <div style={dashboardContainerStyle}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div style={mainContentStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Sistema de Gestão</h1>
          <button style={logoutButtonStyle} onClick={handleLogout} disabled={loading}>
            {loading ? 'Saindo...' : 'Sair'}
          </button>
        </header>

        {currentPage === 'dashboard' && (
          <div style={contentStyle}>
            <div style={permissionStyle}>
              <strong>Sua Permissão:</strong> {userPermission || 'Não definida'}
            </div>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Bem-vindo ao Sistema</h2>
              <p>Este é o dashboard principal do sistema de gestão de clínica de ortopedia.</p>
            </div>
          </div>
        )}

        {currentPage === 'equipamentos' && <Equipamentos token={localStorage.getItem('token')} />}
        {currentPage === 'ordens-servico' && <OrdensServico token={localStorage.getItem('token')} />}
        {currentPage === 'fornecedores' && <Fornecedores token={localStorage.getItem('token')} />}
        {currentPage === 'usuarios' && <Usuarios token={localStorage.getItem('token')} />}
      </div>
    </div>
  )
}

export default Dashboard

