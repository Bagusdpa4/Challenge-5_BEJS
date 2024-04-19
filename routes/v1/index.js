const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const User = require("./users.routes")
const Account = require("./accounts.routes")
const Transaction = require("./transactions.routes")
const Auth = require("./auth.routes")

const swagger_path = path.resolve(__dirname, "../../docs/api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API
router.use("/api/v1", User)
router.use("/api/v1", Account)
router.use("/api/v1", Transaction)

// Auth
router.use("/api/v1", Auth)

// Dashboard
// router.get('/dashboard', dashboard)

// // EJS
// router.get('/api/v1/auth', (req, res) => {
//     res.render('register');
// });
// router.get('/api/v1/login', (req, res) => {
//     res.render('login');
// });
// router.get('/api/v1/dashboard', restrict, (req, res) => {
//     res.render('dashboard', {'user': req.user});
// });


module.exports = router;
