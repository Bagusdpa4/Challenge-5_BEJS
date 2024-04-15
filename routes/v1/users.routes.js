const router = require("express").Router();
const {store, index, show, update, destroy } = require("../../controllers/v1/userControllers");

// API Users
router.post("/users", store);
router.get("/users", index);
router.get("/users/:id", show);
router.put("/users/:id", update);
router.delete("/users/:id", destroy);

module.exports = router;