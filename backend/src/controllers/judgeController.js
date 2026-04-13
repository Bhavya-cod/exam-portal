const fs = require('fs');
const path = require('path');
const { execFile, spawn } = require('child_process');
const util = require('util');
const execFilePromise = util.promisify(execFile);

// --- EXECUTION QUEUE SYSTEM ---
// This protects your zero-cost server from crashing when 150 students submit simultaneously.
// It limits active code executions to 5 parallel processes. The rest wait safely in line.
const MAX_CONCURRENT = 5;
let currentRunning = 0;
const executionQueue = [];

const processQueue = () => {
  if (currentRunning >= MAX_CONCURRENT || executionQueue.length === 0) return;
  
  const task = executionQueue.shift();
  currentRunning++;
  
  task().finally(() => {
    currentRunning--;
    processQueue();
  });
};

// This wrapper intercepts the request and queues it.
const executeCode = (req, res) => {
  executionQueue.push(async () => {
    try {
      await executeCodeLocal(req, res);
    } catch (err) {
      console.error("Queue execution error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Server error during execution" });
      }
    }
  });
  processQueue();
};

const executeCodeLocal = async (req, res) => {
  const { language, files, stdin } = req.body;
  if (!files || files.length === 0) {
    if (!res.headersSent) return res.status(400).json({ error: "No files provided" });
    return;
  }

  const code = files[0].content;
  const tempDir = path.join(__dirname, '../../.temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const runId = Date.now().toString() + Math.floor(Math.random() * 1000);
  
  const pythonPath = (process.env.PYTHON_PATH || 'python').replace(/"/g, '');
  const javacPath = (process.env.JAVAC_PATH || 'javac').replace(/"/g, '');
  const javaPath = (process.env.JAVA_PATH || 'java').replace(/"/g, '');

  console.log(`[Judge] Execution Task Started | Language: ${language} | Queue Size: ${executionQueue.length}`);

  if (language === 'python') {
    const filePath = path.join(tempDir, `main_${runId}.py`);
    fs.writeFileSync(filePath, code);
    
    try {
      const child = spawn(pythonPath, [filePath], { timeout: 10000 });
      
      // Write stdin
      if (stdin) child.stdin.write(stdin);
      child.stdin.end();
      
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (data) => { stdout += data.toString(); });
      child.stderr.on('data', (data) => { stderr += data.toString(); });
      
      await new Promise((resolve, reject) => {
        child.on('close', (exitCode) => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve();
        });
        child.on('error', (err) => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          reject(err);
        });
      });
      
      if (!res.headersSent) return res.status(200).json({ run: { stdout, stderr } });
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (!res.headersSent) return res.status(200).json({ run: { stdout: '', stderr: error.message } });
    }

  } else if (language === 'java') {
    const javaDir = path.join(tempDir, `java_${runId}`);
    fs.mkdirSync(javaDir, { recursive: true });
    const filePath = path.join(javaDir, 'Main.java');
    fs.writeFileSync(filePath, code);

    // Step 1: Compile
    try {
      await execFilePromise(javacPath, [filePath], { timeout: 10000 });
    } catch (compileError) {
      fs.rmSync(javaDir, { recursive: true, force: true });
      if (!res.headersSent) return res.status(200).json({ compile: { code: 1, stderr: compileError.stderr || compileError.message } });
      return;
    }

    // Step 2: Run
    try {
      const child = spawn(javaPath, ['-cp', javaDir, 'Main'], { timeout: 10000 });
      
      // Write stdin
      if (stdin) child.stdin.write(stdin);
      child.stdin.end();
      
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (data) => { stdout += data.toString(); });
      child.stderr.on('data', (data) => { stderr += data.toString(); });
      
      await new Promise((resolve, reject) => {
        child.on('close', (exitCode) => resolve());
        child.on('error', (err) => reject(err));
      });
      
      fs.rmSync(javaDir, { recursive: true, force: true });
      if (!res.headersSent) return res.status(200).json({ compile: { code: 0 }, run: { stdout, stderr } });
    } catch (runError) {
      fs.rmSync(javaDir, { recursive: true, force: true });
      if (!res.headersSent) return res.status(200).json({ compile: { code: 0 }, run: { stdout: '', stderr: runError.message } });
    }
  } else {
    if (!res.headersSent) return res.status(400).json({ error: "Unsupported language" });
  }
};

module.exports = { executeCode };
