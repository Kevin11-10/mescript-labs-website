import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import PortfolioEditor from '../components/admin/PortfolioEditor'
import TeamEditor from '../components/admin/TeamEditor'

const Admin = () => {
  const { user, logout } = useAppContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('portfolio')

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'team', label: 'Team' },
    { id: 'users', label: 'Users' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'goals', label: 'Sponsorship Goals' },
    { id: 'ai', label: 'AI Integration' },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#00FFFF]">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#1F2833] text-[#C5C6C7] rounded-lg hover:bg-[#0B0C10] hover:text-[#00FFFF] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#1F2833] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#00FFFF] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#0B0C10] hover:text-[#00FFFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
          {activeTab === 'portfolio' && <PortfolioEditor />}
          {activeTab === 'team' && <TeamEditor />}
          {activeTab === 'users' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#E0E6ED] mb-4">User Management</h2>
              <p className="text-[#C5C6C7]">User management feature coming soon.</p>
            </div>
          )}
          {activeTab === 'transactions' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#E0E6ED] mb-4">Transaction Monitoring</h2>
              <p className="text-[#C5C6C7]">Transaction monitoring feature coming soon.</p>
            </div>
          )}
          {activeTab === 'goals' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#E0E6ED] mb-4">Sponsorship Goals</h2>
              <p className="text-[#C5C6C7]">Sponsorship goals management coming soon.</p>
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#E0E6ED] mb-4">AI Integration</h2>
              <p className="text-[#C5C6C7]">AI integration configuration coming soon.</p>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-8 bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
          <h2 className="text-xl font-bold mb-4 text-[#E0E6ED]">Current User</h2>
          <div className="space-y-2 text-[#C5C6C7]">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span className="text-[#00FFFF]">{user.role}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
