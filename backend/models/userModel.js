const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    authLevel: {
        type: String,
        required: true
    }
});


userSchema.statics.login = async function (email, password, authLevel) {
    if (!email || !password || !authLevel) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    if (user.authLevel !== authLevel) { 
        throw Error('Incorrect authLevel');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
