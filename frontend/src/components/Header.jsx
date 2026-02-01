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
      background: 'rgba(var(--bg-card-rgb), 0.8)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        
        {/* Logo Section */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
<div style={{ 
  height: '150px', // Increased height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <img 
    src="assets/logo.png"  /* Removed the leading slash */
    alt="Multi-Link Logo" 
    style={{ 
      height: '100%', 
      width: 'auto', // Allows the logo to be as wide as it needs to be
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' // Makes it pop
    }} 
  />
</div>
          <div style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.5px' }}>Multi-Link</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Pro Workspace</span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {token ? (
            <>
              <button className="btn-secondary" onClick={openSidebar} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <FaHistory /> Vault
              </button>
              
              <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)', margin: '0 8px' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-app)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.username}</span>
              </div>

              <button className="btn-icon" onClick={handleLogout} title="Logout" style={{ marginLeft: '8px' }}>
                <FaSignOutAlt size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', padding: '0 10px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem' }}>
                Get Started — It's Free
              </Link>
            </>
          )}
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="btn-icon"
            style={{ marginLeft: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;