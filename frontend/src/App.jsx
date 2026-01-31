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
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-main)', fontWeight: '800', letterSpacing: '-1px' }}>
                      Format links <span style={{ color: 'var(--primary)' }}>instantly.</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                      Clean, convert, and save hyperlinks for HTML, Markdown, and BBCode.
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', 
                    gap: '24px' 
                  }}>
                    {/* id=1 is the primary section that receives loaded content from the vault */}
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