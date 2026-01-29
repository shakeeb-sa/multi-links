import React, { useContext } from 'react';
import { FaMoon, FaSun, FaCode, FaHistory, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = ({ darkMode, setDarkMode, openSidebar }) => {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      background: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo Section */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaCode size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: 1 }}>Multi-Link</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Converter Tool</span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {token ? (
            // LOGGED IN UI
            <>
              <button className="btn-secondary" onClick={openSidebar} style={{ gap: '8px' }}>
                <FaHistory /> Vault
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                <FaUser size={12} /> {user?.username}
              </div>

              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <FaSignOutAlt size={18} />
              </button>
            </>
          ) : (
            // LOGGED OUT UI
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '6px 16px' }}>
                Join Free
              </Link>
            </>
          )}
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }}></div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="btn-icon"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;