import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const loginContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

const loginCardStyle = {
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
}

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333',
  textAlign: 'center',
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '30px',
  textAlign: 'center',
}

const formGroupStyle = {
  marginBottom: '20px',
}

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '8px',
  color: '#333',
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '10px',
}

const buttonHoverStyle = {
  background: '#5568d3',
}

const errorStyle = {
  color: '#dc3545',
  fontSize: '14px',
  marginTop: '10px',
  textAlign: 'center',
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_usuario: username,
          senha: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        onLogin(data.token)
      } else {
        setError(data.message || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={loginContainerStyle}>
      <div style={loginCardStyle}>
        <h1 style={titleStyle}>Sistema de Gestão</h1>
        <p style={subtitleStyle}>Clínica de Ortopedia</p>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nome de Usuário</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              ...(buttonHover ? buttonHoverStyle : {}),
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

