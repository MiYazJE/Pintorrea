import Http from '../Helpers/Http';

export const setDrawerName = (drawerName) => ({
    type: 'SET_DRAWER_NAME',
    drawerName
});

export const setGuessed = () => ({
    type: 'SET_GUESSED',
});

export const setActualWord = (actualWord) => ({
    type: 'SET_ACTUAL_WORD',
    actualWord
});

export const setIsDrawer = (isDrawer) => ({
    type: 'SET_IS_DRAWER',
    isDrawer
});

export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    message
})

export const resetMessages = () => ({
    type: 'RESET_MESSAGES',
});

export const resetGame = () => ({
    type: 'RESET_GAME'
});

export const setCurrentRound = (currentRound) => ({
    type: 'SET_CURRENT_ROUND',
    currentRound
});

export const setMaxRound = (maxRound) => ({
    type: 'SET_MAX_ROUND',
    maxRound
});

export const setIsStarted = (isStarted) => ({
    type: 'SET_IS_STARTED',
    isStarted
});

export const setCoordinates = (coordinates) => ({
    type: 'SET_COORDINATES',
    coordinates
});

export const setPrivateRoom = (privateRoom) => ({
    type: 'SET_PRIVATE_ROOM',
    privateRoom
});

export const setRooms = (rooms) => ({
    type: 'SET_ROOMS',
    rooms
});

export const createPrivateRoom = (user, callback) => async (dispatch) => {
    dispatch(setLoadingRoom(true));
    const room = await Http.post({ user }, '/user/game/createRoom');
    dispatch(setLoadingRoom(false));
    callback(room.id);
}

export const verifyPrivateRoom = (roomName, success, error) => async (dispatch) => {
    const { valid } = await Http.get(`/user/game/room/valid/${roomName}`);
    if (valid) {
        success(`Entrando a la sala ${roomName}`);
    }
    else {
        error(`La sala ${roomName} no es válida.`);
    }
}

const setLoadingRoom = (loadingRoom) => ({
    type: 'SET_LOADING_ROOM',
    loadingRoom
});