const words     = ['patata', 'rueda', 'raton', 'casa'];
const pintorrea = require('../lib/pintorrea')(words);
const listUsers = new Map();
const rooms     = new Map();
const nameRooms = ['room1', 'room2', 'room3'];
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
            io.emit('rooms', { rooms: Array.from(rooms.values()) });
        });

        socket.on('joinRoom', ({ user, room }) => {
            listUsers.set(socket.id, { name: user.name, room });
            socket.join(room);
            console.log(user.name + ' se ha conectado!');
            const currentRoom = rooms.get(room);
            currentRoom.players++;
            rooms.set(room, currentRoom);
            io.to(room).emit('message', { admin: true , msg: `${user.name} se ha unido a tu sala.`});
            io.emit('rooms', { rooms: Array.from(rooms.values()) });
        });

        socket.on('sendMessage', ({ user, msg, room }) => {
            io.to(room).emit('message', { name: user.name, msg });
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            console.log(room)
            io.sockets.in(room).emit('draw', { drawer, coordinates });
        });
        
        socket.on('disconnect', () => {
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            const currentRoom = rooms.get(user.room);
            currentRoom.players--;
            rooms.set(user.room, currentRoom);
            io.to(user.room).emit('message', { admin: true, msg: `${user.name} se ha desconectado` });
            console.log(rooms.values());
            // pintorrea.deleteUser(user.name);
        });

    });

}