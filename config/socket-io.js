const words = ['patata', 'rueda', 'raton', 'casa'];
const pintorrea = require('../lib/pintorrea')(words);

module.exports = (io) => {

    io.on('connect', (socket) => {

        socket.on('join', (user) => {
            pintorrea.addUser(user);
            console.log(user.name + ' se ha conectado...');
            console.log(pintorrea.getUsers());
            io.emit('message', { admin: true , msg: `${user.name} se ha conectado.`});
            if (pintorrea.getUsers().length == 2) {
                pintorrea.startGame();
                const drawer = pintorrea.chooseDrawer();
                io.emit('startGame', { drawer });
                console.log('starting the game...')
                console.log(`The drawer is ${drawer}.`)
            }
        });

        socket.on('sendMessage', ({user, msg}) => {
            io.emit('message', { name: user.name, msg });
        });

        socket.on('guessWord', ({ user, msg }) => {
            console.log(user.name + ' => ' + msg)
            // pintorrea.guessWord(pintorrea.name, word);
        });

        socket.on('startGame', (drawer) => {
            
        });

        socket.on('draw', ({ drawer, coordinates }) => {
            io.emit('draw', { drawer, coordinates });
        });
        
        socket.on('disconnect', (user) => {
            console.log(`${user.name} has been disconnected!`);
            pintorrea.deleteUser(user);
            console.log(pintorrea.getUsers());
        });

    });

}