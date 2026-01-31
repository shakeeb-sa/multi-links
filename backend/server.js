require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const User = require('./models/User');
const Snippet = require('./models/Snippet');
const Project = require('./models/Project');

const app = express();
app.use(express.json());
app.use(cors());

// --- 2. MongoDB Connection Logic (Vercel Stable Pattern) ---
const MONGO_URI = process.env.MONGO_URI;

// Disable Mongoose buffering so we don't get "Buffering Timed Out" errors
mongoose.set('bufferCommands', false);

// Single connection instance
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        const db = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        // Do not throw error here, let the route handle it if DB is missing
    }
};

// Middleware to ensure DB is connected before any request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// --- 3. ROUTES ---

app.get('/', (req, res) => {
    res.status(200).send(`<h1>Multi-Links API V2</h1><p>Status: Online</p><p>DB Connected: ${isConnected ? 'Yes' : 'No'}</p>`);
});

app.post('/api/register', async (req, res) => {
    try {
        if (!isConnected) return res.status(503).json({ error: "Database not ready. Please try again in a few seconds." });
        
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) { 
        res.status(500).json({ error: "Registration failed", details: err.message }); 
    }
});

app.post('/api/login', async (req, res) => {
    try {
        if (!isConnected) return res.status(503).json({ error: "Database not ready. Please try again." });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

// --- Snippet & Project Routes ---
app.post('/api/projects', auth, async (req, res) => {
    try {
        const project = new Project({ name: req.body.name, userId: req.user.id });
        await project.save();
        res.json(project);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
    try {
        await Snippet.deleteMany({ projectId: req.params.id, userId: req.user.id });
        await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/snippets', auth, async (req, res) => {
    try {
        const filter = { userId: req.user.id };
        if (req.query.projectId) filter.projectId = req.query.projectId;
        const snippets = await Snippet.find(filter).populate('projectId').sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/snippets/search', auth, async (req, res) => {
    try {
        const snippets = await Snippet.find({ userId: req.user.id, title: { $regex: req.query.query, $options: 'i' } }).populate('projectId');
        res.json(snippets);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/snippets', auth, async (req, res) => {
    try {
        const { title, content, projectId } = req.body;
        const snippet = new Snippet({ userId: req.user.id, projectId, title, content });
        await snippet.save();
        res.json(snippet);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/snippets/:id', auth, async (req, res) => {
    try {
        await Snippet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 4. EXPORT ---
if (process.env.NODE_SERVER === 'local') {
    app.listen(process.env.PORT || 5000, () => console.log("Local Server Running"));
}
module.exports = app;