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
        guessWord,
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
        user.puntuation = 0;
        users.set(user.name, user);
    }

    function deleteUser(name) {
        users.delete(name);
        nextDrawers = nextDrawers.filter(drawer => drawer !== name);
    }

    function guessWord(name, word) {
        console.log(`${name} is guessing the word ${actualWord}, ${word}`);
        const user = users.get(name);
        winner = (word === actualWord) ? user : null;
        console.log((winner) ? `The winner is ${winner.name}!` : 'No winner yet');
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
        user.puntuation += points;
        users.set(name, user);
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