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
        encryptWord,
        getRoundPuntuation,
        privateMsg,
        getUsers,
        userGuessed     : (name) => users.get(name).guessed,
        validUser       : (name) => usersRound.has(name),
        isActualWord    : (word) => word === actualWord,
        isDrawer        : (name) => drawer === name,
        setStarted      : status => started = status,
        isStarted       : ()     => started,
        getEncryptedWord: ()     => encryptedWord.join(''),
        getActualWord   : ()     => actualWord,
        setActualWord   : (word) => actualWord = word,
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
            rounds++;
            nextDrawers = Array.from(users.values());
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
        encryptedWord  = null;
        winner         = null;
        drawer         = null
        started        = false;
        rounds         = 0;
        usersRound.clear();
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
        for (const [name, { puntuation }] of usersRound) {
            roundPuntuation.push({ name, puntuationRound: puntuation });
        }
        const sortDesc = (a, b) => a.puntuation - b.puntuation;
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

}