const userModel = require('../models/user.model');
const imageDataURi = require('image-data-uri');

const { avatarFemale, avatarMale } = require('../models/user.defaults');

module.exports = {
    nameAlreadyRegistered,
    emailAlreadyRegistered,
    create,
    getUsers,
    deleteAll,
    userNameExists,
    emailExists,
    uploadPicture,
    getProfile,
    changeAvatar,
};

async function nameAlreadyRegistered(name) {
    const allUsers = await userModel.find({});
    const usersNames = allUsers.map((user) => user.name);
    return usersNames.includes(name);
}

async function emailAlreadyRegistered(email) {
    const allUsers = await userModel.find({});
    const usersEmails = allUsers.map((user) => user.email);
    return usersEmails.includes(email);
}

async function create(req, res) {
    const { name, email, password, sex } = req.body;

    if (!name || !email || !password || !sex) {
        return res.status(400).json({ msg: 'Empty fields.' });
    }

    const avatar = sex === 'male'
        ? avatarMale
        : avatarFemale;

    const user = new userModel({
        name,
        email,
        password,
        sex,
        avatar
    });

    if (await nameAlreadyRegistered(name)) {
        return res.status(400).send({
            message: `El usuari@ ${name} ya existe, por favor pruebe con otro.`,
            successs: false,
        });
    }

    if (await emailAlreadyRegistered(email)) {
        return res.status(400).send({
            message: `El email ${email} ya se encuentra registrado, por favor pruebe con otro.`,
            success: false,
        });
    }

    user.password = await user.encryptPassword(password);
    await user.save();

    res.send({
        message: `Has sido registrado correctamente.`,
        success: true,
    });
}

async function getUsers(req, res) {
    res.status(200).json(await userModel.find({}));
}

async function deleteAll(req, res) {
    await userModel.deleteMany({});
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
    res.json({ picture: user.picture });
}

async function getProfile(req, res) {
    const { id } = req.params;
    if (!id) return res.status(401).json({ msg: 'El id esta vacío.' });
    const user = await userModel.findById({ _id: id });
    res.json(user);
}

async function changeAvatar(req, res) {
    const { avatar, id, imageUrl } = req.body;
    if (!avatar || !id || !imageUrl) return res.status(400).json({ msg: 'Los campos están vacíos.' });
    const picture = await imageDataURi.encodeFromURL(imageUrl);
    await userModel.updateOne({ _id: id }, { avatar, picture });
    res.json({ picture, msg: 'El avatar se ha guardado correctamente.' });
}