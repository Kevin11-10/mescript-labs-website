import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-[#1F2833]">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
              Mescript Labs
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all relative ${
                    location.pathname === link.path
                      ? 'text-[#00FFFF]'
                      : 'text-[#C5C6C7] hover:text-[#00FFFF]'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00FFFF] to-[#66FCF1]"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#C5C6C7] hover:text-[#00FFFF] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-[#00FFFF]/20 to-[#66FCF1]/20 text-[#00FFFF] border border-[#00FFFF]/30'
                      : 'text-[#C5C6C7] hover:bg-[#1F2833] hover:text-[#00FFFF]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-[#1F2833] border-t border-[#0B0C10] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00FFFF] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700] rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold gradient-text mb-4">Mescript Labs</h3>
              <p className="text-[#C5C6C7] text-sm">
                Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold gradient-text mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors flex items-center">
                    <span className="w-2 h-2 bg-[#00FFFF] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors flex items-center">
                    <span className="w-2 h-2 bg-[#00FFFF] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors flex items-center">
                    <span className="w-2 h-2 bg-[#00FFFF] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold gradient-text mb-4">Connect</h3>
              <a
                href="https://www.youtube.com/@MescriptLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#C5C6C7] hover:text-[#00FFFF] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mr-3 group-hover:bg-[#00FFFF]/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                YouTube
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#0B0C10] text-center text-sm text-[#8B949E]">
            <p>&copy; {new Date().getFullYear()} Mescript Labs. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-[#00FFFF] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#00FFFF] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
