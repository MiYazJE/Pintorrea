const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DictionarySchema = new Schema({
    topic: { type: String, unique: true },
    words: Array
}, {
    timestamps: true
});

module.exports = model('Dictionary', DictionarySchema);