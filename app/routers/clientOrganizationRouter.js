const express = require("express");
const clientOrganizationController = require("../controllers/ClientOrganizationController");
const { validateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(clientOrganizationController.getAllClientOrganizations)
  .post(validateToken, clientOrganizationController.createClientOrganization);

router
    .route('/client/:clientId')
    .get(validateToken, clientOrganizationController.getOrganizationsByClient);
    
router
  .route("/:id")
  .get(clientOrganizationController.getClientOrganizationById)
  .put(validateToken, clientOrganizationController.updateClientOrganization)
  .delete(validateToken, clientOrganizationController.deleteClientOrganizationById);

module.exports = router;
