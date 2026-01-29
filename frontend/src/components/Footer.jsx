import React from 'react';
import { FaKeyboard, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer style={{ 
      background: 'var(--bg-card)', 
      borderTop: '1px solid var(--border-subtle)',
      padding: '1.5rem 0',
      marginTop: 'auto',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        
        {/* Left: Copyright */}
        <div style={{ color: 'var(--text-secondary)' }}>
          <p>&copy; {year} Multi-Format Link Converter.</p>
        </div>

        {/* Center: Quick Tips (Visual only for now) */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          color: 'var(--text-secondary)',
          background: 'var(--bg-app)',
          padding: '6px 16px',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaKeyboard /> Pro Tips:
          </span>
          <span><b>Ctrl+V</b> to Paste & Clean</span>
          <span><b>Click Output</b> to Copy</span>
        </div>

        {/* Right: Social/Links */}
        <div style={{ display: 'flex', gap: '15px' }}>
           <a 
             href="https://shakeeb-sa.github.io/" 
             target="_blank" 
             rel="noreferrer"
             style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
           >
             <FaGithub /> Developer
           </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;