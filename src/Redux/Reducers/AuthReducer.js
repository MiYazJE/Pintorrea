const initialState = { auth: false };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {
                ...state,
                auth: action.auth
            }
        default:
            return {
                ...state
            }
    }
}

export const readAuth = (state) => state.AuthReducer.auth;

export default authReducer;