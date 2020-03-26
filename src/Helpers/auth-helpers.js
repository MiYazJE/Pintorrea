import Http from "../Helpers/Http";

export async function logIn(body) {
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