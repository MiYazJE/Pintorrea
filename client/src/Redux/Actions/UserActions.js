export const logUser = (user, auth) => ({
    type: 'LOG_USER', 
    user,
    auth
});

export const logOutUser = (user, auth) => ({
    type: 'LOGOUT_USER', 
    user, 
    auth
});

export const joinRoom = (room) => ({
    type: 'JOIN_ROOM', 
    room
});