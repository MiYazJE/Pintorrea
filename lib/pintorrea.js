module.exports = function pintorrea(words) {

    // Constructor
    const TEMP_WORDS = words;
    let actualWord   = getRandomWord();
    let winner       = null;
    let nextDrawers  = [];
    let drawers      = [];
    const users      = new Map();

    return {
        getRandomWord,
        addUser,
        deleteUser,
        guessWord,
        startGame,
        restart,
        getUsers  : () => Array.from(users.values()),
        getDrawer : () => drawer,
    }

    function getRandomWord() {
        let index = parseInt(Math.random() * words.length)
        const word = words.splice(index, 1);
        return word;
    }

    function addUser(user) {
        user.puntuation = 0;
        users.set(user.name, user);
    }

    function deleteUser(name) {
        users.delete(name);
        drawers = drawers.filter(drawer => drawer !== name);
    }

    function guessWord(name, word) {
        console.log(`${name} is guessing the word ${actualWord}, ${word}`)
        const user = users.get(name);
        winner = (word === actualWord) ? user : null;
        console.log((winner) ? `The winner is ${winner.name}!` : 'No winner yet');
    }

    function startGame() {
        nextDrawers = Array.from(users.keys());
        drawer      = nextDrawers.pop();
    }

    function restart() {
        words        = [...TEMP_WORDS]; 
        actualWord   = getRandomWord();
        winner       = null;
        nextDrawers  = [];
        drawers      = [];
        users.clear();
    }

}