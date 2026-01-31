import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaLink, FaBroom, FaEraser, FaCopy, FaCloudUploadAlt } from 'react-icons/fa';
import { cleanContent, generateFormats, isValidURL } from '../utils/converter';
import { AuthContext } from '../context/AuthContext';
import API from '../api'; // Using the pre-configured API utility

const ConverterSection = ({ id, showToast, loadContent }) => {
  const [formats, setFormats] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [linkCount, setLinkCount] = useState(0);
  const editorRef = useRef(null);
  
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
        // 1. Fetch Projects to show in selection
        const { data: projects } = await API.get('/projects');
        
        if (projects.length === 0) {
            const createNew = window.confirm("No folders found. Create your first folder?");
            if (createNew) {
                const folderName = prompt("Enter folder name (e.g., RotationManager):");
                if (!folderName) return;
                const { data: newProj } = await API.post('/projects', { name: folderName });
                projects.push(newProj);
            } else {
                return;
            }
        }

        // 2. Simple prompt-based selection for now (to keep it stable)
        const projectList = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
        const choice = prompt(`Where to save?\n${projectList}\n\nEnter the number:`);
        
        const selectedProject = projects[parseInt(choice) - 1];
        if (!selectedProject) {
            showToast("Invalid selection", "error");
            return;
        }

        const title = prompt("Enter a title for this snippet:");
        if (!title) return;

        await API.post('/snippets', { 
            title, 
            content: editorRef.current.innerHTML,
            projectId: selectedProject._id // Important: Link to folder
        });
        
        showToast(`Saved to ${selectedProject.name}`, "success");
    } catch (err) {
        showToast("Failed to save", "error");
    }
};

  const makeLink = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
      showToast("Please select some text first", "info");
      return;
    }

    const url = prompt("Enter URL:");
    if (url && isValidURL(url)) {
      document.execCommand('createLink', false, url);
      handleInput(); 
    } else if (url) {
      showToast("Invalid URL format", "error");
    }
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
        <div className="output-area">
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
            <pre onClick={handleCopy}>{formats[activeTab]}</pre>
            <button className="copy-btn-floating" onClick={handleCopy}>
              <FaCopy /> Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConverterSection;