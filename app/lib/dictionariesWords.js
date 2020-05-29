const cheerio = require('cheerio');
const request = require('request-promise');

const URL_SPANISH_BASIC = 'https://es.wiktionary.org/wiki/Ap%C3%A9ndice:1000_palabras_b%C3%A1sicas_en_espa%C3%B1ol';

module.exports = { scrapWords };

async function scrapWords() {
    const $ = await request({ uri: URL_SPANISH_BASIC, transform });
    const words = [];
    $('.mw-parser-output ul li a').each((index, el) => {
        const word = $(el).text();
        if (notNumber(word[0])) {
            words.push(word);
        }
    });
    return words;
}

const transform = body => cheerio.load(body);

function notNumber(char) {
    const value = char.charCodeAt(0);
    return value < 48 || value > 57;
} 