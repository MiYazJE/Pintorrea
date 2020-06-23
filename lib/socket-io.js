const MESSAGES = require('./gameMessages');
const { roomsController } = require('./rooms.controller');

module.exports = (io) => {
    const privateRoomUsers = new Map();
    const gameRoomUsers = new Map();
    const roomsCtrl = roomsController(io);

    io.on('connect', (socket) => {
        socket.on('joinPrivateRoom', ({ user, id }) => {
            console.log(user.name, id);
            privateRoomUsers.set(socket.id, { name: user.name, roomName: id });
            socket.join(id);
            roomsCtrl.joinPrivateRoom(user, id);
        });

        socket.on('changeSettingsPrivateRoom', (data) => {
            const { newRoom } = JSON.parse(data);
            roomsCtrl.updateSettingsPrivateRoom(newRoom);
        });

        socket.on('startPrivateGame', ({ room }) => {
            io.emit(room).emit('startGame');
        });

        socket.on('joinRoom', ({ user, roomName }) => {
            console.log('join', user.name, roomName);
            gameRoomUsers.set(socket.id, { name: user.name, roomName });
            socket.join(roomName);
            console.log(user.name + ' se ha conectado!');

            roomsCtrl.addPlayer(user, roomName, socket);
        });

        socket.on('guessWord', (data) => {
            roomsCtrl.guessWord(socket, data);
        });

        socket.on('startDrawing', ({ word, room, name }) => {
            roomsCtrl.startDrawing(word, room, name);
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            io.to(room).emit('draw', { drawer, coordinates });
        });

        socket.on('clearDraw', ({ room }) => io.to(room).emit('clearCanvas'));

        socket.on('joinGlobalChat', ({ user }) => {
            console.log(user.name, 'joins to global chat');
            io.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
            io.emit('globalChat', { admin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });
        });

        socket.on('sendMessageToAll', ({ user, msg }) => {
            io.emit('globalChat', { name: user.name, msg });
        });

        socket.on('sendMessageToRoom', ({ msg, room, name }) => {
            console.log(msg, name);
            io.to(room).emit('privateRoomMessage', { msg, name });
        });

        socket.on('getGameStatus', ({ room }) => {
            io.to(room).emit('gameStatus', { users: roomsCtrl.getRoom(room).game.getUsers() });
        });

        socket.on('disconnect', () => {
            const gameRoomUser = gameRoomUsers.get(socket.id);
            if (gameRoomUser) {
                roomsCtrl.deletePlayer(gameRoomUser)
                console.log(`${gameRoomUser.name} va a eliminarse(room game)`);
            }

            const privateGameUser = privateRoomUsers.get(socket.id);
            if (privateGameUser) {
                console.log(`${privateGameUser.name} va a eliminarse(private game)`);
                roomsCtrl.deletePlayerFromPrivateGame(privateGameUser);
            }

            gameRoomUsers.delete(socket.id);
            privateRoomUsers.delete(socket.id);
        });
    });

    return { ...roomsCtrl };
};
