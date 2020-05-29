const mongoose = require('mongoose');

const dictionariesSchema = mongoose.Schema({
    topic: { type: String, unique: true },
    words: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('dictionaries', dictionariesSchema);