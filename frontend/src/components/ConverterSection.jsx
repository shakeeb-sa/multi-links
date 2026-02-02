import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaLink, FaBroom, FaEraser, FaCopy, FaCloudUploadAlt } from 'react-icons/fa';
import { cleanContent, generateFormats, isValidURL } from '../utils/converter';
import { AuthContext } from '../context/AuthContext';
import API from '../api'; // Using the pre-configured API utility

const ConverterSection = ({ id, showToast, loadContent }) => {
  const [formats, setFormats] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [linkCount, setLinkCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [availableProjects, setAvailableProjects] = useState([]);
  
  // Refs
  const editorRef = useRef(null);
  const savedRange = useRef(null); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (document.activeElement === editorRef.current) {
          e.preventDefault();
          const selection = window.getSelection();
          if (!selection.rangeCount || selection.isCollapsed) {
            showToast("Please select some text first", "info");
          } else {
            // SAVE the range here too!
            savedRange.current = selection.getRangeAt(0); 
            setIsModalOpen(true);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]); // Added showToast to dependencies
  
  const { token } = useContext(AuthContext);

  // Effect to load content from the Vault (History Sidebar)
  useEffect(() => {
    // Check if loadContent exists and specifically target Section 1
    if (id === 1 && loadContent?.text && editorRef.current) {
      editorRef.current.innerHTML = loadContent.text;
      handleInput(); // Re-generate formats (Markdown, HTML, etc.)
      
      // Scroll to top of editor if it's long content
      editorRef.current.scrollTop = 0;
    }
  }, [loadContent, id]); // Added id to dependencies

  const stripFragments = (str) => str.replace(/<!--StartFragment-->|<!--EndFragment-->/g, "");

  const countLinks = (html) => {
    return (html.match(/<a\s/gi) || []).length;
  };

  const handleInput = () => {
    if (editorRef.current) {
      let currentHTML = editorRef.current.innerHTML;
      if (currentHTML.includes('<!--StartFragment-->')) {
         currentHTML = stripFragments(currentHTML);
      }
      setFormats(generateFormats(currentHTML));
      setLinkCount(countLinks(currentHTML));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');

    let contentToInsert;
    if (html) {
      const noFragments = stripFragments(html);
      contentToInsert = cleanContent(noFragments);
    } else {
      contentToInsert = text.replace(/\n/g, '<br>');
    }
    document.execCommand('insertHTML', false, contentToInsert);
    handleInput();
  };

  const saveSnippet = async () => {
    if (!token) {
      showToast("Please login to save snippets", "info");
      return;
    }
    if (!editorRef.current?.innerHTML || editorRef.current.innerHTML === "<br>") {
      showToast("Editor is empty", "info");
      return;
    }

    try {
      const { data } = await API.get('/projects');
      setAvailableProjects(data);
      if (data.length > 0) {
        setSelectedFolder(data[0]._id); // Default to first folder
      }
      setIsSaveModalOpen(true);
    } catch (err) {
      showToast("Failed to load folders", "error");
    }
  };

    const confirmSave = async () => {
    if (!saveTitle || !selectedFolder) {
      showToast("Please enter a title and select a folder", "error");
      return;
    }

    try {
      await API.post('/snippets', { 
        title: saveTitle, 
        content: editorRef.current.innerHTML,
        projectId: selectedFolder 
      });
      
      showToast(`Saved successfully!`, "success");
      setIsSaveModalOpen(false);
      setSaveTitle('');
    } catch (err) {
      showToast("Failed to save", "error");
    }
  };

  const confirmLink = () => {
    if (modalValue && isValidURL(modalValue)) {
      // 1. Get the selection object
      const selection = window.getSelection();
      
      // 2. Focus the editor FIRST
      editorRef.current.focus(); 

      // 3. Restore the highlighted range
      if (savedRange.current) {
        selection.removeAllRanges();
        selection.addRange(savedRange.current);
      }

      // 4. Execute the command while the range is active
      document.execCommand('createLink', false, modalValue);
      
      // 5. Cleanup: Close modal AFTER the command is done
      setModalValue('');
      setIsModalOpen(false);
      savedRange.current = null; 
      handleInput(); 
    } else {
      showToast("Please enter a valid URL", "error");
    }
  };

  const makeLink = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
      showToast("Please select some text first", "info");
      return;
    }
    // SAVE the selection range here
    savedRange.current = selection.getRangeAt(0); 
    setIsModalOpen(true);
  };

  const cleanEditor = () => {
    if (editorRef.current) {
      const clean = cleanContent(editorRef.current.innerHTML);
      editorRef.current.innerHTML = clean;
      handleInput();
      showToast("Styles and attributes stripped", "success");
    }
  };

  const clearEditor = () => {
    if (editorRef.current && window.confirm("Clear this editor?")) {
      editorRef.current.innerHTML = "";
      setFormats(null);
      setLinkCount(0);
    }
  };

  const handleCopy = () => {
    if (!formats) return;
    const textToCopy = formats[activeTab];
    navigator.clipboard.writeText(textToCopy);
    showToast(`Copied ${activeTab.toUpperCase()} to clipboard`, "success");
  };

  return (
    <div className="converter-card">
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={makeLink}>
            <FaLink size={12} /> Link
          </button>
          <button className="btn-secondary" onClick={cleanEditor}>
            <FaBroom size={12} /> Clean
          </button>
          
          {/* New Save to Vault Button */}
          <button className="btn-secondary" onClick={saveSnippet} title="Save to History">
            <FaCloudUploadAlt size={14} /> Save
          </button>

          {/* Link Counter Badge */}
          {linkCount > 0 && (
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'rgba(230, 43, 30, 0.1)', 
              color: 'var(--primary)', 
              padding: '4px 8px', 
              borderRadius: '12px',
              fontWeight: '600',
              marginLeft: '5px'
            }}>
              {linkCount} Links
            </span>
          )}
        </div>
        
        <button className="btn-icon" onClick={clearEditor} title="Clear All">
          <FaEraser size={14} />
        </button>
      </div>

      <div className="editor-container">
        <div
          ref={editorRef}
          className="editor"
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          data-placeholder={`Paste content for section ${id}...`}
        />
        <div className="char-count">
          {editorRef.current?.innerText.length || 0} chars
        </div>
      </div>

      {formats && (
        <div className="output-area" style={{ background: 'var(--bg-app)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          <div className="tabs">
            {['html', 'markdown', 'bbcode', 'raw', 'refmd'].map(tab => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'refmd' ? 'REF MD' : tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="code-block-wrapper">
            <div style={{ position: 'absolute', top: '8px', left: '12px', display: 'flex', gap: '5px' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></div>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <pre style={{ marginTop: '10px' }} onClick={handleCopy}>{formats[activeTab]}</pre>
            <button className="copy-btn-floating" onClick={handleCopy}>
              <FaCopy /> Copy
            </button>
          </div>
        </div>
      )}

            {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Insert Hyperlink</h3>
            <p>Paste the URL you want to attach to your selected text.</p>
            <input 
              autoFocus
              className="modal-input"
              placeholder="https://example.com"
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              onKeyDown={(e) => {
  if (e.key === 'Enter') {
    e.preventDefault();   // Stops the "New Line" action
    e.stopPropagation();  // Stops the event from reaching the editor
    confirmLink();
  }
}}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => {setIsModalOpen(false); setModalValue('');}}>Cancel</button>
              <button className="btn-primary" onClick={confirmLink}>Apply Link</button>
            </div>
          </div>
        </div>
      )}

            {/* Save to Vault Modal */}
      {isSaveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Save to Vault</h3>
            <p>Enter a title and choose a folder to organize this snippet.</p>
            
            <label className="modal-label">Snippet Title</label>
            <input 
              autoFocus
              className="modal-input"
              placeholder="e.g., Summer Campaign Links"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
            />

            <label className="modal-label">Select Folder</label>
            {availableProjects.length > 0 ? (
              <select 
                className="modal-select"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
              >
                {availableProjects.map(proj => (
                  <option key={proj._id} value={proj._id}>{proj.name}</option>
                ))}
              </select>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '20px' }}>
                No folders found. Please create one in the Vault sidebar first.
              </p>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsSaveModalOpen(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={confirmSave}
                disabled={availableProjects.length === 0}
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConverterSection;