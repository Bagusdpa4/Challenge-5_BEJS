const router = require("express").Router();
const {register, index, show, destroy } = require("../../controllers/v1/accountControllers");
const restrict = require('../../middlewares/auth.middlewares')

// API Bank_Account
// router.post("/accounts", register);
// router.get("/accounts", index);
// router.get("/accounts/:id", show);
// router.delete("/accounts/:id", destroy);

// API Bank_Account Restrict
router.post("/accounts",restrict, register);
router.get("/accounts",restrict, index);
router.get("/accounts/:id",restrict, show);
router.delete("/accounts/:id",restrict, destroy);

module.exports = router;