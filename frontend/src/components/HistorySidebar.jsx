import React, { useEffect, useState, useContext } from 'react';
import { FaHistory, FaTrash, FaExternalLinkAlt, FaTimes, FaFolder, FaFolderOpen, FaPlus, FaSearch } from 'react-icons/fa';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const HistorySidebar = ({ isOpen, onClose, onSelect, showToast }) => {
  const [projects, setProjects] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { token } = useContext(AuthContext);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [projRes, snipRes] = await Promise.all([
        API.get('/projects'),
        API.get('/snippets')
      ]);
      setProjects(projRes.data);
      setSnippets(snipRes.data);
    } catch (err) {
      console.error("Failed to fetch vault data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    try {
      const { data } = await API.post('/projects', { name });
      setProjects([data, ...projects]);
      showToast("Folder created", "success");
    } catch (err) {
      showToast("Failed to create folder", "error");
    }
  };

  const deleteFolder = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete folder and ALL snippets inside?")) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      setSnippets(snippets.filter(s => s.projectId !== id));
      showToast("Folder deleted", "info");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const deleteSnippet = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this snippet?")) return;
    try {
      await API.delete(`/snippets/${id}`);
      setSnippets(snippets.filter(item => item._id !== id));
      showToast("Snippet removed", "info");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  // --- Dynamic Search Logic ---
  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHistory color="var(--primary)" />
          <h3>Link Vault</h3>
        </div>
        <button className="btn-icon" onClick={onClose}><FaTimes /></button>
      </div>

      <div className="search-container">
        <div style={{ position: 'relative' }}>
           <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
           <input 
             type="text" 
             className="search-input" 
             placeholder="Search snippets..." 
             style={{ paddingLeft: '35px' }}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="sidebar-content">
        {loading ? (
          <p className="status-text">Loading vault...</p>
        ) : searchTerm ? (
          // --- SEARCH RESULTS VIEW ---
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Search results:</p>
            {filteredSnippets.map(snip => (
              <div key={snip._id} className="history-item" onClick={() => onSelect(snip.content)}>
                <div className="item-info">
                  <strong>{snip.title} <span className="project-badge">{snip.projectId?.name || 'Project'}</span></strong>
                  <span>{new Date(snip.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="action-btn delete" onClick={(e) => deleteSnippet(snip._id, e)}>
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          // --- FOLDER VIEW ---
          <>
            {projects.map(proj => (
              <div key={proj._id} className="folder-section">
                <div className="folder-header" onClick={() => toggleFolder(proj._id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {expandedFolders[proj._id] ? <FaFolderOpen color="var(--primary)" /> : <FaFolder color="var(--primary)" />}
                    {proj.name}
                  </div>
                  <button className="action-btn delete" onClick={(e) => deleteFolder(proj._id, e)}>
                    <FaTrash size={10} />
                  </button>
                </div>
                
                {expandedFolders[proj._id] && (
                  <div className="folder-content">
                    {snippets.filter(s => (s.projectId?._id || s.projectId) === proj._id).map(snip => (
                      <div key={snip._id} className="history-item" onClick={() => onSelect(snip.content)}>
                        <div className="item-info">
                          <strong>{snip.title}</strong>
                        </div>
                        <button className="action-btn delete" onClick={(e) => deleteSnippet(snip._id, e)}>
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="add-folder-btn" onClick={addFolder}>
              <FaPlus size={10} /> New Folder
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;