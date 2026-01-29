require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const User = require('./models/User');
const Snippet = require('./models/Snippet');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- ROUTES ---

// 1. Home Route (To test if Vercel is working)
app.get('/', (req, res) => {
    res.status(200).send('Multi-Links API is live and running.');
});

// 2. Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Snippet Routes
app.post('/api/snippets', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const snippet = new Snippet({ userId: req.user.id, title, content });
        await snippet.save();
        res.json(snippet);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/snippets', auth, async (req, res) => {
    try {
        const snippets = await Snippet.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/snippets/:id', auth, async (req, res) => {
    try {
        const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!snippet) return res.status(404).json({ message: "Snippet not found" });
        res.json({ message: "Snippet deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- EXPORT ---
// IMPORTANT: Only listen locally
if (process.env.NODE_SERVER === 'local') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// The ONLY export statement, at the very bottom
module.exports = app;