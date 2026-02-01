import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = ({ showToast }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/login', formData);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      showToast(`Welcome back, ${data.user.username}!`, "success");
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="split-screen">
      {/* Visual Side */}
      <div className="auth-visual-side">
       <img 
  src="assets/login.jpg" /* Removed the leading slash and public/ */
  alt="Login Visual" 
  className="auth-illustration"
  style={{ 
    width: '100%', 
    maxWidth: '450px', 
    borderRadius: '16px', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    objectFit: 'cover'
  }}
/>
        <div className="auth-quote">
          <h2>Streamline your workflow.</h2>
          <p>“The fastest way to manage link lists for modern content teams.”</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ border: 'none', boxShadow: 'none', textAlign: 'left', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ marginBottom: '32px' }}>Enter your credentials to access your vault.</p>
          
          <form onSubmit={handleSubmit}>
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
              {loading ? "Authenticating..." : "Sign In to Workspace"}
            </button>
          </form>

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
            <p>New to Multi-Link? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;