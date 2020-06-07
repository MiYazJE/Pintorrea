const mongoose     = require('mongoose');
const bcrypt       = require('bcryptjs');
const userDefaults = require('./user.defaults');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    picture: {
        type: String
    },
    avatar: mongoose.Schema.Types.Mixed,
    imageType: {
        type: String,
        default: 'avatar'
    }
}, {
    timestamps: true
})

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);