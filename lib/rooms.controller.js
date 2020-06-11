const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const MESSAGES = require('./gameMessages');
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
    ROOMS_TOPICS,
} = require('./rooms.config');

module.exports = { roomsController };

function roomsController(io) {
    const rooms = new Map();
    initRooms();

    return {
        getRoomsMapped,
        addPlayer,
        deletePlayer,
        isTheActualDrawer,
        startRound,
        guessWord,
        startDrawing,
        createPrivateRoom,
        joinPrivateRoom,
        updateSettingsPrivateRoom,
        getRoom: (name) => rooms.get(name),
    };

    function initRooms() {
        for (let topic of ROOMS_TOPICS) {
            rooms.set(topic, getInitialRoomState(topic));
        }
    }

    function getInitialRoomState(topic) {
        return {
            game: game(GAME_ROUNDS),
            ...INITIAL_ROOM(topic),
        };
    }

    function createPrivateRoom(user, id) {
        rooms.set(id, {
            ...INITIAL_ROOM(id),
            id,
            allUsers: [],
            host: user.name,
            isPrivate: true
        });
    }

    function joinPrivateRoom(user, id) {
        console.log(id)
        const room = rooms.get(id);
        room.allUsers = [...room.allUsers, user];
        room.players++;
        rooms.set(id, room);
        io.to(id).emit('updateSettings', JSON.stringify({ room: mapPrivateRoom(room) }));
        io.to(id).emit('message', { admin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });
    }

    function mapPrivateRoom({ max, id, isPrivate, players, host, allUsers, drawingTime, rounds }) {
        return { max, id, isPrivate, host, allUsers, drawingTime, rounds, players };
    }

    function updateSettingsPrivateRoom(io, room) {
        rooms.set(room.id, { ...room });
        io.to(room.id).emit('updateSettings', JSON.stringify({ room }));
    }

    function addPlayer(user, roomName, socket) {
        const room = rooms.get(roomName);
        room.game.addPlayer(user);
        room.players++;

        // Comunicate to room chat that user just joined
        io.to(roomName).emit('message', { admin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });

        // Comunicate to everyone that user just joined to a room
        io.emit('rooms', { rooms: getRoomsMapped() });
        io.emit('globalChat', { admin: true, msg: MESSAGES.GLOBAL_CHAT_JOIN(user.name, roomName) });

        console.log('GAME STATUS', room.gameStatus);
        if (isReadyToStartGame(room)) {
            startRound(roomName);
        } else if (room.gameStatus === CHOOSING_WORD_STATUS) {
            const { game } = room;
            console.log(user.name, 'join to this round');
            game.addPlayerToActualRound(user);
            socket.emit('chooseDrawer', { drawer: game.getDrawer() });
        }
    }

    function isReadyToStartGame(room) {
        return room.gameStatus === SLEEP_STATUS || (room.gameStatus === null && room.players >= MIN_PLAYERS_TO_START);
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
        return [...rooms.values()].map(({ name, max, players, started, game, allUsers, isPrivate }) => {
            if (isPrivate) return null;
            return {
                name,
                max,
                players,
                started,
                users: game ? game.getUsers() : allUsers,
            }
        }).filter(room => room !== null);
    }

    function startDrawing(word, room, name) {
        const currentRoom = rooms.get(room);
        currentRoom.game.getWordAndEncrypt(word);
        currentRoom.gameStatus = DRAWING_STATUS;
        initGameLoop(room);
        io.to(room).emit('message', { statusMsg: true, msg: MESSAGES.PLAYER_START_DRAWING(name) });
        io.to(room).emit('ready', {
            word,
            currentRound: currentRoom.game.getCurrentRound(),
            maxRound: currentRoom.game.getMaxRound(),
        });
    }

    function handleUserDeletePrivateRoom(room, user) {
        // TODO choose another host player
        if (room.players === 0) {
            console.log('DELETE PRIVATE ROOM')
            rooms.delete(room.id);
        }
        else {
            console.log('DELETING AN USER')
            console.log('---BEDORE---')
            console.log(rooms.get(room.id).allUsers.forEach((a) => console.log(a.name)))
            rooms.set(room.id, {
                ...room, 
                allUsers: room.allUsers.filter(({ name }) => name !== user.name)
            });
            console.log('---AFTER---')
            console.log(rooms.get(room.id).allUsers.forEach((a) => console.log(a.name)))
            io.to(room.id).emit('updateSettings', JSON.stringify({ room: mapPrivateRoom(rooms.get(room.id)) }));
            io.emit('rooms', { rooms: getRoomsMapped(rooms.get(room.id)) });
        }
    }

    function deletePlayer(user) {
        let currentRoom = rooms.get(user.roomName);
        currentRoom.players--;
        if (currentRoom.isPrivate) {
            handleUserDeletePrivateRoom(currentRoom, user);
            return;
        }
        currentRoom.game.deletePlayer(user.name);
        io.to(user.roomName).emit('gameStatus', { users: currentRoom.game.getUsers() });
        if (currentRoom.players === 0) {
            clearInterval(currentRoom.gameLoop);
            rooms.set(user.roomName, {
                ...INITIAL_ROOM(currentRoom.name),
                game: game(GAME_ROUNDS),
            });
        } else if (isTheActualDrawer(user) || currentRoom.players === 1) {
            startRound(user.roomName);
        }
    }

    function isTheActualDrawer(user) {
        return rooms.get(user.roomName).game.getDrawer() === user.name;
    }

    async function startRound(roomName) {
        console.log('Starting round', roomName);
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);

        if (room.players === 1) {
            console.log('startRound', room.gameStatus);
            if (room.gameStatus !== SLEEP_STATUS) {
                comunicateSleepRoom(roomName);
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
            console.log('pasando de ronda en la sala', roomName);
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

    function comunicateSleepRoom(roomName) {
        console.log('sleeping room', roomName);
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

    function guessWord(socket, { user, room, guess }) {
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
                nextRound(room, MESSAGES.EVERYONE_GUESSED);
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
        if (room.time >= 20) room.time -= 10;
    }

    function initGameLoop(roomName) {
        const room = rooms.get(roomName);
        room.time = MAX_SECONDS_ROUND;
        let previousTime = MAX_SECONDS_ROUND;
        let interval = setInterval(() => {
            if (room.time == 0) {
                nextRound(roomName, MESSAGES.MESSAGE_FINAL_ROUND_TIMEOUT);
                clearInterval(interval);
            }
            io.to(roomName).emit('progress', {
                time: room.time,
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

    async function nextRound(roomName, finalStatusMsg) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);
        room.game.setStarted(false);
        io.to(roomName).emit('puntuationTable', {
            users: room.game.getRoundPuntuation(),
            finalStatusMsg,
        });
        if (room.game.isTheEnd()) {
            await sleep(4000);
            showEndGame(roomName);
            await sleep(10000);
            room.game.restart();
        } else {
            io.to(roomName).emit('message', {
                statusMsg: true,
                msg: MESSAGES.END_ROUND,
            });
            await sleep(8000);
        }
        console.log('nextRound status', room.gameStatus);
        if (room.gameStatus !== SLEEP_STATUS) {
            startRound(roomName);
        }
    }

    function showEndGame(roomName) {
        io.to(roomName).emit('message', {
            admin: true,
            msg: MESSAGES.END_GAME,
        });
        const room = rooms.get(roomName);
        clearInterval(room.game.time);
        io.to(roomName).emit('endGame', { users: room.game.getFinalPuntuation() });
    }

    function sleep(time) {
        return new Promise((res) => setTimeout(res, time));
    }
}
