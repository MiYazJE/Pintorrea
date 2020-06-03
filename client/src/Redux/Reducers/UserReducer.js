const initialState = { 
    id     : null,
    name   : null,
    room   : null, 
    auth   : false, 
    email  : null,
    picture: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_USER':
            return {
                id: action.user.id,
                email: action.user.email,
                name: action.user.name,
                picture: action.user.picture,
                auth: true,
            };
        case 'LOGOUT_USER':
            return {
                ...initialState
            };
        case 'SET_PICTURE':
            return {
                ...state,
                picture: action.picture
            }
        case 'JOIN_ROOM':
            return {
                ...state,
                room: action.room,
            };
        default:
            return {
                ...state,
            };
    }
};

export const readUser = (state) => ({
    id     : state.UserReducer.id,
    name   : state.UserReducer.name,
    room   : state.UserReducer.room,
    auth   : state.UserReducer.auth,
    email  : state.UserReducer.email,
    picture: state.UserReducer.picture,
});
export const readImage = (state) => state.UserReducer.picture;
export const readName  = (state) => state.UserReducer.name;
export const readID    = (state) => state.UserReducer.id;
export const readAuth  = (state) => state.UserReducer.auth;
export const readRoom  = (state) => state.UserReducer.room;

export default reducer;
