const initialState = {
    drawerName: null,
    guessed: false,
    actualWord: null,
    isDrawer: false,
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
            }
        case 'SET_IS_DRAWER': 
            return {
                ...state,
                isDrawer: action.isDrawer
            }
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

export const readGame = (state) => state.gameReducer;

export default reducer;
