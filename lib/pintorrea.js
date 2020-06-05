const dictionariesHelper = require('../app/models/dictionaries.helper');
const fetch = require('node-fetch');

const HOST = process.env.ENVIROMENT === 'PRODUCTION' 
    ? process.env.DOMAIN_PRODUCTION 
    : 'http://localhost:5000';

module.exports = function pintorrea(totalMaxRounds) {

    // Constructor
    let started        = false;
    let currentRound   = 1;
    let nextRound      = false;
    let drawer         = null;
    let encryptedWord  = [];
    let nextDrawers    = [];
    const playersRound = new Map();
    const players      = new Map();

    return {
        getRandomWords,
        addPlayer,
        deletePlayer,
        chooseDrawer,
        addPointsToUser,
        addPointsToDrawer,
        getRoundPuntuation,
        privateMsg,
        getUsers,
        everyBodyGuessed,
        revealLetter,
        getWordAndEncrypt,
        correctAnswer,
        isTheEnd,
        getFinalPuntuation,
        restart,
        addPlayerToActualRound,
        setNextRound    : status => nextRound = status, 
        isNextRound     : ()     => nextRound,
        getMaxRound     : ()     => totalMaxRounds,
        getCurrentRound : ()     => currentRound,
        userGuessed     : (name) => players.get(name).guessed,
        isDrawer        : (name) => drawer === name,
        setStarted      : status => started = status,
        isStarted       : ()     => started,
        getEncryptedWord: ()     => encryptedWord.join(''),
        getActualWord   : ()     => actualWord,
        getDrawer       : ()     => drawer,
    }

    function getUsers() {
        return Array.from(players.values());
    }

    async function getRandomWords() {
        const data = await fetch(`${HOST}/dictionary/randomWords`);
        const { words } = await data.json();
        console.log(words);
        return words; 
    }

    function addPlayer(user) {
        nextDrawers.push(user.name);
        players.set(user.name, {
            ...user,
            puntuation: 0,
        });
    }

    function addPlayerToActualRound(user) {
        players.set(user.name, { ...players.get(user.name), guessed: false });
        playersRound.set(user.name, { puntuation: 0 });
    }

    function deletePlayer(name) {
        players.delete(name);
        playersRound.delete(name);
        nextDrawers = nextDrawers.filter(drawer => drawer !== name);
    }

    function chooseDrawer() {
        if (nextDrawers.length === 0) {
            nextRound = true;
            currentRound++;
            nextDrawers = [...players.keys()];
        }
        initPlayersThisRound();
        const index = parseInt(Math.random() * nextDrawers.length);
        drawer      = nextDrawers[index];
        nextDrawers.splice(index, 1);
        return drawer;
    }

    function initPlayersThisRound() {
        for (const [key, value] of players) {
            playersRound.set(key, { puntuation: 0 });
            players.set(key, { ...players.get(key), guessed: false });
        }
    }

    function addPointsToUser(name, points) {
        const user = players.get(name);
        playersRound.set(name, { puntuation: points });
        players.set(name, { 
            ...user, 
            puntuation: user.puntuation + points, 
            guessed: true 
        });
    }

    function addPointsToDrawer(points) {
        const user = players.get(drawer);
        const pointsAdd = parseInt(points / playersRound.size);
        playersRound.set(drawer, {
            puntuation: pointsAdd 
        });
        players.set(drawer, { 
            ...user, 
            puntuation: user.puntuation + pointsAdd, 
        });
    }

    function getWordAndEncrypt(word) {
        actualWord = word
        encryptWord();
    }

    function encryptWord() {
        let arr = actualWord.split('').map(char => char === ' ' ? ' ' : '_');
        encryptedWord = [...arr];
    }

    function getRoundPuntuation() {
        const roundPuntuation = [];
        for (const [name, { puntuation }] of playersRound) {
            roundPuntuation.push({ name, puntuationRound: puntuation });
        }
        return roundPuntuation.sort((a, b) => b.puntuationRound - a.puntuationRound);
    }

    function privateMsg(name) {
        const user = players.get(name);
        return started && (user.name === drawer || user.guessed);
    }

    function everyBodyGuessed() {
        for (const [key, value] of players) {
            if (playersRound.has(key)) {
                if (!value.guessed && key !== drawer) {
                    return false;
                }
            }
        }
        return true;
    }

    function revealLetter() {
        const index = getValidIndex();
        encryptedWord[index] = actualWord[index];
    }
    
    function getValidIndex() {
        let index = parseInt(Math.random() * encryptedWord.length);
        if (encryptedWord[index] === '_') return index;
        return getValidIndex();
    }

    function correctAnswer(name, guess) {
        return started &&
            !players.get(name).guessed &&
            name !== drawer            &&
            playersRound.has(name)     &&
            guess === actualWord;
    }

    function isTheEnd() {
        return currentRound === totalMaxRounds
               && nextDrawers.length === 0;
    }

    function getFinalPuntuation() {
        const puntuation = [];
        for (const [key, value] of players) {
            puntuation.push({ ...value });
        }
        return puntuation.sort((a, b) => b.puntuation - a.puntuation);
    }

    function restart() {
        encryptedWord  = [];
        actualWord     = null;
        drawer         = null;
        started        = false;
        currentRound   = 0;
        restartPoints();
    }

    function restartPoints() {
        for (const [key, value] of players) {
            players.set(key, { ...value, puntuation: 0 });
        }
    }

}