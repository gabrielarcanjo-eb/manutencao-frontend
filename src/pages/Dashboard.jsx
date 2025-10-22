import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Equipamentos from './Equipamentos';
import OrdensServico from './OrdensServico';
import Fornecedores from './Fornecedores';
import Usuarios from './Usuarios';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const token = localStorage.getItem('token');
  let userPermission = 'visualizador';
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userPermission = decoded.permissao || 'visualizador';
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }
  }

  const mainStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    width: isMobile ? '100%' : 'calc(100% - 250px)'
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'equipamentos':
        return <Equipamentos />;
      case 'ordens-servico':
        return <OrdensServico />;
      case 'fornecedores':
        return <Fornecedores />;
      case 'usuarios':
        return <Usuarios />;
      default:
        return (
          <div style={{ padding: isMobile ? '16px' : '20px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: isMobile ? '16px' : '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, color: '#0369a1', fontSize: isMobile ? '14px' : '16px' }}>
                Sua Permissão: <strong>{userPermission}</strong>
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: isMobile ? '16px' : '24px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ marginTop: 0, fontSize: isMobile ? '20px' : '24px' }}>Bem-vindo ao Sistema</h2>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: isMobile ? '14px' : '16px' }}>
                Este é o dashboard principal do sistema de gestão de clínica de ortopedia. Utilize o menu lateral para navegar entre as diferentes seções do sistema.
              </p>
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                fontSize: isMobile ? '13px' : '14px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>Funcionalidades Disponíveis:</p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                  <li>Gestão de Equipamentos</li>
                  <li>Controle de Ordens de Serviço</li>
                  <li>Cadastro de Fornecedores</li>
                  <li>Gerenciamento de Usuários</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={mainStyle}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div style={contentStyle}>
        {renderPage()}
      </div>
    </div>
  );
}
