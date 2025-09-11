import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, Search, TrendingUp, Zap } from 'lucide-react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Live Score', icon: Activity },
    { to: '/search', label: 'Player Stats', icon: Search },
    
  ];

  return (
    <>
      <header className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30' 
          : 'bg-transparent'
        }
      `}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10 opacity-0 transition-opacity duration-500" 
             style={{ opacity: scrolled ? 1 : 0 }} />
        
        <div className="relative z-10  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              onClick={closeMenu} 
              className="flex items-center space-x-3 group relative"
            >
              <div className="relative">
                {/* Animated background ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse" />
                
                {/* Logo container */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  Criktrac
                </span>
               
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to || 
                  (link.to !== '/' && location.pathname.startsWith(link.to));
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative group flex items-center space-x-2 px-4 py-2 rounded-xl
                      font-semibold text-sm transition-all duration-300
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl" />
                    )}
                    
                    <Icon size={18} className="relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                    menuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                    menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`
          md:hidden absolute top-full left-0 right-0
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
          border-t border-gray-200 dark:border-gray-700
          shadow-2xl shadow-black/10 dark:shadow-black/30
          transition-all duration-500 ease-out
          ${menuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to || 
                  (link.to !== '/' && location.pathname.startsWith(link.to));
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={`
                      group flex items-center space-x-3 px-4 py-3 rounded-2xl
                      font-semibold transition-all duration-300
                      transform hover:scale-[1.02]
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: menuOpen ? 'slideInRight 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                      }
                    `}>
                      <Icon size={20} />
                    </div>
                    <span className="text-lg">{link.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto">
                        <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20" />

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default Header;