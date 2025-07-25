import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'animate.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Live Score' },
    { to: '/search', label: 'Search' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg animate__animated animate__slideInDown">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Criktrac Logo"
            className="w-12 h-12 rounded-full border-4 border-gray-300 hover:rotate-360 transform transition duration-500"
          />
          <span className="text-white text-xl md:text-2xl font-bold tracking-widest uppercase">
            Criktrac
          </span>
        </Link>

        {/* Hamburger Button */}
        <div className="md:hidden flex flex-col gap-1 cursor-pointer" onClick={toggleMenu}>
          <span
            className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-200 transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`relative text-gray-200 hover:text-white transition-transform duration-300 hover:-translate-y-1 font-medium tracking-wide uppercase ${
                location.pathname === link.to ? 'underline underline-offset-4 text-white' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden flex flex-col items-center bg-gray-900 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-60 py-4' : 'max-h-0'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={`block w-full text-center py-2 text-gray-200 hover:bg-gray-800 font-medium tracking-wider uppercase ${
              location.pathname === link.to ? 'bg-gray-800 text-white' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
