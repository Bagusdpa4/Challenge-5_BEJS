const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { verify } = require('../controllers/v1/authControllers')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    done(null, await prisma.user.findFirst({ where: { id } }));
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, verify));

module.exports = passport;