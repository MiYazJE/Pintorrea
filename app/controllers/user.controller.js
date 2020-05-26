const userModel = require("../models/user.model");
 
module.exports = {
    nameAlreadyRegistered,
    emailAlreadyRegistered,
    createUser,
    getUsers,
    deleteAll,
    userNameExists,
    emailExists,
    uploadPicture,
}

async function nameAlreadyRegistered(name) {
    const allUsers = await userModel.find({ });
    const usersNames = allUsers.map(user => user.name);
    return usersNames.includes(name);
};

async function emailAlreadyRegistered(email) {
    const allUsers = await userModel.find({ });
    const usersEmails = allUsers.map(user => user.email);
    return usersEmails.includes(email);
};

async function createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Empty fields.' });
    }

    const user = new userModel({
        name,
        email,
        password
    });

    // Check if there is an existing user with the same name already registered
    if (await nameAlreadyRegistered(name)) {
        return res.status(400).send({
            message: `El usuari@ ${name} ya existe, por favor pruebe con otro.`,
            successs: false
        });
    }

    // Check if there is an existing email already registered
    if (await emailAlreadyRegistered(email)) {
        return res.status(400).send({
            message: `El email ${email} ya se encuentra registrado, por favor pruebe con otro.`,
            success: false
        });
    }

    user.password = await user.encryptPassword(password);

    // Creating the user
    await user.save();

    res.send({
        message: `Has sido registrado correctamente.`,
        success: true
    });
};

async function getUsers(req, res) {
    res.status(200).json(await userModel.find({ }));
}

async function deleteAll(req, res) {
    await userModel.deleteMany({ });
    res.redirect('/api');
}

async function emailExists(req, res) {
    const { email } = req.params;
    if (!email) return res.status(400).json({ msg: 'El email se encuentra vacío.' });
    const emailExists = await emailAlreadyRegistered(email);
    res.json({ emailExists });
}

async function userNameExists(req, res) {
    const { userName } = req.params;
    if (!userName) return res.status(400).json({ msg: 'El username esta vacío.' });
    const userExists = await nameAlreadyRegistered(userName);
    return res.json({ userExists });
}

async function uploadPicture(req, res) {
    const { picture, id } = req.body;
    if (!picture || !id) return res.status(401).json({ msg: 'Los campos están vacíos.' });
    const user = await userModel.findOneAndUpdate({ _id: id }, { picture });
    res.json(user);
}