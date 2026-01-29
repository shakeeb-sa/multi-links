import React, { useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto hide after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-enter" style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--text-main)',
      color: 'var(--bg-card)',
      padding: '12px 24px',
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 9999,
      fontWeight: '500',
      fontSize: '0.9rem',
      minWidth: '300px',
      justifyContent: 'center'
    }}>
      {type === 'success' ? 
        <FaCheckCircle style={{ color: '#4ade80' }} size={18} /> : 
        <FaInfoCircle style={{ color: '#60a5fa' }} size={18} />
      }
      <span>{message}</span>
    </div>
  );
};

export default Toast;