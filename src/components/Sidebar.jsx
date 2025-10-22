import { useState } from 'react'

const sidebarStyle = {
  width: '250px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '20px',
  minHeight: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  overflowY: 'auto',
}

const logoStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}

const navItemStyle = {
  padding: '12px 15px',
  marginBottom: '5px',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  fontSize: '14px',
}

const navItemHoverStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
}

const navItemActiveStyle = {
  background: 'rgba(255, 255, 255, 0.3)',
  fontWeight: 'bold',
}

function Sidebar({ currentPage, onNavigate }) {
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'equipamentos', label: 'Equipamentos', icon: '🔧' },
    { id: 'ordens-servico', label: 'Ordens de Serviço', icon: '📋' },
    { id: 'fornecedores', label: 'Fornecedores', icon: '🏢' },
    { id: 'usuarios', label: 'Usuários', icon: '👥' },
  ]

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        🏥 Clínica Ortopedia
      </div>
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...navItemStyle,
              ...(hoveredItem === item.id ? navItemHoverStyle : {}),
              ...(currentPage === item.id ? navItemActiveStyle : {}),
            }}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

