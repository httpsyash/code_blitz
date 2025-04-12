import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLightbulb } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <h1 className="text-xl font-bold">
              <span style={{ 
                color: 'var(--primary)',
                backgroundImage: 'linear-gradient(120deg, var(--primary-light) 0%, var(--primary) 100%)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 0.2em',
                backgroundPosition: '0 88%',
                transition: 'all var(--transition-speed) ease-in-out',
              }}>Build</span>
              <span>Estimate</span>
            </h1>
          </Link>
          <nav>
            <ul className="flex">
              <li className="mr-4">
                <Link 
                  to="/" 
                  className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <FaHome className="mr-2" /> Estimator
                </Link>
              </li>
              <li>
                <Link 
                  to="/optimisation" 
                  className={`btn ${location.pathname === '/optimisation' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <FaLightbulb className="mr-2" /> Optimisation
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 