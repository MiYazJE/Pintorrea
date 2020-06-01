const initialState = {
    drawerName: null,
    guessed: false,
    actualWord: null,
    isDrawer: false,
    messages: []
};

const reducer = (state = initialState, action) => {
    console.log(action)
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
        case 'RESET_MESSAGES':
            return {
                ...state,
                messages: [],
            };
        case 'RESET_GAME':
            return {
                ...initialState
            };
        default:
            return {
                ...state,
            };
    }
};


export const readIsDrawer   = (state) => state.gameReducer.isDrawer;
export const readDrawerName = (state) => state.gameReducer.drawerName;
export const readGuessed    = (state) => state.gameReducer.guessed;
export const readActualWord = (state) => state.gameReducer.actualWord;
export const readMessages   = (state) => state.gameReducer.messages;

export default reducer;
