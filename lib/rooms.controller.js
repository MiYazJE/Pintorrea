const dictionariesModel = require('../app/models/dictionaries.model');
const game = require('./pintorrea');

const INITIAL_ROOM_STATE = topic => ({
    players: 0,
    max: 7,
    name: topic,
    started: false
});

module.exports = roomsCtrl();

async function roomsCtrl() {

    const rooms = new Map();
    let topicRooms = await getRoomsTopics();
    await initRooms();

    return {
        getRoomsMapped,
        deleteUser,
        getRoom: name => rooms.get(name),
        getRooms: () => rooms.values(),
        set: (name, room) => rooms.set(name, room),
    }

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
            ...INITIAL_ROOM_STATE(topic)
        }
    }

    function restartAndGetRoom(roomName) {
        const room = rooms.get(roomName);
        room.game.restart();
        return {
            game: room.game, 
            ...INITIAL_ROOM_STATE(roomName)
        }
    }

    async function getWords(roomName) {
        return (await dictionariesModel.findOne({ topic: roomName })).words;
    }

    function getRoomsMapped() {
        return [...rooms.values()].map(({ name, max, players, started, game }) => ({
            name, max, players, started, users: game.getUsers()
        }));
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

}