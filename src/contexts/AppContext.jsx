import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [portfolioData, setPortfolioData] = useState([])
  const [teamData, setTeamData] = useState([])

  useEffect(() => {
    // Load data from JSON files
    const loadData = async () => {
      try {
        const portfolioResponse = await fetch('/data/portfolio.json')
        const portfolio = await portfolioResponse.json()
        setPortfolioData(portfolio)

        const teamResponse = await fetch('/data/team.json')
        const team = await teamResponse.json()
        setTeamData(team)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Check for existing session
    const session = localStorage.getItem('adminSession')
    if (session) {
      setUser(JSON.parse(session))
    }

    loadData()
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('adminSession', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminSession')
  }

  const updatePortfolioData = (newData) => {
    setPortfolioData(newData)
  }

  const updateTeamData = (newData) => {
    setTeamData(newData)
  }

  const value = {
    user,
    isLoading,
    portfolioData,
    teamData,
    login,
    logout,
    updatePortfolioData,
    updateTeamData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
