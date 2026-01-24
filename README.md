
# Link Converter 🔗

**Link Converter** is a streamlined web application built with **React** and **Vite** designed to facilitate the rapid conversion of hyperlinks and rich text into various web-friendly formats. It serves as an essential tool for SEO specialists and content creators who need to reformat link lists for diverse platforms instantly.

## 🚀 Key Features

-   **One-Click Conversion**: Transform raw URLs or rich text into Markdown, BBCode, HTML, and Reference-style links.
    
-   **Automatic Cleaning**: Intelligent logic that strips away unnecessary styling, proprietary attributes from document editors (like Word or Google Docs), and HTML fragments.
    
-   **Real-Time Link Counter**: An integrated badge that automatically detects and counts the number of active hyperlinks within the editor.
    
-   **Live Preview Panels**: View your formatted output in real-time with dedicated "Copy to Clipboard" functionality for each format.
    
-   **Dark Mode UI**: A modern, eye-friendly interface designed for high-productivity environments.
    
-   **Privacy-First**: All text processing happens locally in your browser. No data is sent to a server, ensuring your link lists remain confidential.
    

## 🛠️ Tech Stack

-   **Frontend**: React.js 18+ for a reactive and fast user experience.
    
-   **Build Tool**: Vite, optimized for near-instant cold starts and fast HMR.
    
-   **Icons**: React Icons (FaLink, FaBroom, FaCopy) for an intuitive visual language.
    
-   **Deployment**: Ready for static hosting (GitHub Pages, Vercel, Netlify) with configured base paths.
    

## 📁 Project Structure

Plaintext

```
src/
├── components/       # UI components (Header, Footer, Converter)
├── utils/            # Core logic for cleaning and formatting text
├── App.jsx           # Main state management and layout
├── index.css         # Global styling and theme variables
└── main.jsx          # Application entry point

```

## ⚙️ Installation & Development

1.  **Clone the repository**:
    
    Bash
    
    ```
    git clone https://github.com/your-username/link-converter.git
    cd link-converter
    
    ```
    
2.  **Install dependencies**:
    
    Bash
    
    ```
    npm install
    
    ```
    
3.  **Start the development server**:
    
    Bash
    
    ```
    npm run dev
    
    ```
    
4.  **Build for production**:
    
    Bash
    
    ```
    npm run build
    
    ```
    

## 📖 How to Use

1.  **Paste** your rich text or list of links into the input field.
    
2.  **Clean** (Optional): Use the "Clean" button to remove excess HTML junk while preserving links.
    
3.  **Select Output**: Click on the tab for your desired format (Markdown, HTML, etc.).
    
4.  **Copy**: Click the output block to copy the generated code to your clipboard.
    

----------

_Developed by [Shakeeb](https://shakeeb-sa.github.io/) to bridge the gap between content creation and web formatting._
