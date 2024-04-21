const router = require("express").Router();
const {store, index, show, destroy } = require("../../controllers/v1/transactionControllers");
const restrict = require('../../middlewares/auth.middlewares')

// API Transactions
// router.post("/transactions", store);
// router.get("/transactions", index);
// router.get("/transactions/:id", show);
// router.delete("/transactions/:id", destroy);

// API Transactions Restrict
router.post("/transactions",restrict, store);
router.get("/transactions",restrict, index);
router.get("/transactions/:id",restrict, show);
router.delete("/transactions/:id",restrict, destroy);

module.exports = router;