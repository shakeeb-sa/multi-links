const mongoose = require('mongoose');
const snippetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Conversion' },
    content: { type: String, required: true }, // The raw HTML
}, { timestamps: true });
module.exports = mongoose.model('Snippet', snippetSchema);