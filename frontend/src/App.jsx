import React, { useState, useEffect } from 'react';
// Changed BrowserRouter to HashRouter
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ConverterSection from './components/ConverterSection';
import Toast from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadContent, setLoadContent] = useState(null); // Holds content selected from History

  const triggerToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

    useEffect(() => {
    document.title = "Multi Link | Professional Link Converter & Vault";
  }, []);

  return (
    <AuthProvider>
      {/* Basename is removed because HashRouter handles the path after the # symbol */}
      <Router>
        <div className="app-wrapper">
          {/* Header now receives sidebar controls */}
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            openSidebar={() => setIsSidebarOpen(true)} 
          />
          
          <main className="container" style={{ flex: 1, padding: '2rem 0' }}>
            <Routes>
              {/* Dashboard Route */}
              <Route path="/" element={
                <>
                  <div style={{ textAlign: 'center', padding: '4rem 0 5rem 0' }}>
  <div style={{ 
    display: 'inline-block', 
    padding: '6px 16px', 
    background: 'var(--primary-soft)', 
    color: 'var(--primary)', 
    borderRadius: '20px', 
    fontSize: '0.8rem', 
    fontWeight: '700', 
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>
    🚀 Version 2.0 Now Live
  </div>
  <h1 style={{ 
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
    color: 'var(--text-main)', 
    fontWeight: '900', 
    letterSpacing: '-2px',
    lineHeight: '1.1',
    marginBottom: '24px'
  }}>
    The Professional Link <br />
    <span style={{ color: 'var(--primary)' }}>Workspace.</span>
  </h1>
  <p style={{ 
    fontSize: '1.25rem', 
    maxWidth: '650px', 
    margin: '0 auto', 
    color: 'var(--text-secondary)',
    lineHeight: '1.6' 
  }}>
    An all-in-one environment to clean, transform, and vault your hyperlinks. Built for content teams who demand speed.
  </p>
</div>
                  
<div className="converter-grid" style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 550px), 1fr))', 
  gap: '32px',
  paddingBottom: '4rem'
}}>
  <ConverterSection id={1} showToast={triggerToast} loadContent={loadContent} />
  <ConverterSection id={2} showToast={triggerToast} />
  <ConverterSection id={3} showToast={triggerToast} />
  <ConverterSection id={4} showToast={triggerToast} />
</div>
                </>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login showToast={triggerToast} />} />
              <Route path="/register" element={<Register showToast={triggerToast} />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />

          {/* New History Sidebar Integration */}
          <HistorySidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            showToast={triggerToast}
            onSelect={(content) => {
              // We wrap the content in an object with a timestamp/ID 
              // to force the child component to see a "new" prop every time.
              setLoadContent({ 
                text: content, 
                version: Date.now() 
              }); 
              setIsSidebarOpen(false);
              triggerToast("Loaded from vault", "success");
            }}
          />

          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;