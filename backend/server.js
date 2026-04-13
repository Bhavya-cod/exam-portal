const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// In production, only allow requests from your deployed frontend URL.
// In development, allow all origins.
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin
}));

app.use(express.json());

app.use('/api/judge', require('./src/routes/judgeRoutes'));
app.use('/api/results', require('./src/routes/resultRoutes'));
app.use('/api/questions', require('./src/routes/questionRoutes'));

const PORT = process.env.PORT || 5000;

// Serve frontend static files in production
const path = require('path');
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all route to serve the React app
app.use((req, res, next) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
