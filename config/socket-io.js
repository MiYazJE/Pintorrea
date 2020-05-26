const words     = ['patata', 'rueda', 'raton', 'casa'];
const game      = require('../lib/pintorrea'); 
const listUsers = new Map();
const rooms     = new Map();
const nameRooms = ['room1', 'room2', 'room3'];

const getInitialRoomState = room => ({
    game: game(words),
    players: 0,
    max: 5,
    name: room,
    started: false
});

const MIN_PLAYERS_TO_START = 2;

(function initRooms() {
    nameRooms.forEach(room => {
        rooms.set(room, getInitialRoomState(room));
    });
})();

module.exports = (io) => {

    io.on('connect', (socket) => {

        socket.on('requestRooms', () => {
            socket.emit('rooms', { rooms: Array.from(rooms.values()) });
        });

        socket.on('joinRoom', ({ user, roomName }) => {
            listUsers.set(socket.id, { name: user.name, roomName });
            socket.join(roomName);
            console.log(user.name + ' se ha conectado!');

            const room = rooms.get(roomName);
            room.game.addUser(user);
            room.players++;
            if (!room.started && room.players == MIN_PLAYERS_TO_START) {
                room.started = true;
                room.game.startGame();
                console.log(`room ${roomName} is starting...`);
                const drawer = room.game.getDrawer();
                console.log(drawer)
                io.to(roomName).emit('startGame', { drawer });
            }
            rooms.set(roomName, room);

            io.to(roomName).emit('message', { admin: true, msg: `${user.name} se ha unido.` });

            // Comunicate to everyone that user just joins to a room
            io.emit('rooms', { rooms: Array.from(rooms.values()) });
        });

        socket.on('sendMessage', ({ user, msg, room }) => {
            io.to(room).emit('message', { name: user.name, msg });
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            console.log(drawer, room)
            io.to(room).emit('draw', { drawer, coordinates });
        });

        socket.on('disconnect', () => {
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            const currentRoom = rooms.get(user.roomName);
            currentRoom.players--;
            currentRoom.game.deleteUser(user.name);
            rooms.set(user.roomName, currentRoom);
            io.to(user.room).emit('message', { admin: true, msg: `${user.name} se ha desconectado` });
            // console.log(rooms.values());
        });

    });

}