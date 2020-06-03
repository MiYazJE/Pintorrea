import Http from '../../Helpers/Http';
import { 
    removeCookie, 
    whoAmI, 
    signInWithGoogle, 
    logIn, 
    signUp 
} from '../../Helpers/auth-helpers';

export const logUser = (user) => {
    console.log(user);
    return {
        type: 'LOG_USER', 
        user
    }
}

const logOutUser = () => ({
    type: 'LOGOUT_USER',
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
        dispatch(checkAuth());
        success();
    }
    else {
        error(res.message);
    }
}

export const verifyAuth = () => async (dispatch) => {
    const data = await whoAmI();
    if (!data.auth) {
        dispatch(logOutUser());
    }
}

export const googleSignIn = (callback) => async (dispatch) => {
    const { auth } = await signInWithGoogle();
    console.log(auth);
    if (auth) {
        dispatch(checkAuth(callback));
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

export const checkAuth = (callback) => async (dispatch) => {
    const data = await whoAmI();
    if (!data.auth) {
        dispatch(logOut());
    }
    else {
        dispatch(logUser(data.user));
        console.log(callback)
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

