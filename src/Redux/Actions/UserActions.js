export const logUser = (user) => ({
    type: 'LOG_USER', 
    user
});

export const logOutUser = (user) => ({
    type: 'LOGOUT_USER', 
    user
});