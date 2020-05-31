module.exports = function pintorrea(words) {

    // Constructor
    const TEMP_WORDS   = words;
    const TOTAL_ROUNDS = 3;
    let started        = false;
    let rounds         = 0;
    let actualWord     = null;
    let winner         = null;
    let drawer         = null;
    let encryptedWord  = [];
    let nextDrawers    = [];
    let usersThisRound = [];
    const roundPoints  = new Map();
    const users        = new Map();

    return {
        getRandomWords,
        addUser,
        deleteUser,
        restart,
        chooseDrawer,
        addPointsToUser,
        addPointsToDrawer,
        encryptWord,
        getRoundPuntuation,
        privateMsg,
        validUser       : (name) => usersThisRound.includes(name),
        isActualWord    : (word) => word === actualWord,
        isDrawer        : (name) => drawer === name,
        setStarted      : status => started = status,
        isStarted       : ()     => started,
        getEncryptedWord: ()     => encryptedWord.join(''),
        getActualWord   : ()     => actualWord,
        setActualWord   : (word) => actualWord = word,
        getUsers        : ()     => Array.from(users.values()),
        getDrawer       : ()     => drawer,
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
        roundPoints.delete(name);
        nextDrawers = nextDrawers.filter(drawer => drawer !== name);
    }

    function chooseDrawer() {
        if (nextDrawers.length === 0) {
            rounds++;
            nextDrawers = Array.from(users.values());
        }
        usersThisRound = [...nextDrawers];
        initRound();
        const index = parseInt(Math.random() * nextDrawers.length);
        drawer      = nextDrawers[index];
        nextDrawers.splice(index, 1);
        return drawer;
    }

    function initRound() {
        usersThisRound.forEach(name => {
            roundPoints.set(name, { puntuation: 0 });
            users.set(name, { ...users.get(name), guessed: false });
        });
    }

    function addPointsToUser(name, puntuation) {
        const user = users.get(name);
        roundPoints.set(name, { puntuation });
        users.set(name, { ...user, guessed: true });
    }

    function addPointsToDrawer(time) {
        const pointsAdd = parseInt(time / usersThisRound.length);
        roundPoints.set(drawer, {
            puntuation: pointsAdd 
        });
    }
 
    function restart() {
        words          = [...TEMP_WORDS]; 
        nextDrawers    = [];
        usersThisRound = [];
        actualWord     = null;
        encryptedWord  = null;
        winner         = null;
        drawer         = null
        started        = false;
        rounds         = 0;
        roundPoints.clear();
        users.clear();
    }

    function encryptWord() {
        const arr = actualWord.split('').map(char => char === ' ' ? ' ' : '_');
        // let index = parseInt(Math.random() * arr.length);
        // arr[index] = actualWord[index];
        // console.log(arr);
        encryptedWord = arr;
    }

    function getRoundPuntuation() {
        addRoundPointsToEachUser();
        const roundPuntuation = [];
        for (const [name, { puntuation }] of roundPoints) {
            roundPuntuation.push({ name, puntuationRound: puntuation });
        }
        const sortDesc = (a, b) => a.puntuation - b.puntuation;
        return roundPuntuation.sort(sortDesc);
    }

    function addRoundPointsToEachUser() {
        for (const [name, { puntuation }] of roundPoints) {
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

}