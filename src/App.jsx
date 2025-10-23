import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userPermission, setUserPermission] = useState(() => {
    const storedPermission = localStorage.getItem('userPermission')
    return storedPermission ? storedPermission : null
  })

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserPermission(decodedToken.permissao)
        localStorage.setItem('userPermission', decodedToken.permissao)
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
        setToken(null)
        setUserPermission(null)
        localStorage.removeItem('token')
        localStorage.removeItem('userPermission')
      }
    }
  }, [token])

  const handleLogin = (newToken) => {
    setToken(newToken)
    try {
      const decodedToken = jwtDecode(newToken)
      setUserPermission(decodedToken.permissao)
      localStorage.setItem('userPermission', decodedToken.permissao)
    } catch (error) {
      console.error('Erro ao decodificar o token após login:', error)
      setUserPermission(null)
      localStorage.removeItem('userPermission')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userPermission")
    setToken(null)
    setUserPermission(null)
    navigate('https://manutencao-frontend.vercel.app/login', { replace: true })
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} userPermission={userPermission} /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

