const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/days', require('./routes/days'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/timeblocks', require('./routes/timeblocks'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve React build in production
const frontendBuild = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => res.sendFile(path.join(frontendBuild, 'index.html')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
