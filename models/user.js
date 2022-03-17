const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },
    image: {
        url: String,
        filename: String
    },
    username: {
        type: String,
        required: [true, "Please enter username!"],
        unique: true,
        lowercase: true
    },
    title: {
        type: String,
        required: [true, "Please enter your designation!"]
    },
    email: {
        type: String,
        required: [true, "Please enter email!"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email!"]
    },
    password: {
        type: String,
        required: [true, 'Please enter password!'],
        minlength: [6, 'Password should contain minimum 6 characters!'],
    },
    courses:
    {
        html: {
            type: Boolean,
            default: false
        },
        css: {
            type: Boolean,
            default: false
        },
        js: {
            type: Boolean,
            default: false
        },
        node: {
            type: Boolean,
            default: false
        }
    }

});


userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.statics.login = async function (username, email, password) {
    const user = await this.findOne({ username });
    if (!username) {
        throw Error('no username');
    }

    if (user) {
        if (!email) {
            throw Error('no email');
        }
        const emailAuth = user.email == email
        if (emailAuth) {
            if (!password) {
                throw Error('no password');
            }
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }
    throw Error('incorrect username');
};


userSchema.statics.updatefun = async function (name, image, username, title, password) {
    if (name.length == 0) {
        throw Error("name blank");
    }
    if (title.length == 0) {
        throw Error("title blank");
    }
    if (password.length > 0 && password.length < 6) {
        throw Error("password length");
    }

    if (password.length == 0) {
        const user = await User.findOne({ username })
        password = user.password
    } else {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
    }

    const update = {
        name,
        title,
        image,
        password
    }
    const filter = { username };
    let doc = await User.findOneAndUpdate(filter, update, {
        new: true
    });
    return doc
};


const User = mongoose.model('User', userSchema)
module.exports = User;