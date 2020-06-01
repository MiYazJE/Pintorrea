const initialState = {
    drawerName  : null,
    currentRound: null,
    maxRound    : null,
    actualWord  : null,
    guessed     : false,
    isDrawer    : false,
    messages    : [],
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
                maxRound: state.maxRound
            };
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

export default reducer;
