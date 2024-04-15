const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const file = fs.readFileSync("./api-docs.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

app.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const v1 = require("./routes/v1/index");
app.use("/api/v1", v1);

module.exports = app;
