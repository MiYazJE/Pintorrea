const MESSAGES = require('./gameMessages');
const { roomsController } = require('./rooms.controller');

module.exports = (io) => {
    const listUsers = new Map();
    const roomsCtrl = roomsController(io);

    io.on('connect', (socket) => {

        socket.on('joinPrivateRoom', ({ user, id }) => {
            console.log(user.name, id);
            listUsers.set(socket.id, { name: user.name, roomName: id });
            socket.join(id);
            roomsCtrl.joinPrivateRoom(user, id);
        });

        socket.on('changeSettingsPrivateRoom', ({ newRoom }) => {
            console.log(newRoom)
            roomsCtrl.updateSettingsPrivateRoom(io, newRoom);
        });

        socket.on('joinRoom', ({ user, roomName }) => {
            console.log('join')
            listUsers.set(socket.id, { name: user.name, roomName });
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
        
        socket.on('joinGlobalChat', ({ user }) => {
            console.log(user.name, 'joins to global chat')
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
            const user = listUsers.get(socket.id);
            if (!user) return;
            console.log(`${user.name} se ha desconectado!`);
            io.to(user.roomName).emit('message', { userLeft: true, msg: MESSAGES.PLAYER_DISCONNECT(user.name)});
            roomsCtrl.deletePlayer(user);
        });

    });

    return {
        roomsCtrl, io, listUsers
    }

}