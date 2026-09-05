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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0C10]/80 border-b border-[#1F2833]">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-[#00FFFF] hover:text-[#FFD700] transition-colors">
              Mescript Labs
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#00FFFF]'
                      : 'text-[#C5C6C7] hover:text-[#00FFFF]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#C5C6C7] hover:text-[#00FFFF]"
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
            <div className="md:hidden mt-4 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#00FFFF]'
                      : 'text-[#C5C6C7] hover:text-[#00FFFF]'
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

      <footer className="bg-[#1F2833] border-t border-[#0B0C10] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-[#00FFFF] mb-4">Mescript Labs</h3>
              <p className="text-[#C5C6C7] text-sm">
                Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#00FFFF] mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#00FFFF] mb-4">Connect</h3>
              <a
                href="https://www.youtube.com/@MescriptLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#C5C6C7] hover:text-[#00FFFF] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
