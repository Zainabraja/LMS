const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Task = require('../models/task');
require('dotenv').config();

secret = process.env.secret

const cookieAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};


const verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, secret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};


const checkTask = async (req, res, next) => {
    let task = await Task.find()
    if (task) {
        res.locals.task = task;
        next();
    }
    else {
        res.locals.task = null;
        next();
    }
}


const addCourse = async (req, res, next) => {
    const username = await User.find()
    console.log(username)
    let course = await Course.find()
    if (course) {
        res.locals.course = course;
        next();
    } else {
        // let res = await Course.create()
        res.locals.course = null
        next();
    }
}

module.exports = { cookieAuth, verifyUser, checkTask, addCourse };