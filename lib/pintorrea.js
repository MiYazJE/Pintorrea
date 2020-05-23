module.exports = function pintorrea(words) {

    // Constructor
    let actualWord = getRandomWord();
    let winner     = null;
    let drawer     = null;
    let drawers    = [];
    const users    = new Map();
    
    return {
        getRandomWord,
        addUser,
        deleteUser,
        guessWord,
        startGame,
        chooseDrawer,
        getUsers: () => Array.from(users.keys()),
        getDrawers: () => drawers,
    }

    function getRandomWord() {
        let index = parseInt(Math.random() * words.length)
        const word = words.splice(index, 1);
        return word;
    }

    function addUser(user) {
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
        drawers = Array.from(users.keys());
    }

    function chooseDrawer() {
        drawer = drawers.pop();
        return drawer;
    }

}