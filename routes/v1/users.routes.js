const router = require("express").Router();
const {store, index, show, update, destroy } = require("../../controllers/v1/userControllers");
const restrict = require('../../middlewares/auth.middlewares')

// API Users
router.post("/users", store);
router.get("/users",restrict, index);
router.get("/users/:id",restrict, show);
router.put("/users/:id",restrict, update);
router.delete("/users/:id",restrict, destroy);

module.exports = router;