module.exports = async (io) => {
    const listUsers = new Map();
    const roomsCtrl = await require('./rooms.controller');

    const MIN_PLAYERS_TO_START = 2;

    io.on('connect', (socket) => {

        socket.on('requestRooms', () => {
            socket.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
        });

        socket.on('joinRoom', ({ user, roomName }) => {
            listUsers.set(socket.id, { name: user.name, roomName });
            socket.join(roomName);
            console.log(user.name + ' se ha conectado!');

            const room = roomsCtrl.getRoom(roomName);
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
            roomsCtrl.set(roomName, room);

            io.to(roomName).emit('message', { admin: true, msg: `${user.name} se ha unido.` });

            // Comunicate to everyone that user just joined to a room
            io.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
            io.emit('globalChat', { admin: true, msg: `${user.name} se ha unido a la sala ${roomName}!` });
        });

        socket.on('sendMessage', ({ user, msg, room }) => {
            io.to(room).emit('message', { name: user.name, msg });
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            console.log(drawer, room)
            io.to(room).emit('draw', { drawer, coordinates });
        });

        socket.on('sendMessageToAll', ({ admin, user, msg }) => {
            if (admin) {
                io.emit('globalChat', { admin: true, msg: `${user.name} se ha unido!` });
            }
            else {
                io.emit('globalChat', { name: user.name, msg });
            }
        })

        socket.on('getGameStatus', ({ room }) => {
            io.to(room).emit('gameStatus', { users: roomsCtrl.getRoom(room).game.getUsers() });
        });

        socket.on('disconnect', () => {
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            roomsCtrl.deleteUser(user);
            io.to(user.room).emit('message', { admin: true, msg: `${user.name} se ha desconectado` });
            io.to(user.roomName).emit('gameStatus', { users: roomsCtrl.getRoom(user.roomName).game.getUsers() });
        });

    });

}


