const cheerio = require('cheerio');
const request = require('request-promise');

const URL_SPANISH_BASIC = 'https://es.wiktionary.org/wiki/Ap%C3%A9ndice:1000_palabras_b%C3%A1sicas_en_espa%C3%B1ol';
const URL_SPANISH_NOUNS = 'https://www.ejemplos.co/sustantivos-comunes/';

const NOT_VALID_COLOR = '#ff0000';

module.exports = {
    spanishBasic: { scrap: spanishBasic, topic: 'Sala 1' },
    spanishNouns: { scrap: spanishNouns, topic: 'Sala 2' },
};

async function spanishBasic() {
    const $ = await request({ uri: URL_SPANISH_BASIC, transform });
    const words = [];
    $('.mw-parser-output ul li a').each((index, el) => {
        const word = $(el).text();
        if (notStartWithNumber(word[0])) {
            words.push(word);
        }
    });
    return words;
}

async function spanishNouns(req, res) {
    const $ = await request({ uri: URL_SPANISH_NOUNS, transform });
    const words = [];
    $('table tr td').each((index, el) => {
        if (validElement($, $(el))) {
            words.push($(el).text().split(':')[0].trim());
        }
    });
    return words;
}

const transform = (body) => cheerio.load(body);

function notStartWithNumber(char) {
    const value = char.charCodeAt(0);
    return value < 48 || value > 57;
}

function validElement($, element) {
    if ($(element).css('color') === NOT_VALID_COLOR) {
        return false;
    }
    return $(element).children().length !== 0 ? validElement($, $(element).children()[0]) : true;
}