const router = require("express").Router();
const {register, verify, dashboard} = require("../../controllers/v1/authControllers");
const passport = require('../../libs/passport')
const restrict = require('../../middlewares/auth.middlewares')

// API Auth
router.post("/auth/register", register);
router.post("/auth/login", verify);
router.get('/auth/dashboard', restrict, dashboard)
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/api/v1/dashboard',
//     failureRedirect: '/api/v1/login'
// }));

module.exports = router;