import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Register = ({ showToast }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/register', formData);
      showToast("Account created! Please login.", "success");
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="split-screen">
      {/* Visual Side */}
      <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #0d1117 0%, var(--primary-dark) 100%)' }}>
<img 
  src="assets/register.jpg" /* Removed the leading slash and public/ */
  alt="Register Visual" 
  className="auth-illustration"
  style={{ 
    width: '100%', 
    maxWidth: '500px', 
    borderRadius: '16px', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    objectFit: 'cover'
  }}
/>
        <div className="auth-quote">
          <h2>Join the community.</h2>
          <p>Organize, convert, and sync your link snippets across all your devices.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ border: 'none', boxShadow: 'none', textAlign: 'left', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ marginBottom: '32px' }}>Start your journey with our professional link tools.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input 
                type="text" 
                required 
                placeholder="johndoe"
                style={{ padding: '14px', borderRadius: '10px' }}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input 
                type="email" 
                required 
                placeholder="name@company.com"
                style={{ padding: '14px', borderRadius: '10px' }}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                style={{ padding: '14px', borderRadius: '10px' }}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary auth-btn" disabled={loading} style={{ padding: '14px', borderRadius: '10px', marginTop: '10px' }}>
              {loading ? "Creating Workspace..." : "Create Free Account"}
            </button>
          </form>

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
            <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign in instead</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;