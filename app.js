// app.js

const express = require("express");
const morgan = require("morgan");
const app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const fs = require("fs");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const file = fs.readFileSync(path.join(__dirname, "doc", "swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const GlobalValidator = require("./app/validation/GlobalValidator");

const db = require("./databases");
const s3Service = require("./app/services/s3Service");
const {
  uploadProfilePhoto,
} = require("./app/middleware/image-upload.middleware");
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Set up global validator
GlobalValidator.init();

const errorHandler = require("./app/middleware/handleException");
const router = require("./app/routers");

// Import controllers after setting up the global validator
const TestController = require("./app/controllers/TestController");
const WorkspaceController = require("./app/controllers/WorkspaceController");
const IndustryTypeController = require("./app/controllers/IndustryTypeController");
const UserController = require("./app/controllers/UserController");
const PartnerController = require("./app/controllers/PartnerController");

app.use("/docs/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  const { version, name, description } = require("./package.json");
  res.json({
    service: {
      name: name,
      version: version,
      description: description,
    },
  });
});

app.post("/uploadTest", TestController.testUpload);

app.use("/api-v1", router);
app.use(errorHandler);

module.exports = app;
