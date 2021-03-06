const userModel = require('../models/user.model');
const rankingModel = require('../models/ranking.model');
const imageDataURi = require('image-data-uri');

const { avatarFemale, avatarMale, pictureFemale, pictureMale } = require('../models/user.defaults');

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
    changePictureFromAvatar,
    createRoom,
    isValidRoom,
    startPrivateGame
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
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
        return res.status(400).json({ msg: 'Empty fields.' });
    }

    const avatar = gender === 'male'
        ? avatarMale
        : avatarFemale;

    const picture = gender === 'male'
        ? pictureMale
        : pictureFemale;

    const user = new userModel({
        name,
        email,
        password,
        gender,
        avatar,
        picture,
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

    const ranking = new rankingModel({
        userId: user._id
    });
    await ranking.save();

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
    const user = await userModel.updateOne({ _id: id }, { picture, imageType: 'image' });
    res.json({ picture });
}

async function getProfile(req, res) {
    const { id } = req.params;
    if (!id) return res.status(401).json({ msg: 'El id esta vacío.' });
    const user = await userModel.findById({ _id: id });
    const ranking = await rankingModel.findOne({ userId: id }); 
    res.json({ user, ranking });
}

async function changeAvatar(req, res) {
    const { avatar, id } = req.body;
    if (!avatar || !id) return res.status(400).json({ msg: 'Los campos están vacíos.' });
    try {
        await userModel.updateOne({ _id: id }, { avatar });
        res.json({ msg: 'El avatar se ha guardado correctamente.' });
    }
    catch(err) {
        res.status(400).json({ error: true, msg: 'Han surgido problemas creando el avatar.' })
    }
}

async function changePictureFromAvatar(req, res) {
    const { id, imageUrl } = req.body;
    if (!id || !imageUrl) return res.status(400).json({ msg: 'Los campos están vacíos.' });
    try {
        const picture = await imageDataURi.encodeFromURL(imageUrl);
        await userModel.updateOne({ _id: id }, { picture, imageType: 'avatar' });
        res.json({ picture, msg: 'Ahora tienes el avatar seleccionado.' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: true, msg: 'Problemas subiendo la imagen.' });
    }
}

function createRoom(req, res) {
    const { user } = req.body;
    if (!user) return res.status(400).json({ msg: 'El usuario esta vacío.' });
    const { roomsCtrl } = req.app.locals;
    const id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    roomsCtrl.createPrivateRoom(user, id);
    const room = roomsCtrl.getPrivateRoom(id);
    console.log(room)
    res.json(room);
}

function isValidRoom(req, res) {
    const { idRoom } = req.params;
    if (!idRoom) return res.status(401).json({ valid: false });
    const { roomsCtrl } = req.app.locals;
    const room = roomsCtrl.getPrivateRoom(idRoom);
    res.json({ valid: room && room.isPrivate });
}

function startPrivateGame(req, res) {
    const { idRoom } = req.body;
    if (!idRoom) return res.status(400).json({ started: false, msg: 'El id de la sala está vacío.' });
    const { roomsCtrl } = req.app.locals;
    roomsCtrl.startPrivateGame(idRoom);
    res.json({ started: true });
}