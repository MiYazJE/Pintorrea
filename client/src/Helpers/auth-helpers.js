import Http from "../Helpers/Http";

export async function signIn(body) {
    return await Http.post(
        body,
        '/user/logIn'
    );
}

export async function signUp(body) {
    return await Http.post(
        body,
        '/user/createUser'
    );
}

export async function whoAmI() {
    return await Http.get(
        '/user/whoAmI'
    );
}

export async function logout() {
    return await Http.get(
        '/user/logOut'
    );
}

export async function removeCookie() {
    return await Http.get(
        '/user/removeCookie'
    );
}

export async function imLogged() {
    return await Http.get(
        '/user/imLogged'
    )
}

export async function signInWithGoogle() {
    return await Http.get(
        '/auth/google/signIn'
    )
}