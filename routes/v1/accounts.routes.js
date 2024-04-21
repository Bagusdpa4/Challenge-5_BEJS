const router = require("express").Router();
const {register, index, show, destroy } = require("../../controllers/v1/accountControllers");
const restrict = require('../../middlewares/auth.middlewares')

// API Bank_Account
router.post("/accounts",restrict, register);
router.get("/accounts",restrict, index);
router.get("/accounts/:id",restrict, show);
router.delete("/accounts/:id",restrict, destroy);

module.exports = router;