const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const MESSAGES     = require('./gameMessages');
const {
    MAX_SECONDS_ROUND,
    TIME_TO_REVEAL_LETTER,
    MIN_PLAYERS_TO_START,
    GAME_ROUNDS,
    CHOOSING_WORD_STATUS,
    DRAWING_STATUS,
    SLEEP_STATUS,
    INITIAL_ROOM,
    SLEEP_ROOM,
} = require('./rooms.config');

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
        startRound,
        guessWord,
        startDrawing,
        getRoom : name => rooms.get(name),
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
            game: game(GAME_ROUNDS),
            ...INITIAL_ROOM(topic),
        };
    }

    function addPlayer(io, user, roomName, socket) {
        const room = rooms.get(roomName);
        room.game.addPlayer(user);
        room.players++;

        // Comunicate to room chat that user just joined
        io.to(roomName).emit('message', { admin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });

        // Comunicate to everyone that user just joined to a room
        io.emit('rooms', { rooms: getRoomsMapped() });
        io.emit('globalChat', { admin: true, msg:  MESSAGES.GLOBAL_CHAT_JOIN(user.name, roomName)});

        console.log('GAME STATUS', room.gameStatus);
        if (isReadyToStartGame(room)) {
            startRound(io, roomName);
        }
        else if (room.gameStatus === CHOOSING_WORD_STATUS) {
            const { game } = room;
            console.log(user.name, 'join to this round');
            game.addPlayerToActualRound(user);
            socket.emit('chooseDrawer', { drawer: game.getDrawer() });
        }
    }

    function isReadyToStartGame(room) {
        return room.gameStatus === SLEEP_STATUS || 
              (room.gameStatus === null && room.players >= MIN_PLAYERS_TO_START);
    }

    function setSleepState(roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        rooms.set(roomName, {
            ...room,
            ...SLEEP_ROOM,
        });
    }

    function getRoomsMapped() {
        return [...rooms.values()].map(
            ({ name, max, players, started, game }) => ({
                name,
                max,
                players,
                started,
                users: game.getUsers(),
            })
        );
    }

    function startDrawing(io, word, room, name) {
        const currentRoom = rooms.get(room);
        currentRoom.game.getWordAndEncrypt(word);
        currentRoom.gameStatus = DRAWING_STATUS;
        initGameLoop(io, room);
        io.to(room).emit('message', { statusMsg: true, msg: MESSAGES.PLAYER_START_DRAWING(name) });
        io.to(room).emit('ready', { 
            word, 
            currentRound: currentRoom.game.getCurrentRound(),
            maxRound: currentRoom.game.getMaxRound(),
        });
    }


    function deletePlayer(io, user) {
        let currentRoom = rooms.get(user.roomName);
        currentRoom.players--;
        currentRoom.game.deletePlayer(user.name);
        io.to(user.roomName).emit('gameStatus', { users: currentRoom.game.getUsers() });
        if (currentRoom.players === 0) {
            clearInterval(currentRoom.gameLoop);
            rooms.set(user.roomName, {
                ...INITIAL_ROOM(currentRoom.name),
                game: game(GAME_ROUNDS)
            });
        }
        else if (isTheActualDrawer(user) || currentRoom.players === 1) {
            startRound(io, user.roomName);
        }
    }

    function isTheActualDrawer(user) {
        return rooms.get(user.roomName).game.getDrawer() === user.name;
    }

    async function startRound(io, roomName) {
        console.log('Starting round', roomName)
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);

        if (room.players === 1) {
            console.log('startRound', room.gameStatus);
            if (room.gameStatus !== SLEEP_STATUS) {
                comunicateSleepRoom(io, roomName);
            }
            return;
        }

        room.started = true;
        room.gameStatus = CHOOSING_WORD_STATUS;
        room.game.setStarted(true);

        const drawer = room.game.chooseDrawer();
        console.log('El dibujante es', drawer);
        const words = await room.game.getRandomWords();

        if (room.game.isNextRound()) {
            console.log('pasando de ronda en la sala', roomName)
            io.to(roomName).emit('nextRound', { round: room.game.getCurrentRound() });
            await sleep(2000);
            room.game.setNextRound(false);
        }

        io.to(roomName).emit('gameStatus', { users: room.game.getUsers() });
        io.to(roomName).emit('chooseDrawer', { drawer, words });
        io.to(roomName).emit('message', {
            statusMsg: true,
            msg: MESSAGES.DRAWER_IS(drawer),
        });
    }

    function comunicateSleepRoom(io, roomName) {
        console.log('sleeping room', roomName);
        setSleepState(roomName);
        const room = rooms.get(roomName);
        const game = room.game;
        io.to(roomName).emit('gameStatus', { users: game.getUsers() });
        io.to(roomName).emit('message', {
            statusMsg: true,
            msg      : MESSAGES.WAITING_PLAYERS,
        });
        io.to(roomName).emit('progress', {
            time: room.time,
        });
        io.to(roomName).emit('ready', {
            word        : game.getActualWord(),
            currentRound: game.getCurrentRound(),
            maxRound    : game.getMaxRound(),
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
                nextRound(io, room, MESSAGES.EVERYONE_GUESSED);
            }
        } 
        else {
            io.to(room).emit('message', {
                name      : user.name,
                msg       : guess,
                privateMsg: game.privateMsg(user.name),
            });
        }
    }

    function addPoints(name, room) {
        room.game.addPointsToUser(name, room.time);
        room.game.addPointsToDrawer(room.time);
        if (room.time >= 20) room.time -= 10;
    }

    function initGameLoop(io, roomName) {
        const room       = rooms.get(roomName);
        room.time        = MAX_SECONDS_ROUND;
        let previousTime = MAX_SECONDS_ROUND;
        let interval = setInterval(() => {
            if (room.time == 0) {
                nextRound(io, roomName, MESSAGES.MESSAGE_FINAL_ROUND_TIMEOUT);
                clearInterval(interval);
            }
            io.to(roomName).emit('progress', {
                time         : room.time,
                encryptedWord: room.game.getEncryptedWord(),
            });
            room.time--;
            if (previousTime - room.time >= TIME_TO_REVEAL_LETTER) {
                room.game.revealLetter();
                previousTime = room.time;
            }
        }, 1000);
        room.gameLoop = interval;
    }

    async function nextRound(io, roomName, finalStatusMsg) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        room.game.setStarted(false);
        io.to(roomName).emit('puntuationTable', {
            users: room.game.getRoundPuntuation(),
            finalStatusMsg
        });
        if (room.game.isTheEnd()) {
            await sleep(4000);
            showEndGame(io, roomName);
            await sleep(10000);
            room.game.restart();
        }
        else {
            io.to(roomName).emit('message', {
                statusMsg: true,
                msg: MESSAGES.END_ROUND,
            });
            await sleep(8000);
        }
        console.log('nextRound status', room.gameStatus)
        if (room.gameStatus !== SLEEP_STATUS) {
            startRound(io, roomName);
        }
    }

    function showEndGame(io, roomName) {
        io.to(roomName).emit('message', {
            admin: true,
            msg: MESSAGES.END_GAME,
        });
        const room = rooms.get(roomName);
        clearInterval(room.game.time);
        io.to(roomName).emit('endGame', { users: room.game.getFinalPuntuation() });
    }

    function sleep(time) {
        return new Promise(res => setTimeout(res, time));
    }
}
