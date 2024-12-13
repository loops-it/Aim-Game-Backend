const express = require("express");
const clientController = require("../controllers/ClientController");
const { uploadProfilePhoto } = require("../middleware/image-upload.middleware");
const { validateToken, isAuth } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router
  .route("/")
  .post([validateToken, uploadProfilePhoto], clientController.createClient)
  .get(validateToken,clientController.getAllClients);

router
  .route("/workspace/:workspaceId")
  .post([isAuth, uploadProfilePhoto], clientController.createClient)
  .get(validateToken,clientController.getAllClientsByWorkspaceId);

router
  .route("/:id")
  .get(validateToken, clientController.getClientById)
  .put(validateToken, clientController.updateClient)
  .delete(validateToken, clientController.deleteClient);

router
  .route("/search/:searchValue")
  .get(validateToken, clientController.searchClients);
module.exports = router;
