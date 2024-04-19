const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            let { name, email, password } = req.body;

            let exist = await prisma.user.findFirst({ where: { email } });
            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: 'email has already been used!',
                    data: null
                })
                // req.flash('error', 'email has already been used!');
                // return res.redirect('/api/v1/register');
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            let user = await prisma.user.create({ data: { name, email, password: encryptedPassword } });
            return res.status(201).json({
                status: true, 
                message: "success",
                data: {user}
            })
            // return res.redirect('/api/v1/login');
        } catch (error) {
            next(error);
        }
    },

    // verify: async (email, password, done) => {
    //     try {
    //         let user = await prisma.user.findFirst({where: {email}})
    //         if (!user) {
    //             return done(null, false, {message: 'invalid email or password'})
    //         }

    //         let isPasswordCorrect = await bcrypt.compare(password, user.password)
    //         if (!isPasswordCorrect) {
    //             return done(null, false, {message: 'invalid email or password'})
    //         }
    //         return done(null, user)
    //     } catch (error) {
    //         done(null, false, { message : error.message });
    //     }
    // },

    verify: async (req, res, next) => {
        try {
            let {email, password} = req.body
            let user = await prisma.user.findFirst({where: {email}})
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid email or password',
                    data: null
                })
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid email or password',
                    data: null
                })
            }

            let token = jwt.sign(user, JWT_SECRET_KEY)

            return res.status(200).json({
                status: true,
                message: 'success',
                data: {user, token}
            })
        } catch (error) {
            next(error);
        }
    },

    dashboard: async (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: "OK",
                data: {user: req.user}
            })
        } catch (error) {
            next(error);
        }
    }
};