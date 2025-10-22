import React, { useState } from 'react';
import { Menu, X, LogOut, Home, Package, Wrench, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'equipamentos', label: 'Equipamentos', icon: Package },
    { id: 'ordens-servico', label: 'Ordens de Serviço', icon: Wrench },
    { id: 'fornecedores', label: 'Fornecedores', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users }
  ];

  const sidebarStyle = {
    position: isMobile ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    width: isMobile ? '100%' : '250px',
    height: isMobile ? 'auto' : '100vh',
    backgroundColor: '#4f46e5',
    color: 'white',
    display: isMobile && !isOpen ? 'none' : 'flex',
    flexDirection: 'column',
    zIndex: 999,
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const navStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px 0'
  };

  const menuItemStyle = (isActive) => ({
    padding: '15px 20px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    borderLeft: isActive ? '4px solid white' : 'none',
    paddingLeft: isActive ? '16px' : '20px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500'
  });

  const logoutButtonStyle = {
    padding: '15px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
    transition: 'background-color 0.2s ease'
  };

  return (
    <>
      {isMobile && (
        <div style={{
          backgroundColor: '#4f46e5',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Clínica</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      <div style={sidebarStyle}>
        {!isMobile && (
          <div style={headerStyle}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Clínica</h1>
          </div>
        )}

        <nav style={navStyle}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (isMobile) setIsOpen(false);
                }}
                style={menuItemStyle(isActive)}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile && !isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          style={logoutButtonStyle}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>

      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
        />
      )}
    </>
  );
}
