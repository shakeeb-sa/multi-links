import React from 'react';
import { FaGithub, FaLinkedin, FaBriefcase, FaEnvelope, FaCode, FaExternalLinkAlt } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer style={{ 
      background: 'var(--bg-card)', 
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto',
      color: 'var(--text-secondary)'
    }}>
      <div className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '40px',
        marginBottom: '40px'
      }}>
        
        {/* Column 1: Brand */}
        <div style={{ gridColumn: 'span 1.5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', marginBottom: '15px' }}>
            <FaCode size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Multi Link</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '280px' }}>
            The professional toolset for formatting and managing link lists instantly. Built for developers and SEO specialists.
          </p>
        </div>

        {/* Column 2: Product */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li>Converter</li>
            <li>Link Vault</li>
            <li>Bulk Processing</li>
            <li>API <span style={{fontSize: '0.7rem', background: 'var(--primary-soft)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px'}}>Beta</span></li>
          </ul>
        </div>

        {/* Column 3: Connect */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="https://github.com/shakeeb-sa" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaGithub /> GitHub
            </a>
            <a href="https://pk.linkedin.com/in/shakeeb-ahmed-034093370" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaLinkedin /> LinkedIn
            </a>
            <a href="https://shakeeb-sa.github.io/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaExternalLinkAlt size={12} /> Portfolio
            </a>
            <a href="shakeeb.sa.ahmed@gmail.com" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEnvelope /> Contact Email
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container" style={{ 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border-subtle)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        fontSize: '0.8rem'
      }}>
        <p>&copy; {year} <b>Multi Link</b>. Made with by <b>Shakeeb Ahmed</b>.</p>
        <div style={{ display: 'flex', gap: '20px', fontWeight: '500' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;