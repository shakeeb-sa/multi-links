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

// --- 1. Middleware ---
app.use(express.json());
app.use(cors());

// --- 2. MongoDB Connection (Optimized for Vercel) ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in environment variables.");
}

// Connection options to handle serverless timeouts
const connectionOptions = {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout for finding a server
    socketTimeoutMS: 45000,         // Close sockets after 45 seconds
    family: 4                       // Force IPv4 (helps with some network configurations)
};

mongoose.connect(MONGO_URI, connectionOptions)
    .then(() => console.log("MongoDB Connected successfully"))
    .catch(err => {
        console.error("MongoDB Connection Error Details:");
        console.error("Message:", err.message);
        console.error("Reason:", err.reason ? JSON.stringify(err.reason) : 'No specific reason provided');
    });

// --- 3. ROUTES ---

// Health Check / Root Route
app.get('/', (req, res) => {
    res.status(200).send(`
        <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1 style="color: #e62b1e;">Multi-Links API V2</h1>
            <p>Status: <span style="color: green;">Online</span></p>
            <p>Environment: ${process.env.NODE_SERVER === 'local' ? 'Local' : 'Production'}</p>
        </div>
    `);
});

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) { 
        console.error("Reg Error:", err);
        res.status(500).json({ error: "Server error during registration", details: err.message }); 
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error during login", details: err.message });
    }
});

// --- PROJECT (FOLDER) ROUTES ---

app.post('/api/projects', auth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Folder name is required" });
        const project = new Project({ name, userId: req.user.id });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: "Failed to create folder" });
    }
});

app.get('/api/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch folders" });
    }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
    try {
        await Snippet.deleteMany({ projectId: req.params.id, userId: req.user.id });
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ message: "Folder not found" });
        res.json({ message: "Folder and all its contents deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete folder" });
    }
});

// --- SNIPPET ROUTES ---

app.get('/api/snippets', auth, async (req, res) => {
    try {
        const filter = { userId: req.user.id };
        if (req.query.projectId) {
            filter.projectId = req.query.projectId;
        }
        const snippets = await Snippet.find(filter).populate('projectId').sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) { 
        res.status(500).json({ error: "Failed to fetch snippets" }); 
    }
});

app.get('/api/snippets/search', auth, async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);
        const snippets = await Snippet.find({
            userId: req.user.id,
            title: { $regex: query, $options: 'i' }
        }).populate('projectId', 'name');
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

app.post('/api/snippets', auth, async (req, res) => {
    try {
        const { title, content, projectId } = req.body;
        if (!projectId) return res.status(400).json({ message: "A folder must be selected" });
        const snippet = new Snippet({ userId: req.user.id, projectId, title, content });
        await snippet.save();
        res.json(snippet);
    } catch (err) { 
        res.status(500).json({ error: "Failed to save snippet" }); 
    }
});

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

if (process.env.NODE_SERVER === 'local') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`>>> Server running locally on port ${PORT}`));
}

module.exports = app;