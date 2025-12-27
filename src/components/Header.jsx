import React from 'react';
import { FaMoon, FaSun, FaCode } from 'react-icons/fa';

const Header = ({ darkMode, setDarkMode }) => {
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a 
            href="https://shakeeb-sa.github.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: '500', 
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Portfolio
          </a>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="btn-icon"
            aria-label="Toggle Dark Mode"
            style={{ width: '40px', height: '40px' }}
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;