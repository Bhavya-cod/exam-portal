import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function FrontendEditor() {
  const [html, setHtml] = useState('<h1>Hello World</h1>');
  const [css, setCss] = useState('h1 { color: #3b82f6; font-family: sans-serif; text-align: center; margin-top: 2rem; }');
  const [js, setJs] = useState('console.log("Welcome to Exam Portal");');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  const runCode = () => {
    setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>
          try {
            ${js}
          } catch(err) {
            console.error(err);
          }
        </script>
      </html>
    `);
  };

  useEffect(() => {
    runCode();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="flex bg-slate-900 p-3 gap-2 border-b border-slate-700 items-center justify-between">
        <div className="flex space-x-2">
            <button onClick={() => setActiveTab('html')} className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'html' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>HTML</button>
            <button onClick={() => setActiveTab('css')} className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'css' ? 'bg-slate-700 text-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>CSS</button>
            <button onClick={() => setActiveTab('js')} className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'js' ? 'bg-slate-700 text-yellow-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>JS</button>
        </div>
        <button onClick={runCode} className="px-5 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow transition-colors text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Run Code
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Editor pane */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-700 bg-[#1e1e1e] h-full">
            {activeTab === 'html' && (
                <Editor height="100%" width="100%" theme="vs-dark" language="html" value={html} onChange={setHtml} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }} />
            )}
            {activeTab === 'css' && (
                <Editor height="100%" width="100%" theme="vs-dark" language="css" value={css} onChange={setCss} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }} />
            )}
            {activeTab === 'js' && (
                <Editor height="100%" width="100%" theme="vs-dark" language="javascript" value={js} onChange={setJs} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }} />
            )}
        </div>
        
        {/* Output pane */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          <div className="bg-slate-100 text-slate-500 border-b border-slate-200 text-xs py-2 px-4 uppercase font-bold tracking-wider">Live Frame</div>
          <iframe 
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            className="flex-1 w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
