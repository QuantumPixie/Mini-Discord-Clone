import { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username.trim())
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Enter your name</h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}

export default Login
