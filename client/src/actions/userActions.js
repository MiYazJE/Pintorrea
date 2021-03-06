import Http from '../Helpers/Http';
import { 
    removeCookie, 
    whoAmI, 
    signInWithGoogle, 
    logIn, 
    signUp 
} from '../Helpers/auth-helpers';

export const logUser = (user) => {
    return {
        type: 'LOG_USER', 
        user
    }
}

const logOutUser = () => ({
    type: 'LOGOUT_USER',
});

const setAvatar = (avatar) => ({
    type: 'SET_AVATAR',
    avatar
});

export const joinRoom = (room) => ({
    type: 'JOIN_ROOM', 
    room
});

export const leaveRoom = () => ({
    type: 'LEAVE_ROOM', 
});

export const setPicture = (picture) => ({
    type: 'SET_PICTURE', 
    picture
});

export const toggleVolume = () => ({
    type: 'TOGGLE_VOLUME_ACTIVATED'
});

const setUserAuthLoading = (loading) => ({
    type: 'SET_USER_AUTH_LOADING',
    loading
});

export const setTypeImage = (imageType) => ({
    type: 'SET_TYPE_IMAGE_SELECTED',
    imageType
});

export const signIn = (user, success, error) => async (dispatch) => {
    const res = await logIn(user);
    if (res.success) {
        const data = await whoAmI();
        dispatch(logUser(data.user));
        success();
    }
    else {
        error(res.message);
    }
}

export const googleSignIn = (callback) => async (dispatch) => {
    const { auth } = await signInWithGoogle();
    if (auth) {
        const data = await whoAmI();
        callback();
        dispatch(logUser(data.user));
    }
} 

export const register = (user, success, error) => async (dispatch) => {
    const res = await signUp(user);
    if (res.success) {
        success(res.message);
    }
    else {
        error(res.message);
    }
}

export const verifyAuth = () => async (dispatch) => {
    dispatch(setUserAuthLoading(true));
    try {
        const data = await whoAmI();
        console.log(data)
        if (data.auth) {
            dispatch(logUser(data.user));
        }
        else {
            dispatch(logOutUser());
        }
    }
    catch(e) {
        // console.log(e)
    }
    dispatch(setUserAuthLoading(false));
}

export const checkAuth = (callback) => async (dispatch) => {
    const data = await whoAmI();
    if (!data.auth) {
        await removeCookie();
        dispatch(logOutUser());
    }
    else {
        dispatch(logUser(data.user));
        if (typeof callback === 'function') callback();
    }
}

export const logOut = (callback) => async (dispatch) => {
    await removeCookie();
    if (typeof callback === 'function') callback();
    dispatch(logOutUser());
}

export const uploadPicture = (picture, id, success) => async (dispatch) => {
    const data = await Http.post({ picture, id }, '/user/uploadPicture');
    console.log(success)
    success();
    dispatch(setTypeImage('image', id));
    dispatch(setPicture(data.picture));
}

export const uploadAvatar = ({ avatar, id }, success, error) => async (dispatch) => {
    const data = await Http.post({ avatar, id }, '/user/profile/avatar');
    if (!data.error) {
        success(data.msg);
        dispatch(setAvatar(avatar));
    }
    else {
        error(data.msg);
    }
}

export const uploadAvatarImage = ({ imageUrl, id }, success, error) => async (dispatch) => {
    const data = await Http.post({ imageUrl, id }, '/user/profile/avatar/image');
    if (!data.error) {
        success(data.msg, data.picture);
        dispatch(setTypeImage('avatar'));
        dispatch(setPicture(data.picture));
    }
    else {
        error(data.msg);
    }
}

export const sendPuntuation = (user, users) => async (dispatch) => {
    console.log('sending stats')
    users = users.sort((a, b) => b.puntuation - a.puntuation);
    console.log(users) 
    let userData = { userId: user.id };
    users.forEach((u, index) => {
        if (u.name === user.name) {
            userData.position = index + 1;
            userData.gamePoints = u.puntuation;
        }
    });
    console.log(userData)
    const data = await Http.post(userData, '/user/ranking');
    console.log(data);
}; 