const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const QUESTIONS_FILE = path.join(__dirname, '../../data/questions.json');

// Helper to load questions fresh from disk every time (no caching)
function loadQuestions() {
  const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  return JSON.parse(raw);
}

// @route   GET /api/questions
// @desc    Return questions WITHOUT answers (safe for student view)
router.get('/', (req, res) => {
  try {
    const data = loadQuestions();

    // Strip answers from MCQs before sending to frontend
    const safeMcqs = (data.mcqs || []).map(({ answer, ...rest }) => rest);

    // Strip testCases answers from coding questions if needed
    const safeCoding = (data.codingQs || []).map(q => q);

    res.json({ mcqs: safeMcqs, codingQs: safeCoding });
  } catch (err) {
    console.error('Failed to load questions:', err.message);
    res.status(500).json({ error: 'Could not load questions.' });
  }
});

// @route   GET /api/questions/with-answers
// @desc    Return full questions WITH answers (for server-side scoring only)
//          Protect this route — never expose to students!
router.get('/with-answers', (req, res) => {
  try {
    const data = loadQuestions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not load questions.' });
  }
});

// @route   POST /api/questions/evaluate
// @desc    Securely evaluate a stage's answers and return the score
router.post('/evaluate', (req, res) => {
  try {
    const { stage, answers } = req.body;
    const data = loadQuestions();
    
    let score = 0;
    const stageQuestions = (data.mcqs || []).filter(q => q.stage === String(stage));
    
    stageQuestions.forEach(q => {
      if (answers[q.id] === q.answer) {
        score += 1;
      }
    });

    res.json({ score });
  } catch (err) {
    console.error('Failed to evaluate answers:', err.message);
    res.status(500).json({ error: 'Could not evaluate answers.' });
  }
});

module.exports = router;
