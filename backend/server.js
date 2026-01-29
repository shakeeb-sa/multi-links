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

// --- 1. Middleware ---
app.use(express.json());
app.use(cors());

// --- 2. MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in environment variables.");
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- 3. ROUTES ---

// Health Check / Root Route (Prevents Vercel 404)
app.get('/', (req, res) => {
    res.status(200).send(`
        <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1 style="color: #e62b1e;">Multi-Links API</h1>
            <p>Status: <span style="color: green;">Online</span></p>
            <p>Environment: ${process.env.NODE_SERVER === 'local' ? 'Local' : 'Production'}</p>
        </div>
    `);
});

// --- AUTH ROUTES ---

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ message: "User created successfully" });
    } catch (err) { 
        res.status(500).json({ error: "Server error during registration" }); 
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { id: user._id, username: user.username } 
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// --- SNIPPET ROUTES (Protected) ---

// Get all snippets for logged in user
app.get('/api/snippets', auth, async (req, res) => {
    try {
        const snippets = await Snippet.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) { 
        res.status(500).json({ error: "Failed to fetch history" }); 
    }
});

// Save a new snippet
app.post('/api/snippets', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const snippet = new Snippet({ userId: req.user.id, title, content });
        await snippet.save();
        res.json(snippet);
    } catch (err) { 
        res.status(500).json({ error: "Failed to save snippet" }); 
    }
});

// Delete a snippet
app.delete('/api/snippets/:id', auth, async (req, res) => {
    try {
        const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!snippet) return res.status(404).json({ message: "Snippet not found" });
        res.json({ message: "Snippet deleted successfully" });
    } catch (err) { 
        res.status(500).json({ error: "Failed to delete snippet" }); 
    }
});

// --- 4. EXPORT / LISTEN ---

// Local development listener
if (process.env.NODE_SERVER === 'local') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`>>> Server running locally on port ${PORT}`));
}

// Critical for Vercel deployment
module.exports = app;