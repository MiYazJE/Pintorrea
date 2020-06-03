const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const MESSAGES = require('./gameMessages');

const MAX_SECONDS_ROUND = 65;
const TIME_TO_REVEAL_LETTER = 35;
const MIN_PLAYERS_TO_START = 2;

const INITIAL_ROOM_STATE = (topic) => ({
    players: 0,
    max: 7,
    name: topic,
    started: false,
    gameLoop: null,
    time: 0,
});

const SLEEP_ROOM_STATE = {
    started: false,
    gameLoop: null,
    time: '',
}

module.exports = roomsCtrl();

async function roomsCtrl() {
    const rooms = new Map();
    let topicRooms = await getRoomsTopics();
    initRooms();

    return {
        getRoomsMapped,
        addPlayer,
        deletePlayer,
        isTheActualDrawer,
        initGameLoop,
        addPoints,
        startRound,
        restartGame,
        guessWord,
        getRoom : (name)       => rooms.get(name),
        getRooms: ()           => rooms.values(),
        set     : (name, room) => rooms.set(name, room),
    };

    async function getRoomsTopics() {
        return (await dictionariesModel.find({})).map(({ topic }) => topic);
    }

    function initRooms() {
        for (let topic of topicRooms) {
            rooms.set(topic, getInitialRoomState(topic));
        }
    }

    function getInitialRoomState(topic) {
        return {
            game: game(),
            ...INITIAL_ROOM_STATE(topic),
        };
    }

    function addPlayer(io, user, roomName) {
        const room = rooms.get(roomName);
        room.game.addPlayer(user);
        room.players++;

        // Comunicate to room chat that user just joined
        io.to(roomName).emit('message', { admin: true, msg: `${user.name} se ha unido.` });

        // Comunicate to everyone that user just joined to a room
        io.emit('rooms', { rooms: getRoomsMapped() });
        io.emit('globalChat', { admin: true, msg: `${user.name} se ha unido a la sala ${roomName}!` });

        if (!room.started && room.players == MIN_PLAYERS_TO_START) {
            console.log(`room '${roomName}' is starting...`);
            room.started = true;
            startRound(io, roomName);
        }
    }

    function setSleepState(roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        rooms.set(roomName, {
            ...room,
            ...SLEEP_ROOM_STATE,
        });
        console.log(rooms.get(roomName));
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

    function deletePlayer(io, user) {
        let currentRoom = rooms.get(user.roomName);
        currentRoom.players--;
        currentRoom.game.deletePlayer(user.name);
        if (currentRoom.players === 0) {
            clearInterval(currentRoom.gameLoop);
            currentRoom.game.restart();
            rooms.set(user.roomName, {
                ...INITIAL_ROOM_STATE(currentRoom.name),
                game: currentRoom.game
            });
            console.log(rooms.get(user.roomName));
        }
        else if (isTheActualDrawer(user)) {
            console.log('El actual dibujante ha salido...');
            startRound(io, user.roomName);
        }
    }

    function isTheActualDrawer(user) {
        return rooms.get(user.roomName).game.getDrawer() === user.name;
    }

    async function startRound(io, roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        if (room.players === 1) {
            comunicateSleepRoom(io, roomName);
            return;
        }
        room.game.setStarted(true);
        const drawer = room.game.chooseDrawer();
        console.log('El dibujante es', drawer);
        const words = await room.game.getRandomWords();
        io.to(roomName).emit('gameStatus', { users: room.game.getUsers() });
        io.to(roomName).emit('chooseDrawer', { drawer, words });
        io.to(roomName).emit('message', {
            statusMsg: true,
            msg: MESSAGES.DRAWER_IS(drawer),
        });
    }

    function comunicateSleepRoom(io, roomName) {
        setSleepState(roomName);
        const room = rooms.get(roomName);
        const game = room.game;
        io.to(roomName).emit('gameStatus', { users: game.getUsers() });
        io.to(roomName).emit('message', {
            statusMsg: true,
            msg: MESSAGES.WAITING_PLAYERS,
        });
        io.to(roomName).emit('progress', {
            time: room.time,
        });
        io.to(roomName).emit('ready', {
            word: game.getActualWord(),
            currentRound: game.getCurrentRound(),
            maxRound: game.getMaxRound(),
        });
    }

    function guessWord(io, socket, { user, room, guess }) {
        const currentRoom = rooms.get(room);
        const game = currentRoom.game;
        if (game.correctAnswer(user.name, guess)) {
            addPoints(user.name, currentRoom);
            io.to(room).emit('gameStatus', { users: game.getUsers() });
            socket.emit('setGuessed', {});
            io.to(room).emit('message', {
                admin: true,
                msg: MESSAGES.PLAYER_GUESSED(user.name),
            });
            if (game.everyBodyGuessed()) {
                clearInterval(currentRoom.gameLoop);
                restartGame(io, room, MESSAGES.EVERYONE_GUESSED);
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
                restartGame(io, roomName, MESSAGES.MESSAGE_FINAL_ROUND_TIMEOUT);
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

    function restartGame(io, roomName, finalStatusMsg) {
        const room = rooms.get(roomName);
        room.game.setStarted(false);
        io.to(roomName).emit('message', {
            statusMsg: true,
            msg: MESSAGES.END_ROUND,
        });
        io.to(roomName).emit('puntuationTable', {
            users: room.game.getRoundPuntuation(),
            finalStatusMsg
        });
        setTimeout(() => {
            startRound(io, roomName);
        }, 8000);
    }
}
