const User = require("../models/User");
const Task = require("../models/task")
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

secret = process.env.secret

const errorHandler = (err) => {
    console.log(err.message, err.code);
    // console.log(err.username)
    let errors = { username: '', email: '', password: '' };

    // Update
    if (err.message == "password length") {
        errors.password = "Password should contain minimum 6 characters!"
    }

    if (err.message == "name blank") {
        errors.name = "Name should not be left blank!"
    }

    if (err.message == "title blank") {
        errors.title = "Title should not be left blank!"
    }

    // No username, email, password
    if (err.message === 'no username') {
        errors.username = "Please enter username!"
    }

    if (err.message === 'no email') {
        errors.email = "Please enter email!"
    }

    if (err.message === 'no password') {
        errors.password = "Please enter password!"
    }

    // Incorrect username
    if (err.message === 'incorrect username') {
        errors.username = "Incorrect username!"
    }

    // Incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'Incorrect email!';
    }

    // Incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Incorrect password!';
    }

    // Duplicate username
    if (err.code === 11000) {
        errors.username = 'Username is taken!';
        return errors;
    }

    // Duplicate email
    if (err.code === 11000) {
        errors.email = 'Email is already registered';
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const taskerrorHandler = (err) => {
    console.log(err.message, err.code);
    // console.log(err.username)
    let errors = { taskdesc: '', deadline: '' };

    if (err.message == "desc blank") {
        errors.taskdesc = "Please describe your task!"
    }

    if (err.code === 11000) {
        errors.taskdesc = 'This task is taken!';
        return errors;
    }

    if (err.message.includes('Task validation failed')) {
        // console.log("abcdjskal");
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    // console.log(errors)
    return errors;
}

// create json web token
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: "Sign up" });
}

module.exports.login_get = (req, res) => {
    res.render('login', { title: "Login" });
}

module.exports.signup_post = async (req, res) => {
    const { name, title, username, email, password } = JSON.parse(req.body.data);
    const image = {
        url: req.file.path,
        filename: req.file.filename
    }
    const obj = { name, title, image, username, email, password }

    try {
        const user = await User.create(obj);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password)

    try {
        const user = await User.login(username, email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }

}

module.exports.update_post = async (req, res) => {
    const { name, username, title, password } = JSON.parse(req.body.data);
    // console.log(name, username, title, password.length)
    var image
    const user = await User.findOne({ username })
    if (req.file) {
        image = {
            url: req.file.path,
            filename: req.file.filename
        }
        cloudinary.uploader.destroy(user.image.filename, (error, result) => {
            console.log(result, error)
        });
    } else {
        image = {
            url: user.image.url,
            filename: user.image.filename
        }
    }

    try {
        const user = await User.updatefun(name, image, username, title, password);
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        // console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
}

module.exports.addtask_post = async (req, res) => {
    const { username, taskdesc, completed, deadline } = req.body;

    try {
        // const user = await Task.addtask(desc, completed, deadline);
        const task = await Task.create({ username, taskdesc, completed, deadline });
        res.status(201).json({ task: task._id });
    }
    catch (err) {
        console.log(err)
        const errors = taskerrorHandler(err);
        res.status(400).json({ errors });
    }
}

module.exports.updatetask_post = async (req, res) => {
    const { id, taskdesc, completed } = req.body;
    try {
        const task = await Task.updatetask(id, taskdesc, completed);
        res.status(201).json({ task: task._id });
    }
    catch (err) {
        // console.log(err)
        const errors = taskerrorHandler(err);
        res.status(400).json({ errors });
    }
}

module.exports.deletetask_post = async (req, res) => {
    const { id } = req.body
    const task = await Task.findByIdAndDelete(id)
    res.status(201).json({ task: task._id });
}

module.exports.markcomplete_post = async (req, res) => {
    const { course, id } = req.body;

    const filter = { id };
    let user
    if (course == "html") {
        user = await User.findOneAndUpdate(filter, { "courses.html": true }, {
            new: true
        });
    } else if (course == "css") {
        user = await User.findOneAndUpdate(filter, { "courses.css": true }, {
            new: true
        });
    } else if (course == "js") {
        user = await User.findOneAndUpdate(filter, { "courses.js": true }, {
            new: true
        });
    } else {
        user = await User.findOneAndUpdate(filter, { "courses.node": true }, {
            new: true
        });
    }
    console.log(user)
    return user
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}