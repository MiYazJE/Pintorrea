const MESSAGES = require('./gameMessages');

module.exports = async (io) => {
    const listUsers = new Map();
    const roomsCtrl = await require('./rooms.controller');
    let globalPlayers = 0;

    io.on('connect', (socket) => {

        globalPlayers++;

        socket.on('joinRoom', ({ user, roomName }) => {
            listUsers.set(socket.id, { name: user.name, roomName });
            socket.join(roomName);
            console.log(user.name + ' se ha conectado!');

            roomsCtrl.addPlayer(io, user, roomName);
        });

        socket.on('guessWord', (data) => {
            roomsCtrl.guessWord(io, socket, data);
        });

        socket.on('startDrawing', ({ word, room, name }) => {
            const currentRoom = roomsCtrl.getRoom(room);
            currentRoom.game.initStartDrawing(word);
            roomsCtrl.initGameLoop(io, room);
            io.to(room).emit('message', { statusMsg: true, msg: MESSAGES.PLAYER_START_DRAWING(name) });
            io.to(room).emit('ready', { 
                word, 
                currentRound: currentRoom.game.getCurrentRound(),
                maxRound: currentRoom.game.getMaxRound(),
            });
        });

        socket.on('sendDraw', ({ drawer, coordinates, room }) => {
            io.to(room).emit('draw', { drawer, coordinates });
        });

        socket.on('joinGlobalChat', ({ user }) => {
            io.emit('rooms', { rooms: roomsCtrl.getRoomsMapped() });
            io.emit('globalChat', { admin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });
        });

        socket.on('sendMessageToAll', ({ user, msg }) => {
            io.emit('globalChat', { name: user.name, msg });
        });

        socket.on('getGameStatus', ({ room }) => {
            io.to(room).emit('gameStatus', { users: roomsCtrl.getRoom(room).game.getUsers() });
        });

        socket.on('disconnect', () => {
            globalPlayers--;
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            io.to(user.roomName).emit('message', { userLeft: true, msg: MESSAGES.PLAYER_DISCONNECT(user.name)});
            io.to(user.roomName).emit('gameStatus', { users: roomsCtrl.getRoom(user.roomName).game.getUsers() });
            roomsCtrl.deletePlayer(io, user);
        });

    });

}