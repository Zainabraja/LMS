const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const extraRoutes = require('./routes/extraRoutes')
const cookieParser = require('cookie-parser');
const { cookieAuth, verifyUser, checkTask, addCourse } = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();

mongo = process.env.mongoURI


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());


mongoose.connect(mongo, { useNewUrlParser: true })
    .then((data) => {
        console.log("Connected to DB!")
        app.listen((process.env.PORT || 3000), () => {
            console.log("Server started!")
        });
    })
    .catch((err) => {
        console.log(err)
    })


app.get('*', verifyUser)
app.get('/', (req, res) => res.render('home', { title: "LMS" }))
app.get('/dashboard', cookieAuth, (req, res) => res.render('dashboard', { title: "Dashboard" }));
app.get('/courses', cookieAuth, (req, res) => res.render('courses', { title: "Courses" }));
app.get('/taskManager', cookieAuth, checkTask, (req, res) => res.render('taskManager', { title: "Task Manager" }));
app.use(authRoutes)
app.use(extraRoutes)