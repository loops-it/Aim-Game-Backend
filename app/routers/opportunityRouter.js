const express = require("express");
const opportunityController = require("../controllers/OpportunityController");
const { validateToken, isAuth } = require("../middleware/authMiddleware");
const { uploadProfilePhoto } = require("../middleware/image-upload.middleware");

const router = express.Router();

router
  .route("/")
  .get(opportunityController.getAllOpportunities)
  .post(opportunityController.createOpportunity);
  
router
  .route("/workspace/:workspaceId")
  .get(validateToken, opportunityController.getOpportunitiesByWorkspaceId);

router
  .route("/client/:clientId")
  .get(validateToken, opportunityController.getOpportunitiesByClientId);

router
  .route("/workspace/:workspaceId/client/:clientId")
  .get(
    validateToken,
    opportunityController.getOpportunitiesByWorkspaceAndClient
  );

router
  .route("/:id")
  .get(validateToken, opportunityController.getOpportunityById)
  .put(validateToken, opportunityController.updateOpportunity)
  .delete(opportunityController.deleteOpportunity);
router
  .route("/:id/members")
  .get(validateToken, opportunityController.getOpportunityById);

router
  .route("/:id/mapping-role")
  .post(validateToken, opportunityController.createOpportunityMappingRole)
  .get(validateToken, opportunityController.getOpportunityMappingRoles);
router
  .route("/:id/mapping-role/:roleId")
  .get(validateToken, opportunityController.getOpportunityMappingRole)
  .put(validateToken, opportunityController.updateOpportunityMappingRole)
  .delete(validateToken, opportunityController.deleteOpportunityMappingRole);
  router
  .route("/search/:searchValue")
  .get(validateToken, opportunityController.searchOpportunities);
module.exports = router;
