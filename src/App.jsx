import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConverterSection from './components/ConverterSection';
import Toast from './components/Toast';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [toast, setToast] = useState(null);

  // Trigger a toast message
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="app-wrapper">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '3rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
            color: 'var(--text-main)', 
            fontWeight: '800', 
            letterSpacing: '-1px',
            marginBottom: '10px'
          }}>
            Format links <span style={{ color: 'var(--primary)' }}>instantly.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            The professional tool for cleaning, converting, and preparing hyperlinks for HTML, Markdown, and BBCode.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', 
          gap: '24px' 
        }}>
          {/* Pass the triggerToast function to each section */}
          <ConverterSection id={1} showToast={triggerToast} />
          <ConverterSection id={2} showToast={triggerToast} />
          <ConverterSection id={3} showToast={triggerToast} />
          <ConverterSection id={4} showToast={triggerToast} />
        </div>

      </main>

      <Footer />
      
      {/* Global Toast Container */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default App;