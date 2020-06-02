const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const MAX_SECONDS_ROUND = 65;
const TIME_TO_REVEAL_LETTER = 35;

const INITIAL_ROOM_STATE = (topic) => ({
    players: 0,
    max: 7,
    name: topic,
    started: false,
    gameLoop: null,
    time: 0,
});

module.exports = roomsCtrl();

async function roomsCtrl() {
    const rooms = new Map();
    let topicRooms = await getRoomsTopics();
    await initRooms();

    return {
        getRoomsMapped,
        deleteUser,
        isTheActualDrawer,
        initGameLoop,
        addPoints,
        startRound,
        restartGame,
        guessWord,
        getRoom: (name) => rooms.get(name),
        getRooms: () => rooms.values(),
        set: (name, room) => rooms.set(name, room),
    };

    async function getRoomsTopics() {
        return (await dictionariesModel.find({})).map(({ topic }) => topic);
    }

    async function initRooms() {
        for (let topic of topicRooms) {
            rooms.set(topic, await getInitialRoomState(topic));
        }
    }

    async function getInitialRoomState(topic) {
        return {
            game: game(await getWords(topic)),
            ...INITIAL_ROOM_STATE(topic),
        };
    }

    function restartAndGetRoom(roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        room.game.restart();
        return {
            game: room.game,
            ...INITIAL_ROOM_STATE(roomName),
        };
    }

    async function getWords(roomName) {
        return (await dictionariesModel.findOne({ topic: roomName })).words;
    }

    function getRoomsMapped() {
        return [...rooms.values()].map(
            ({ name, max, players, started, game }) => ({
                name,
                max,
                players,
                started,
                users: game.getUsers(),
            }),
        );
    }

    function deleteUser(user) {
        let currentRoom = rooms.get(user.roomName);
        currentRoom.players--;
        currentRoom.game.deleteUser(user.name);
        if (currentRoom.players === 0) {
            currentRoom = restartAndGetRoom(user.roomName);
        }
        rooms.set(user.roomName, currentRoom);
    }

    function isTheActualDrawer(user) {
        return rooms.get(user.roomName).game.getDrawer() === user.name;
    }

    function startRound(io, roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        room.game.setStarted(true);
        const drawer = room.game.chooseDrawer();
        console.log('El dibujante es', drawer);
        const words = room.game.getRandomWords();
        // console.log(words)
        io.to(roomName).emit('gameStatus', { users: room.game.getUsers() });
        io.to(roomName).emit('chooseDrawer', { drawer, words });
        io.to(roomName).emit('message', {
            admin: true,
            msg: `El dibujante es '${drawer}'`,
        });
    }

    function guessWord(io, socket, { user, room, guess }) {
        const currentRoom = rooms.get(room);
        const game = currentRoom.game;
        if (
            game.isStarted() &&
            !game.userGuessed(user.name) &&
            !game.isDrawer(user.name) &&
            game.validUser(user.name) &&
            game.isActualWord(guess)
        ) {
            addPoints(user.name, currentRoom);
            io.to(room).emit('gameStatus', { users: game.getUsers() });
            socket.emit('setGuessed', {});
            io.to(room).emit('message', {
                admin: true,
                msg: `${user.name} ha acertado la palabra!`,
            });
            if (game.everyBodyGuessed()) {
                clearInterval(currentRoom.gameLoop);
                restartGame(io, room);
            }
        } else {
            io.to(room).emit('message', {
                name: user.name,
                msg: guess,
                privateMsg: game.privateMsg(user.name),
            });
        }
    }

    function addPoints(name, room) {
        room.game.addPointsToUser(name, room.time);
        room.game.addPointsToDrawer(room.time);
        if (room.time >= 29) room.time -= 10;
    }

    function initGameLoop(io, roomName) {
        const room = rooms.get(roomName);
        room.time = MAX_SECONDS_ROUND;
        let previousTime = MAX_SECONDS_ROUND;
        let interval = setInterval(() => {
            if (room.time == 0) {
                restartGame(io, roomName);
                clearInterval(interval);
            }
            io.to(roomName).emit('progress', {
                time: room.time,
                encryptedWord: room.game.getEncryptedWord(),
            });
            room.time--;
            if (previousTime - room.time === TIME_TO_REVEAL_LETTER) {
                room.game.revealLetter();
                previousTime = room.time;
            }
        }, 1000);
        room.gameLoop = interval;
    }

    function restartGame(io, roomName) {
        const room = rooms.get(roomName);
        room.game.setStarted(false);
        io.to(roomName).emit('message', {
            admin: true,
            msg: 'La ronda ha terminado!',
        });
        io.to(roomName).emit('puntuationTable', {
            users: room.game.getRoundPuntuation(),
        });
        setTimeout(() => {
            startRound(io, roomName);
        }, 8000);
    }
}
