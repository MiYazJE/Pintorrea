module.exports = { 
    FINAL_ROUND_TIMEOUT : 'El tiempo ha terminado!',
    END_ROUND           : 'La ronda ha terminado!',
    EVERYONE_GUESSED    : 'Todo el mundo ha acertado la palabra!',
    WAITING_PLAYERS     : 'La sala esta esperando a que entren más jugadores.',
    END_GAME            : 'La partida ha terminado.',
    PLAYER_START_DRAWING: (name)       => `${name} va ha empezar a dibujar.`,
    GLOBAL_CHAT_JOIN    : (name, room) => `${name} se ha unido a la sala ${room}!`,
    PLAYER_CONNECTS     : (name)       => `${name} se ha unido.`,
    PLAYER_DISCONNECT   : (name)       => `${name} se ha ido.`,
    PLAYER_GUESSED      : (name)       => `${name} ha acertado la palabra!`,
    DRAWER_IS           : (drawerName) => `El dibujante es '${drawerName}'.`, 
};