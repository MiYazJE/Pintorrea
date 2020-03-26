
const validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validSignUpUserData = async (body, res) => {
    const { name, email, password, passwordCheck } = body;

    // Check empty inputs
    if (!name) res.status(400).send({ succes: false, signUpMessage: "El nombre esta vacío." });
    if (!email) res.status(400).send({ succes: false, signUpMessage: "El email esta vacío." });
    if (!password)
        res.status(400).send({ succes: false, signUpMessage: "La contraseña esta vacía." });
    if (!passwordCheck)
        res.status(400).send({ succes: false, signUpMessage: "La contraseña esta vacía." });

    if (!name || !email || !password || !passwordCheck) return false;

    if (!validateEmail(email)) {
        res.send({
            signUpMessage: `El email no es válido.`,
            succes: false
        });
        return false;
    }

    // Validate the password
    if (password.trim() !== passwordCheck.trim()) {
        res.status(400).send({
            signUpMessage: `Las contraseñas no coinciden`,
            succes: false
        });
        return false;
    }

    return true;
};

const validLoginUserData = (body, res) => {
    const { email, password } = body;

    if (!email) {
        res.status(400).send({
            signInMessage: `El email esta vacío.`,
            succes: false
        });
        return false;
    }

    if (!validateEmail(email)) {
        res.status(400).send({
            signInMessage: `El email no es válido.`,
            succes: false
        });
        return false;
    }

    if (!password) {
        res.status(400).send({
            signInMessage: `La contraseña esta vacía.`,
            succes: false
        });
        return false;
    }
    
    return true;
}

module.exports = {
    validateEmail,
    validSignUpUserData,
    validLoginUserData
}