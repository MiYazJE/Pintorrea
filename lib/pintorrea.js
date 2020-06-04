const dictionariesHelper = require('../app/models/dictionaries.helper');

module.exports = function pintorrea(totalMaxRounds) {

    // Constructor
    let started        = false;
    let currentRound   = 1;
    let nextRound      = false;
    let actualWord     = null;
    let winner         = null;
    let drawer         = null;
    let encryptedWord  = [];
    let nextDrawers    = [];
    const playersRound = new Map();
    const players      = new Map();

    return {
        getRandomWords,
        addPlayer,
        deletePlayer,
        restart,
        chooseDrawer,
        addPointsToUser,
        addPointsToDrawer,
        getRoundPuntuation,
        privateMsg,
        getUsers,
        everyBodyGuessed,
        revealLetter,
        initStartDrawing,
        correctAnswer,
        isTheEnd,
        getFinalPuntuation,
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
        console.log('---GETTING USERS---');
        for (const [key, value] of players) {
            console.log(key, value.guessed);
        }
        return Array.from(players.values());
    }

    async function getRandomWords() {
        return await dictionariesHelper.randomWords();
    }

    function addPlayer(user) {
        nextDrawers.push(user.name);
        players.set(user.name, {
            ...user,
            puntuation: 0
        });
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
        initRound();
        const index = parseInt(Math.random() * nextDrawers.length);
        drawer      = nextDrawers[index];
        nextDrawers.splice(index, 1);
        return drawer;
    }

    function initRound() {
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
 
    function restart() {
        encryptedWord  = [];
        actualWord     = null;
        winner         = null;
        drawer         = null;
        started        = false;
        currentRound   = 1;
    }

    function initStartDrawing(word) {
        actualWord = word
        encryptWord();
    }

    function encryptWord() {
        let arr = actualWord.split('').map(char => char === ' ' ? ' ' : '_');
        console.log(arr)
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
        return user.name === drawer || user.guessed;
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

}