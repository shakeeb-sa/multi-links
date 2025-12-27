import React, { useState, useRef } from 'react';
import { FaLink, FaBroom, FaEraser, FaCopy } from 'react-icons/fa';
import { cleanContent, generateFormats, isValidURL } from '../utils/converter';

const ConverterSection = ({ id, showToast }) => {
  const [formats, setFormats] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [linkCount, setLinkCount] = useState(0);
  const editorRef = useRef(null);

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