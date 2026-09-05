import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // For now, using hardcoded credentials. In production, this would authenticate with Supabase
    if (email === 'admin@mescriptlabs.com' && password === 'admin123') {
      login({
        id: '1',
        email: email,
        role: 'owner',
        name: 'Admin User'
      })
      navigate('/admin')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#00FFFF]">Admin Login</h1>

        <div className="bg-[#1F2833] p-8 rounded-lg border border-[#0B0C10]">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors"
                placeholder="admin@mescriptlabs.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#00FFFF] text-[#0B0C10] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B949E]">
            Demo credentials: admin@mescriptlabs.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
