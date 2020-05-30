module.exports = function pintorrea(words) {

    // Constructor
    const TEMP_WORDS   = words;
    const TOTAL_ROUNDS = 3;
    let actualWord     = null;
    let winner         = null;
    let drawer         = null;
    let nextDrawers    = [];
    let rounds         = 0;
    const users        = new Map();

    return {
        getRandomWords,
        addUser,
        deleteUser,
        restart,
        chooseDrawer,
        addPointsToUser,
        getActualWord : ()   => actualWord,
        setActualWord : word => actualWord = word,
        getUsers      : ()   => Array.from(users.values()),
        getDrawer     : ()   => drawer,
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
            puntuation: 0,
            guessed: false
        });
    }

    function deleteUser(name) {
        users.delete(name);
        nextDrawers = nextDrawers.filter(drawer => drawer !== name);
    }

    function chooseDrawer() {
        if (nextDrawers.length === 0) {
            rounds++;
            nextDrawers = Array.from(users.values());
        }
        const index = parseInt(Math.random() * nextDrawers.length);
        drawer      = nextDrawers[index];
        nextDrawers.splice(index, 1);
        return drawer;
    }

    function addPointsToUser(name, points) {
        const user = users.get(name);
        users.set(name, {
            ...user,
            puntuation: user.puntuation + points,
            guessed: true,
        });
    }

    function restart() {
        words        = [...TEMP_WORDS]; 
        actualWord   = null;
        winner       = null;
        drawer       = null
        nextDrawers  = [];
        rounds       = 0;
        users.clear();
    }

}