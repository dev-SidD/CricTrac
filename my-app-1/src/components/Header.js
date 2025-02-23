import React from 'react'
import "../style.css"
import { Link } from 'react-router-dom';
import 'animate.css';
function Header() {
  return (
    <header className="header animate__animated animate__slideInDown">
       <Link to="/"><div className="logo-container">
        <img src="../images/logo.png" alt="Criktrac Logo" className="logo" />
        <h1 className='logo-title'>Criktrac</h1>
      </div>
      </Link>
      <nav>
        <ul> 
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/">Live Score</Link>
          </li>
          
        </ul>
      </nav>
    </header>
  )
}

export default Header