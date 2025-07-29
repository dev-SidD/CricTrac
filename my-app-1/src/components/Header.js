import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'animate.css'; // Make sure you've installed animate.css: npm install animate.css --save

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Live Score' },
    { to: '/search', label: 'Search' }, // Changed label for clarity
             // Added for match types
  ];

  return (
    <header className="
      sticky top-0 z-50
      bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950
      shadow-2xl shadow-gray-900/50
      animate__animated animate__fadeInDown
      font-poppins
    ">
      <div className="flex items-center justify-between px-5 py-4 md:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
          <img
            src="/images/logo.png" // Ensure this path is correct
            alt="Criktrac Logo"
            className="
              w-14 h-14 rounded-full border-4 border-blue-600
              object-cover
              transform transition-all duration-700 ease-in-out
              group-hover:rotate-[360deg] group-hover:scale-105
              shadow-lg shadow-blue-500/30
            "
          />
          <span className="
            text-white text-2xl md:text-3xl font-extrabold tracking-widest uppercase
            bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400
            transition-all duration-300 ease-in-out
            group-hover:tracking-wider
          ">
            Criktrac
          </span>
        </Link>

        {/* Hamburger Button */}
        <div className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2" onClick={toggleMenu}>
          <span
            className={`block w-8 h-1 bg-white rounded-full transition-all duration-300 ease-in-out ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-8 h-1 bg-white rounded-full transition-opacity duration-300 ease-in-out ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-8 h-1 bg-white rounded-full transition-all duration-300 ease-in-out ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`
                relative text-gray-300 text-lg font-semibold uppercase
                py-2 px-3
                transition-all duration-300 ease-in-out
                hover:text-blue-400 hover:scale-105
                group
                ${
                  location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                    ? 'text-blue-400 after:w-full' // Active state
                    : ''
                }
                after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full
                after:transition-all after:duration-300 after:ease-in-out
                hover:after:w-full
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      <div
        className={`
          md:hidden flex flex-col items-center
          bg-gray-900 transition-all duration-300 ease-in-out overflow-hidden
          ${menuOpen ? 'max-h-96 py-4 border-t border-gray-700' : 'max-h-0'}
        `}
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={`
              block w-full text-center py-3 text-lg
              text-gray-200 font-medium uppercase
              hover:bg-gray-700 hover:text-white
              transition-colors duration-200 ease-in-out
              ${
                location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'bg-gray-700 text-white font-bold'
                  : ''
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;