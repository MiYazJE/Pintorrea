const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const MESSAGES = require('./gameMessages');
const {
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
    const privateRooms = new Map();
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
        startPrivateGame,
        deletePlayerFromPrivateGame,
        getPrivateRoom: (id) => privateRooms.get(id),
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
        const room = {
            id,
            allUsers: [],
            host: user.name,
            isPrivate: true,
            roomPlayers: 0,
            rounds: 3,
            drawingTime: 80,
            max: 7
        };
        privateRooms.set(id, room);
    }

    function joinPrivateRoom(user, id) {
        let room = privateRooms.get(id);
        if (!room) return;
        privateRooms.set(id, {
            ...room,
            roomPlayers: room.roomPlayers + 1,
            allUsers: [...room.allUsers, user]
        });
        io.to(id).emit('updateSettings', JSON.stringify({ room: privateRooms.get(id) }));
        io.to(id).emit('privateRoomMessage', { 
            admin: true, 
            msg: MESSAGES.PLAYER_CONNECTS(user.name),
            reproduceSound: 'join' 
        });
    }

    function startPrivateGame(id) {
        const room = {
            ...INITIAL_ROOM(id),
            ...privateRooms.get(id),
            allUsers: null,
        }
        room.game = game(room.rounds);
        console.log(room)
        rooms.set(id, room);
    }

    function updateSettingsPrivateRoom(io, room) {
        privateRooms.set(room.id, { ...room });
        io.to(room.id).emit('updateSettings', JSON.stringify({ room }));
    }

    function addPlayer(user, roomName, socket) {
        console.log('----------------')
        console.log('adding ', user.name, roomName)
        const room = rooms.get(roomName);
        room.game.addPlayer(user);
        room.players++;
        console.log('players', room.players)

        // Comunicate to room chat that user just joined
        io.to(roomName).emit('message', { admin: true, userJoin: true, msg: MESSAGES.PLAYER_CONNECTS(user.name) });

        // Comunicate to everyone that user just joined to a room
        io.emit('rooms', { rooms: getRoomsMapped() });
        io.emit('globalChat', { admin: true, msg: MESSAGES.GLOBAL_CHAT_JOIN(user.name, roomName) });

        if (isReadyToStartGame(room)) {
            console.log('starting game', true)
            startRound(roomName);
        } 
        else if (room.gameStatus === CHOOSING_WORD_STATUS) {
            const { game } = room;
            game.addPlayerToActualRound(user);
            socket.emit('chooseDrawer', { drawer: game.getDrawer() });
        }
    }

    function isReadyToStartGame(room) {
        return room.gameStatus === SLEEP_STATUS || (!room.gameStatus && room.players >= MIN_PLAYERS_TO_START);
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
            if (privateRooms.has(name)) return null;
            return {
                name,
                max,
                players,
                started,
                users: game.getUsers()
            }
        }).filter(room => room !== null);
    }

    function startDrawing(word, room, name) {
        console.log(room, 'ready to start', word)
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

    function deletePlayerFromPrivateGame(user) {
        let room = privateRooms.get(user.roomName);
        room.roomPlayers--;
        if (room.roomPlayers === 0) {
            console.log('DELETE PRIVATE ROOM', room.id);
            privateRooms.delete(room.id);
            rooms.delete(room.id);
            if (rooms.get(room.id))
                clearInterval(rooms.get(room.id).gameLoop);
        }
        else {
            // TODO choose another host player
            const newRoom = {
                ...room, 
                allUsers: room.allUsers.filter(({ name }) => name !== user.name),
            }
            privateRooms.set(room.id, { ...newRoom });
            io.to(room.id).emit('updateSettings', JSON.stringify({ room: newRoom }));
            io.to(room.id).emit('privateRoomMessage', { 
                userLeft: true,
                msg: MESSAGES.PLAYER_DISCONNECT(user.name),
                reproduceSound: 'leave'
            });
        }
    }

    function deletePlayer(user) {
        const currentRoom = rooms.get(user.roomName);
        if (!currentRoom) return;
        currentRoom.players--;
        if (currentRoom.started) {
            currentRoom.game.deletePlayer(user.name);
            io.to(user.roomName).emit('gameStatus', { users: currentRoom.game.getUsers() });
            io.to(user.roomName).emit('message', { userLeft: true, msg: MESSAGES.PLAYER_DISCONNECT(user.name)});
        }
        if (currentRoom.players === 0) {
            clearInterval(currentRoom.gameLoop);
            rooms.set(user.roomName, {
                ...INITIAL_ROOM(currentRoom.name),
                game: game(currentRoom.rounds),
            });
        } 
        else if (isTheActualDrawer(user) || currentRoom.players === 1) {
            startRound(user.roomName);
        }
    }

    function isTheActualDrawer(user) {
        return rooms.get(user.roomName).game.getDrawer() === user.name;
    }

    async function startRound(roomName) {
        const room = rooms.get(roomName);
        clearInterval(room.gameLoop);

        if (!privateRooms.has(roomName) && room.players === 1) {
            if (room.gameStatus !== SLEEP_STATUS) {
                comunicateSleepRoom(roomName);
            }
            return;
        }

        room.started = true;
        room.gameStatus = CHOOSING_WORD_STATUS;
        room.game.setStarted(true);

        const drawer = room.game.chooseDrawer();
        const words = await room.game.getRandomWords();

        if (room.game.isNextRound()) {
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
                reproduceSound: 'guessed',
            });
            if (game.everyBodyGuessed()) {
                clearInterval(currentRoom.gameLoop);
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
        room.time = room.drawingTime;
        let previousTime = room.drawingTime;
        clearInterval(room.gameLoop);
        let interval = setInterval(() => {
            if (room.time == 10) {
                io.to(roomName).emit('message', {
                    admin: true,
                    msg: 'Solo quedan 10 segundos!',
                    reproduceSound: 'time'
                })
            }
            if (room.time == 0) {
                nextRound(roomName, MESSAGES.TIMEOUT_STATUS);
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
            console.log(room.time);
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
            reproduceSound: finalStatusMsg === MESSAGES.TIMEOUT_STATUS ? 'timeout' : null, 
        });
        if (room.game.isTheEnd()) {
            await sleep(4000);
            showEndGame(roomName);
            await sleep(15000);
            if (privateRooms.has(roomName)) {
                io.to(roomName).emit('goPrivateRoom');
                return;
            }
            room.game.restart();
        } else {
            io.to(roomName).emit('message', {
                statusMsg: true,
                msg: MESSAGES.END_ROUND,
            });
            await sleep(10000);
        }
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
