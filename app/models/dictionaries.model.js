const mongoose = require('mongoose');

const dictionariesSchema = mongoose.Schema({
    topic: String,
    words: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('dictionaries', dictionariesSchema);