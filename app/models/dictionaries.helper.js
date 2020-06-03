const dictionariesModel = require('./dictionaries.model');

module.exports = { randomWords };

async function randomWords() {
    const data = await dictionariesModel.aggregate([{ $sample: { size: 1 }}]);
    const randomWords = getRandomWords(data[0].words);
    return randomWords;
}


function getRandomWords(words, many = 3) {
    const arr = [];
    while (many-- != 0) {
        arr.push(words[parseInt(Math.random() * words.length)]);
    }
    return arr;
}