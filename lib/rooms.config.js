const CHOOSING_WORD_STATUS = 'CHOOSING_WORD';
const DRAWING_STATUS       = 'DRAWING';
const SLEEP_STATUS         = 'SLEEP';

module.exports = {
    MAX_SECONDS_ROUND    : 65,
    TIME_TO_REVEAL_LETTER: 20,
    MIN_PLAYERS_TO_START : 2,
    GAME_ROUNDS          : 3,
    CHOOSING_WORD_STATUS,
    DRAWING_STATUS,
    SLEEP_STATUS,
    INITIAL_ROOM: (topic) => ({
        max       : 7,
        time      : 0,
        name      : topic,
        players   : 0,
        started   : false,
        gameLoop  : null,
        gameStatus: null,
    }),
    SLEEP_ROOM: {
        time      : 0,
        started   : false,
        gameLoop  : null,
        gameStatus: SLEEP_STATUS,
    },   
    ROOMS_TOPICS: [
        'SALA 1', 'SALA 2', 'SALA 3', 'SALA 4', 'SALA 5', 'SALA 6'
    ]
}