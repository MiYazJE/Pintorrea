const initialState = {
    id: null,
    gender: null,
    name: null,
    room: null,
    auth: false,
    userLoading: true,
    email: null,
    picture: null,
    avatar: null,
    imageType: null,
    volumeActivated: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_USER':
            return {
                id: action.user.id,
                email: action.user.email,
                name: action.user.name,
                picture: action.user.picture,
                gender: action.user.gender,
                avatar: action.user.avatar,
                imageType: action.user.imageType,
                auth: true
            };
        case 'LOGOUT_USER':
            return {
                ...initialState,
                userLoading: false
            };
        case 'SET_PICTURE':
            return {
                ...state,
                picture: action.picture,
            };
        case 'SET_AVATAR':
            return {
                ...state,
                avatar: action.avatar,
            };
        case 'JOIN_ROOM':
            return {
                ...state,
                room: action.room,
            };
        case 'SET_TYPE_IMAGE_SELECTED':
            return {
                ...state,
                imageType: action.imageType,
            };
        case 'LEAVE_ROOM':
            return {
                ...state,
                room: null,
            };
        case 'SET_USER_AUTH_LOADING':
            return {
                ...state,
                userLoading: action.loading,
            };
        case 'TOGGLE_VOLUME_ACTIVATED':
            return {
                ...state,
                volumeActivated: !state.volumeActivated,
            };
        default:
            return {
                ...state,
            };
    }
};

export const readUser = (state) => ({
    id: state.UserReducer.id,
    gender: state.UserReducer.gender,
    name: state.UserReducer.name,
    room: state.UserReducer.room,
    auth: state.UserReducer.auth,
    email: state.UserReducer.email,
    picture: state.UserReducer.picture,
    avatar: state.UserReducer.avatar,
    imageType: state.UserReducer.imageType,
    volumeActivated: state.UserReducer.volumeActivated
});
export const readImage = (state) => state.UserReducer.picture;
export const readName = (state) => state.UserReducer.name;
export const readID = (state) => state.UserReducer.id;
export const readAuth = (state) => state.UserReducer.auth;
export const readRoom = (state) => state.UserReducer.room;
export const readAvatar = (state) => state.UserReducer.avatar;
export const readSex = (state) => state.UserReducer.gender;
export const readImageType = (state) => state.UserReducer.imageType;
export const readUserLoading = (state) => state.UserReducer.userLoading;
export const readVolumeActivated = (state) => state.UserReducer.volumeActivated;

export default reducer;
