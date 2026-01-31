const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // New Field
    title: { type: String, default: 'Untitled Conversion' },
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Snippet', snippetSchema);