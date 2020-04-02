module.exports = (io) => {

    const game = new Game();

    io.on('connect', (socket) => {

        socket.on('join', (user) => {
            console.log('user joined ', user.name);
            game.addUser(user);
            console.log(game.users);
        });

        socket.on('guessWord', ({ user, word }) => {
            game.guessWord(user.name, word);
        });

        socket.on('disconnect', () => {
            console.log('User has been disconnected!');
        });

    });

}

class Game {

    constructor() {
        this.word = 'rueda';
        this.winner = null;
        this.users = new Map();
    }

    addUser = (user) => this.users.set(user.name, user);

    guessWord = (name, word) => {
        const user = this.users.get(name);
        this.winner = (word === this.word) ? user : null;
        console.log((this.winner) ? `The winner is ${this.winner.name}!` : 'No winner yet');
    }

} 