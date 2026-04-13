import { useState, forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';

const BackendEditor = forwardRef(({ testCases, onGraded }, ref) => {
  const [language, setLanguage] = useState('71'); // 71 = Python (Judge0)
  const [code, setCode] = useState('import sys\n# Use sys.stdin.read() or input() to get test case input\nprint("Hello World!")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('console'); // console | tests | custom
  const [customInput, setCustomInput] = useState('');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  useImperativeHandle(ref, () => ({
    evaluate: handleEvaluate
  }));

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLanguage(val);
    if(val === '71') setCode('import sys\n# Example: sys.stdin.read()\nprint("Hello World!")');
    if(val === '62') setCode('import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Read input and solve\n    System.out.println("Hello World!");\n  }\n}');
  };

  const executeCode = async (stdin = "") => {
    try {
      const payload = {
        language: language === '71' ? 'python' : 'java',
        version: '*',
        files: [{ name: language === '71' ? 'main.py' : 'Main.java', content: code }],
        stdin: stdin
      };

      const response = await api.post('/api/judge/execute', payload);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setActiveTab('console');
    setOutput("Executing...");
    const result = await executeCode("");
    if (!result) {
      setOutput("Error connecting to server.");
    } else {
      const { run, compile } = result;
      let finalOutput = "";
      if (compile && compile.code !== 0) finalOutput += "--- COMPILATION ERROR ---\n" + (compile.stderr || compile.output) + "\n";
      else if (run) finalOutput += run.stderr || run.stdout || "Executed successfully with no output.";
      else finalOutput += "Unknown error occurred.";
      setOutput(finalOutput);
    }
    setLoading(false);
  };

  const handleRunCustom = async () => {
    setLoading(true);
    setActiveTab('console');
    setOutput("Executing with custom input...");
    const result = await executeCode(customInput);
    if (!result) {
      setOutput("Error connecting to server.");
    } else {
      const { run, compile } = result;
      let finalOutput = "";
      if (compile && compile.code !== 0) finalOutput += "--- COMPILATION ERROR ---\n" + (compile.stderr || compile.output) + "\n";
      else if (run) finalOutput += run.stderr || run.stdout || "Executed successfully with no output.";
      setOutput(finalOutput);
    }
    setLoading(false);
  };

  const handleEvaluate = async () => {
    if (!testCases || testCases.length === 0) return;
    setLoading(true);
    setTestResults([]);
    setActiveTab('tests');
    let passedCount = 0;
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const result = await executeCode(tc.input);
        if (result && result.run) {
          const actual = (result.run.stdout || "").trim();
          const expected = tc.output.trim();
          const passed = actual === expected;
          if (passed) passedCount++;
          results.push({ input: tc.input, expected, actual, passed });
        } else if (result && result.compile && result.compile.code !== 0) {
          results.push({ input: tc.input, expected: tc.output, actual: "Compilation Error", passed: false });
        } else {
          results.push({ input: tc.input, expected: tc.output, actual: "Runtime Error", passed: false });
        }
    }

    setTestResults(results);
    const finalScore = Math.round((passedCount / testCases.length) * 20);
    onGraded(finalScore);
    setLoading(false);
    return finalScore;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="flex bg-slate-900 p-3 gap-4 border-b border-slate-700 items-center justify-between">
        <select 
          value={language} 
          onChange={handleLanguageChange}
          className="bg-slate-700 text-white text-sm rounded px-3 py-1.5 border border-slate-600 outline-none focus:ring-1 focus:ring-orange-500 transition-all"
        >
          <option value="71">Python 3</option>
          <option value="62">Java</option>
        </select>
        
        <div className="flex gap-2">
          <button 
            onClick={handleRun} 
            disabled={loading}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-semibold rounded border border-slate-600 transition-all text-xs uppercase tracking-wider"
          >
            Run Code
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure? This will finalize your code and permanently end the exam.")) {
                handleEvaluate();
              }
            }} 
            disabled={loading}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black rounded shadow-lg shadow-orange-600/20 transition-all text-xs uppercase tracking-wider"
          >
            {loading ? 'Submitting...' : 'Submit & Finish Exam'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="w-full md:w-2/3 border-r border-slate-700 h-full">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language === '71' ? 'python' : 'java'}
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col bg-slate-950">
          <div className="flex border-b border-slate-800 shrink-0">
            {['console', 'tests', 'custom'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-[10px] uppercase font-black tracking-widest transition-all ${
                  activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
            {activeTab === 'console' && (
              <div className="text-green-400 whitespace-pre-wrap leading-relaxed">
                {output || '> Output will appear here...'}
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-4">
                {testResults.length > 0 ? (
                  testResults.map((tr, i) => (
                    <div key={i} className={`p-3 rounded-xl border transition-all ${tr.passed ? 'border-green-800/40 bg-green-900/10' : 'border-red-800/40 bg-red-900/10'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className={`font-bold ${tr.passed ? 'text-green-400' : 'text-red-400'}`}>Test Case {i+1}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${tr.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {tr.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="space-y-1.5 opacity-80">
                        <p className="text-slate-500"><span className="text-slate-400">Input:</span> {tr.input}</p>
                        <p className="text-slate-500"><span className="text-slate-400">Expected:</span> {tr.expected}</p>
                        <p className="text-slate-500"><span className="text-slate-400">Got:</span> <span className={tr.passed ? 'text-green-500/70' : 'text-red-500/70'}>{tr.actual}</span></p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 italic">
                    {testCases && testCases.length > 0 ? 'Click "Test All Cases" to verify code.' : 'No test cases available for this challenge.'}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="h-full flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                  <label className="text-slate-500 mb-2 uppercase tracking-tighter font-bold">Standard Input (stdin)</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Type your input here..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>
                <button
                  onClick={handleRunCustom}
                  disabled={loading}
                  className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest"
                >
                  Run with Custom Input
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});


export default BackendEditor;
