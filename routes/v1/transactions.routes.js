const router = require("express").Router();
const {store, index, show, destroy } = require("../../controllers/v1/transactionControllers");

// API Transactions
router.post("/transactions", store);
router.get("/transactions", index);
router.get("/transactions/:id", show);
router.delete("/transactions/:id", destroy);

module.exports = router;