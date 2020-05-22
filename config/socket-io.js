const words = ['patata', 'rueda', 'raton', 'casa'];
const pintorrea = require('../lib/pintorrea')(words);
const listUsers = new Map();

const rooms     = new Map();
const nameRooms = ['room1', 'room2', 'room3fr4g45t3', 'room4f43g45', 'room4f4g4', 'room4f445t', 'room4f445te', 'room4543tgrt', 'room4r3t45', 'room4543', 'room4fre', 'room4f3t34', 'room4543534', 'roomfreger', 'room54343', 'room4freg', 'room543543', 'room54354353', 'room543543', 'room434543', 'room43'];
(function initRooms() {
    nameRooms.forEach(room => {
        rooms.set(room, {
            players: 0,
            name: room,
            max: 5
        });
    });
})();

module.exports = (io) => {

    io.on('connect', (socket) => {

        socket.on('requestRooms', () => {
            socket.emit('rooms', { rooms: Array.from(rooms.values()) });
        });

        socket.on('join', (user) => {
            pintorrea.addUser(user);
            listUsers.set(socket, user.name);
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
        
        socket.on('disconnect', () => {
            const username = listUsers.get(socket);
            console.log(`${username} se ha desconectado!`);
            io.emit('message', { admin: true, msg: `${username} se ha desconectado` });
            pintorrea.deleteUser(username);
            console.log(pintorrea.getUsers());
        });

    });

}