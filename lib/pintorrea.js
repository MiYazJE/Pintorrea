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
    const usersRound   = new Map();
    const users        = new Map();

    return {
        getRandomWords,
        addUser,
        deleteUser,
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
        getMaxRound     : ()     => TOTAL_ROUNDS,
        getCurrentRound : ()     => currentRound,
        userGuessed     : (name) => users.get(name).guessed,
        validUser       : (name) => usersRound.has(name),
        isActualWord    : (word) => word === actualWord,
        isDrawer        : (name) => drawer === name,
        setStarted      : status => started = status,
        isStarted       : ()     => started,
        getEncryptedWord: ()     => encryptedWord.join(''),
        getActualWord   : ()     => actualWord,
        getDrawer       : ()     => drawer,
    }

    function getUsers() {
        console.log('---GETTING USERS---');
        for (const [key, value] of users) {
            console.log(key, value.guessed);
        }
        return Array.from(users.values());
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

    function addUser(user) {
        nextDrawers.push(user.name);
        users.set(user.name, {
            ...user,
            puntuation: 0
        });
    }

    function deleteUser(name) {
        users.delete(name);
        usersRound.delete(name);
        nextDrawers = nextDrawers.filter(drawer => drawer !== name);
    }

    function chooseDrawer() {
        if (nextDrawers.length === 0) {
            currentRound++;
            nextDrawers = [...users.keys()];
        }
        initRound();
        const index = parseInt(Math.random() * nextDrawers.length);
        drawer      = nextDrawers[index];
        nextDrawers.splice(index, 1);
        return drawer;
    }

    function initRound() {
        for (const [key, value] of users) {
            usersRound.set(key, { puntuation: 0 });
            users.set(key, { ...users.get(key), guessed: false });
        }
    }

    function addPointsToUser(name, puntuation) {
        const user = users.get(name);
        usersRound.set(name, { puntuation });
        users.set(name, { ...user, guessed: true });
    }

    function addPointsToDrawer(time) {
        const pointsAdd = parseInt(time / usersRound.size);
        usersRound.set(drawer, {
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
        currentRound   = 0;
        usersRound.clear();
        users.clear();
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
        addRoundPointsToEachUser();
        const roundPuntuation = [];
        for (const [name, { puntuation }] of usersRound) {
            roundPuntuation.push({ name, puntuationRound: puntuation });
        }
        const sortDesc = (a, b) => b.puntuationRound - a.puntuationRound;
        return roundPuntuation.sort(sortDesc);
    }

    function addRoundPointsToEachUser() {
        for (const [name, { puntuation }] of usersRound) {
            const user = users.get(name);
            users.set(name, {
                ...user,
               puntuation: user.puntuation + puntuation 
            });
        }
    }

    function privateMsg(name) {
        const user = users.get(name);
        return user.name === drawer || user.guessed;
    }

    function everyBodyGuessed() {
        for (const [key, value] of users) {
            if (usersRound.has(key)) {
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

}