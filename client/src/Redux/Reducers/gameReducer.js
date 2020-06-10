const initialState = {
    drawerName  : null,
    currentRound: null,
    maxRound    : null,
    actualWord  : null,
    guessed     : false,
    isDrawer    : false,
    messages    : [],
    isStarted   : false,
    privateRoom : null,
    loadingRoom : false,
    rooms       : [],
    coordinates : []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DRAWER_NAME':
            return {
                ...state,
                drawerName: action.drawerName,
            };
        case 'SET_GUESSED':
            return {
                ...state,
                guessed: true,
            };
        case 'SET_ACTUAL_WORD': 
            return {
                ...state,
                actualWord: action.actualWord
            };
        case 'SET_IS_DRAWER': 
            return {
                ...state,
                isDrawer: action.isDrawer
            };
        case 'ADD_MESSAGE':
            if ((action.message.privateMsg && !state.guessed) && 
                (action.message.privateMsg && !state.isDrawer)) {
                    return { ...state };
                }
            return {
                ...state,
                messages: [...state.messages, action.message]
            };
        case 'SET_CURRENT_ROUND': 
            return {
                ...state,
                currentRound: action.currentRound
            };
        case 'SET_MAX_ROUND': 
            return {
                ...state,
                maxRound: action.maxRound
            };
        case 'RESET_MESSAGES':
            return {
                ...state,
                messages: [],
            };
        case 'RESET_GAME':
            return {
                ...initialState,
                messages: [...state.messages],
                currentRound: state.currentRound,
                maxRound: state.maxRound,
            };
        case 'SET_IS_STARTED':
            return {
                ...state,
                isStarted: action.isStarted
            }
        case 'SET_PRIVATE_ROOM':
            return {
                ...state,
                privateRoom: action.privateRoom,
                loadingRoom: true,
            }
        case 'SET_LOADING_ROOM':
            return {
                ...state,
                loadingRoom: false,
            }
        case 'SET_ROOMS':
            return {
                ...state,
                rooms: action.rooms,
            }
        case 'SET_COORDINATES':
            return {
                ...state,
                coordinates: action.coordinates,
            }
        default:
            return {
                ...state,
            };
    }
};

export const readIsDrawer     = (state) => state.gameReducer.isDrawer;
export const readDrawerName   = (state) => state.gameReducer.drawerName;
export const readGuessed      = (state) => state.gameReducer.guessed;
export const readActualWord   = (state) => state.gameReducer.actualWord;
export const readMessages     = (state) => state.gameReducer.messages;
export const readMaxRound     = (state) => state.gameReducer.maxRound;
export const readCurrentRound = (state) => state.gameReducer.currentRound;
export const readIsStarted    = (state) => state.gameReducer.isStarted;
export const readPrivateRoom  = (state) => state.gameReducer.privateRoom;
export const readLoadingRoom  = (state) => state.gameReducer.loadingRoom;
export const readRooms        = (state) => state.gameReducer.rooms;
export const readCoordinates  = (state) => state.gameReducer.coordinates;

export default reducer;
