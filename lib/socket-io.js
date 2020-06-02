module.exports = async (io) => {
    const listUsers = new Map();
    const roomsCtrl = await require('./rooms.controller');

    const MIN_PLAYERS_TO_START = 2;

    io.on('connect', (socket) => {

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
                roomsCtrl.startRound(io, roomName);
            }
        });

        socket.on('guessWord', (data) => {
            roomsCtrl.guessWord(io, socket, data);
        });

        socket.on('startDrawing', ({ word, room, name }) => {
            const currentRoom = roomsCtrl.getRoom(room);
            currentRoom.game.initStartDrawing(word);
            roomsCtrl.initGameLoop(io, room);
            io.to(room).emit('message', { statusMsg: true, msg: `${name} va ha empezar a dibujar.` });
            io.to(room).emit('ready', { 
                word, 
                currentRound: currentRoom.game.getCurrentRound(),
                maxRound: currentRoom.game.getMaxRound(),
            });
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            // console.log(drawer, room)
            io.to(room).emit('draw', { drawer, coordinates });
        });

        socket.on('joinGlobalChat', ({ user }) => {
            io.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
            io.emit('globalChat', { admin: true, msg: `${user.name} se ha conectado.` });
        });

        socket.on('sendMessageToAll', ({ user, msg }) => {
            io.emit('globalChat', { name: user.name, msg });
        });

        socket.on('getGameStatus', ({ room }) => {
            io.to(room).emit('gameStatus', { users: roomsCtrl.getRoom(room).game.getUsers() });
        });

        socket.on('disconnect', () => {
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            roomsCtrl.deleteUser(user);
            io.to(user.roomName).emit('message', { userLeft: true, msg: `${user.name} se ha desconectado.` });
            io.to(user.roomName).emit('gameStatus', { users: roomsCtrl.getRoom(user.roomName).game.getUsers() });
            if (roomsCtrl.isTheActualDrawer(user)) {
                console.log('El actual dibujante ha salido...');
                roomsCtrl.startRound(io, user.roomName);
            }
        });

    });

}