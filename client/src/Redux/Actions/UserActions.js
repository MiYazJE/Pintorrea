import Http from '../../Helpers/Http';
import { 
    removeCookie, 
    whoAmI, 
    signInWithGoogle, 
    logIn, 
    signUp 
} from '../../Helpers/auth-helpers';

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

export const setPicture = (picture) => ({
    type: 'SET_PICTURE', 
    picture
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
    const data = await whoAmI();
    console.log(data)
    if (data.auth) {
        dispatch(logUser(data.user));
    }
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
    success();
    dispatch(setPicture(data.picture));
}

export const uploadAvatar = ({ avatar, id }, callback) => async (dispatch) => {
    const data = await Http.post({ avatar, id }, '/user/profile/avatar');
    callback(data.msg);
    dispatch(setAvatar(avatar));
}