module.exports = function pintorrea(words) {

    // Constructor
    const TEMP_WORDS   = words;
    const TOTAL_ROUNDS = 3;
    let started        = false;
    let currentRound   = 1;
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
        getMaxRound     : ()     => TOTAL_ROUNDS,
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

    function getRandomWords() {
        const randomWords = [];
        for (let i = 0; i < 3; i++) {
            let index = parseInt(Math.random() * words.length);
            randomWords.push(words[index]);
            words.splice(index, 1);
        }
        return randomWords;
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

    function addPointsToDrawer(time) {
        const pointsAdd = parseInt(time / playersRound.size);
        playersRound.set(drawer, {
            puntuation: pointsAdd 
        });
    }
 
    function restart() {
        words          = [...TEMP_WORDS]; 
        nextDrawers    = [];
        actualWord     = null;
        encryptedWord  = [];
        winner         = null;
        drawer         = null
        started        = false;
        currentRound   = 1;
        playersRound.clear();
        players.clear();
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
        const sortDesc = (a, b) => b.puntuationRound - a.puntuationRound;
        return roundPuntuation.sort(sortDesc);
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
        return true
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

}