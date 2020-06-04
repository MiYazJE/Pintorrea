module.exports = {
    MAX_SECONDS_ROUND    : 65,
    TIME_TO_REVEAL_LETTER: 20,
    MIN_PLAYERS_TO_START : 2,
    GAME_ROUNDS          : 3,
    INITIAL_ROOM_STATE: (topic) => ({
        players: 0,
        max: 7,
        name: topic,
        started: false,
        gameLoop: null,
        time: 0,
    }),
    SLEEP_ROOM_STATE: {
        started: false,
        gameLoop: null,
        time: '',
    }    
}