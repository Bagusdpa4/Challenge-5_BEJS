const router = require("express").Router();
const {register, index, show, destroy } = require("../../controllers/v1/accountControllers");

// API Bank_Account
router.post("/accounts", register);
router.get("/accounts", index);
router.get("/accounts/:id", show);
router.delete("/accounts/:id", destroy);

module.exports = router;