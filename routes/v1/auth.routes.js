const router = require("express").Router();
const {register, login, me} = require("../../controllers/v1/authControllers");
const restrict = require('../../middlewares/auth.middlewares')

// API Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get('/auth/authenticate', restrict, me)

module.exports = router;