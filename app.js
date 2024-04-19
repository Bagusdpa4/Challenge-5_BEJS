require('dotenv').config();
const express = require("express");
const flash = require('express-flash');
const session = require('express-session');
const logger = require('morgan');
const app = express();
const cors = require("cors");
const router = require("./routes/v1")
const passport = require('./libs/passport')
const { SESSION_SECRET_KEY } = process.env;

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.set('view engine', 'ejs');

app.use(router);

// 404 error handling
    app.use((req, res, next) => {
        res.status(404).json({
        status: false,
        message: `are you lost? ${req.method} ${req.url} is not registered!`,
        data: null,
        });
    });
  
// 500 error handling
    app.use((err, req, res, next) => {
    res.status(500).json({
        status: false,
        message: err.message || "Internal Server Error",
        data: null,
    });
    });

module.exports = app;
