import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';
import '../style.css';
import "../header.css"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header animate__animated animate__slideInDown">
      <Link to="/" onClick={closeMenu}>
        <div className="logo-container">
          <img src="../images/logo.png" alt="Criktrac Logo" className="logo" />
          <h1 className="logo-title">Criktrac</h1>
        </div>
      </Link>

      <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav>
        <ul className={menuOpen ? 'show' : ''}>
          <li>
            <Link to="/search" onClick={closeMenu}>Search</Link>
          </li>
          <li>
            <Link to="/" onClick={closeMenu}>Live Score</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
