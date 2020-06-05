module.exports = {
    MAX_SECONDS_ROUND    : 65,
    TIME_TO_REVEAL_LETTER: 20,
    MIN_PLAYERS_TO_START : 2,
    GAME_ROUNDS          : 3,
    CHOOSING_WORD        : 'CHOOSING_WORD',
    DRAWING              : 'DRAWING',
    SLEEP_STATUS         : 'SLEEP',
    INITIAL_ROOM_STATE: (topic) => ({
        max       : 7,
        time      : 0,
        name      : topic,
        players   : 0,
        started   : false,
        gameLoop  : null,
        gameStatus: null,
    }),
    SLEEP_ROOM_STATE: {
        time      : '',
        started   : false,
        gameLoop  : null,
        gameStatus: this.SLEEP_STATUS,
    }    
}