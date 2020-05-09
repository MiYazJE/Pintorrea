const words = ['patata', 'rueda', 'raton', 'casa'];
const pintorrea = require('../lib/pintorrea')(words);

module.exports = (io) => {

    io.on('connect', (socket) => {

        // socket.on('join', (user) => {
        //     console.log('user joined ', user.name);
        //     pintorrea.addUser(user);
        //     console.log(pintorrea.getUsers());
        // });

        socket.on('chat', ({ user, msg }) => {
            console.log(user.name, msg)
            io.emit('chat', { user, msg })
        });

        socket.on('guessWord', ({ user, msg }) => {
            console.log(user.name + ' => ' + msg)
            // pintorrea.guessWord(pintorrea.name, word);
        });

        socket.on('disconnect', ({ user }) => {
            console.log('User has been disconnected!');
            // pintorrea.removeUser()
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

    removeUser = ({ name }) => this.users.delete(name);

    guessWord = (name, word) => {
        const user = this.users.get(name);
        this.winner = (word === this.word) ? user : null;
        console.log((this.winner) ? `The winner is ${this.winner.name}!` : 'No winner yet');
    }

} 