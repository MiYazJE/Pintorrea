const dictionariesModel = require('../models/dictionaries.model');
const { scrapWords }    = require('../lib/dictionariesWords');

module.exports = { scrapSpanishBasic };

async function scrapSpanishBasic(req, res) {
    const words = await scrapWords();
    const dictionary = new dictionariesModel({
        words,
        topic: 'Palabras básicas'
    });
    await dictionary.save();
    res.json({ msg: 'Las palabras han sido guardadas!' });
}