const dictionariesModel = require('../models/dictionaries.model');
const { scrapWords } = require('../lib/dictionariesWords');

module.exports = { scrapSpanishBasic, topics };

async function scrapSpanishBasic(req, res) {
    const dic = await dictionariesModel.findOne({ topic: 'Palabras básicas' });
    if (dic) {
        res.status(401).json({ msg: 'Ya existe un diccionario con ese nombre!' });
        return;
    }
    const words = await scrapWords();
    const dictionary = new dictionariesModel({
        words,
        topic: 'Palabras básicas'
    });
    await dictionary.save();
    res.json({ msg: 'Las palabras han sido guardadas!' });
}

async function topics(req, res) {
    const dictionaries = await dictionariesModel.find({});
    const topics = dictionaries.map(({ topic }) => topic);
    res.json({ topics });
}