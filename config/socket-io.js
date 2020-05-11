const words = ['patata', 'rueda', 'raton', 'casa'];
const pintorrea = require('../lib/pintorrea')(words);

module.exports = (io) => {

    io.on('connect', (socket) => {

        socket.on('join', (user) => {
            pintorrea.addUser(user);
            console.log(user.name + ' se ha conectado...');
            console.log(pintorrea.getUsers());
            io.emit('message', { admin: true , msg: `${user.name} se ha conectado.`});
        });

        socket.on('sendMessage', ({user, msg}) => {
            io.emit('message', { name: user.name, msg });
        });

        socket.on('guessWord', ({ user, msg }) => {
            console.log(user.name + ' => ' + msg)
            // pintorrea.guessWord(pintorrea.name, word);
        });

        socket.on('disconnect', (user) => {
            console.log(`${user.name} has been disconnected!`);
            pintorrea.deleteUser(user);
            console.log(pintorrea.getUsers());
        });

    });

}