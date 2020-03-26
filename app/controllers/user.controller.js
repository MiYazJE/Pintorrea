const User = require("../models/user.model");
const { validSignUpUserData } = require('./Helpers/validation-helpers');
 
const nameAlreadyRegistered = async name => {
    const allUsers = await User.find({ });
    const usersNames = allUsers.map(user => user.name);
    return usersNames.includes(name);
};

const emailAlreadyRegistered = async email => {
    const allUsers = await User.find({ });
    const usersEmails = allUsers.map(user => user.email);
    return usersEmails.includes(email);
};

const createUser = async (req, res) => {
    if (!(await validSignUpUserData(req.body, res))) {
        return;
    }

    const { name, email, password } = req.body;
    const user = new User({
        name,
        email,
        password
    });

    // Check if there is an existing user with the same name already registered
    if (await nameAlreadyRegistered(name)) {
        return res.status(400).send({
            message: `El usuari@ ${name} ya existe, por favor pruebe con otro.`,
            succes: false
        });
    }

    // Check if there is an existing email already registered
    if (await emailAlreadyRegistered(email)) {
        return res.status(400).send({
            message: `El email ${email} ya se encuentra registrado, por favor pruebe con otro.`,
            succes: false
        });
    }

    user.password = await user.encryptPassword(password);

    // Creating the user
    await user.save();

    res.send({
        message: `Has sido registrado correctamente.`,
        succes: true
    });
};

const getUsers = async (req, res) => {
    res.status(200).send(await User.find({ }));
};

const deleteAll = (req, res) => {
    User.deleteMany({}, (err, status) => {
        if (err) throw err;
        res.redirect("/api");
    });
};

module.exports = {
    nameAlreadyRegistered,
    emailAlreadyRegistered,
    createUser,
    getUsers,
    deleteAll
}