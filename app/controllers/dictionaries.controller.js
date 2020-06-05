const dictionariesModel = require('../models/dictionaries.model');
const scrapWords = require('../lib/scrapWords');
const fetch = require('node-fetch');

module.exports = { 
    scrapTargets, 
    get, 
    topics, 
    dictionary,
    randomWords
};

async function scrapTargets(req, res) {
    await launchScrap(scrapWords.spanishBasic);
    await launchScrap(scrapWords.spanishNouns);
    res.json({ msg: `Las palabras han sido guardadas.` });
}

async function launchScrap({ topic, scrap }) {
    if (await dictionaryExists(topic)) {
        await deleteDictionary(topic);
        console.log('DELETING', topic);
    }
    const words = await scrap();
    console.log(`INSERTING ${words.length} NEW WORDS(${topic})!`)
    const dictionary = new dictionariesModel({
        words, topic
    });
    await dictionary.save();
}

async function dictionaryExists(topic) {
    return await dictionariesModel.findOne({ topic });
}

async function topics(req, res) {
    const dictionaries = await dictionariesModel.find({});
    const topics = dictionaries.map(({ topic }) => topic);
    res.json({ topics });
}

async function get(req, res) {
    const dictionaries = await dictionariesModel.find({});
    res.json({ dictionaries });
}

async function dictionary(req, res) {
    const { topic } = req.params;
    if (!topic) res.status(400).json({ msg: 'El campo topic esta vacío.' });
    await deleteDictionary(topic);
    res.json({ msg: `El diccionario ${topic} ha sido eliminado!` });
}

async function deleteDictionary(topic) {
    await dictionariesModel.deleteOne({ topic });
}

async function randomWords(req, res) {
    const data        = await fetch('https://www.aleatorios.com/random-kids?new=%5B0%5D&type=0&words=3');
    const { records } = await data.json();
    res.json({ words: [...removeDiacritics(records)] });
}

function removeDiacritics(words) {
    return words.map(word => word.normalize('NFD')
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
        .normalize()
        .split(',')[0]);
}