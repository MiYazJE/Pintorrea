const initialState = { user: null, auth: false };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOG_USER":
            return {
                ...state,
                user: action.user,
                auth: action.auth,
            }
        case "LOGOUT_USER":
            return {
                ...state,
                user: null,
                auth: false,
            }
        default:
            return {
                ...state
            }
    }
}

export const readUser = state => state.UserReducer.user;
export const readAuth = state => state.UserReducer.auth;

export default reducer;