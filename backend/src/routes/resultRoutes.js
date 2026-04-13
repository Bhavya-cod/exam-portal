const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase');

// In-memory fallback if Firebase is not connected
let mockDatabase = [];

// @route   POST /api/results
// @desc    Submit exam results
router.post('/', async (req, res) => {
    try {
        const { name, email, pin, branch, stage1Score, stage2Score, codingScore, proctorWarnings, totalScore, passed } = req.body;
        
        const resultData = {
            name,
            email,
            pin,
            branch,
            stage1Score,
            stage2Score,
            codingScore,
            totalScore,
            proctorWarnings,
            passed,
            timestamp: new Date().toISOString()
        };

        if (!firebase.mock) {
            await firebase.db.collection('exam_results').add(resultData);
            console.log(`Result saved to Firestore for: ${name}`);
        } else {
            mockDatabase.push(resultData);
            console.log(`Result saved to MOCK STORAGE for: ${name}`);
        }

        res.status(201).json({ success: true, message: 'Result submitted successfully!' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit results.' });
    }
});

// @route   GET /api/results
// @desc    Get all exam results
router.get('/', async (req, res) => {
    try {
        if (!firebase.mock) {
            const snapshot = await firebase.db.collection('exam_results').orderBy('timestamp', 'desc').get();
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.json(results);
        } else {
            return res.json([...mockDatabase].reverse());
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch results.' });
    }
});

module.exports = router;
