const dictionariesModel = require('../models/dictionaries.model');
const scrapWords = require('../lib/scrapWords');
const fetch = require('node-fetch');

module.exports = { 
    scrapTargets, 
    get, 
    topics, 
    dictionary,
    randomWords,
    getRandomWords
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
    const data = await getRandomWords();
    res.json(data);
}

async function getRandomWords() {
    try {
        const data = await fetchWithTimeout('https://www.aleatorios.com/random-words?dictionary=2&words=3', 1000);
        const { records } = await data.json();
        return { words: records };
    }
    catch(err) { }
    const words = await getWordsFromModel();
    return { words };
}

function fetchWithTimeout(url, timeout = 2000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('timeout')), timeout)
        })
    ])
}

async function getWordsFromModel() {
    const data = await dictionariesModel.aggregate([{ $sample: { size: 1 }}]);
    const randomWords = getThreeWords(data[0].words);
    return randomWords;
}

function getThreeWords(words, many = 3) {
    const arr = [];
    while (many-- != 0) {
        arr.push(words[parseInt(Math.random() * words.length)]);
    }
    return arr;
} 