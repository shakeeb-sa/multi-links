import React, { useEffect, useState, useContext } from 'react';
import { FaHistory, FaTrash, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const HistorySidebar = ({ isOpen, onClose, onSelect, showToast }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await API.get('/snippets');
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const deleteSnippet = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this snippet?")) return;
    try {
      await API.delete(`/snippets/${id}`);
      setHistory(history.filter(item => item._id !== id));
      showToast("Snippet removed", "info");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHistory color="var(--primary)" />
          <h3>Your Link Vault</h3>
        </div>
        <button className="btn-icon" onClick={onClose}><FaTimes /></button>
      </div>

      <div className="sidebar-content">
        {loading ? (
          <p className="status-text">Loading vault...</p>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>Your vault is empty.</p>
            <small>Save conversions to see them here.</small>
          </div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="history-item" onClick={() => onSelect(item.content)}>
              <div className="item-info">
                <strong>{item.title}</strong>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="item-actions">
                <button className="action-btn delete" onClick={(e) => deleteSnippet(item._id, e)}>
                  <FaTrash size={12} />
                </button>
                <FaExternalLinkAlt size={12} className="load-icon" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;