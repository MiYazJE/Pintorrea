module.exports = async (io) => {
    const listUsers = new Map();
    const roomsCtrl = await require('./rooms.controller');

    const MIN_PLAYERS_TO_START = 2;

    io.on('connect', (socket) => {

        socket.on('requestRooms', () => {
            socket.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
        });

        socket.on('joinRoom', ({ user, roomName }) => {
            let startGame = false;

            listUsers.set(socket.id, { name: user.name, roomName });
            socket.join(roomName);
            console.log(user.name + ' se ha conectado!');

            const room = roomsCtrl.getRoom(roomName);
            room.game.addUser(user);
            room.players++;
            if (!room.started && room.players == MIN_PLAYERS_TO_START) {
                room.started = startGame = true;
            }
            roomsCtrl.set(roomName, room);

            // Comunicate to room chat that user just joined
            io.to(roomName).emit('message', { admin: true, msg: `${user.name} se ha unido.` });

            // Comunicate to everyone that user just joined to a room
            io.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
            io.emit('globalChat', { admin: true, msg: `${user.name} se ha unido a la sala ${roomName}!` });

            if (startGame) {
                console.log(`room '${roomName}' is starting...`);
                startRound(roomName);
            }
        });

        socket.on('sendMessage', ({ user, msg, room }) => {
            io.to(room).emit('message', { name: user.name, msg });
        });

        function startRound(roomName) {
            const room = roomsCtrl.getRoom(roomName);
            const drawer = room.game.chooseDrawer();
            console.log('El dibujante es', drawer);
            const words = room.game.getRandomWords();
            console.log(words)
            io.to(roomName).emit('chooseDrawer', { drawer, words });
            io.to(roomName).emit('message', { admin: true, msg: `El dibujante es '${drawer}'` });
        }

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
            if (roomsCtrl.isTheActualDrawer(user)) {
                console.log('El actual dibujante ha salido...');
                const drawer = roomsCtrl.getRoom(user.roomName).game.chooseDrawer();
                // io.to(user.room).emit('startRound', () => )
            }
            io.to(user.roomName).emit('message', { admin: true, msg: `${user.name} se ha desconectado.` });
            io.to(user.roomName).emit('gameStatus', { users: roomsCtrl.getRoom(user.roomName).game.getUsers() });
        });

    });

}


