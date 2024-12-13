const express = require("express");
const workspaceController = require("../controllers/WorkspaceController");
const router = express.Router();

router
  .route("/")
  .post(workspaceController.createWorkspace)
  .get(workspaceController.getAllWorkspaces);
router
  .route("/check/:contactEmail")
  .get(workspaceController.getWorkspaceByContactEmail);
  
router
.route("/user/:id")
.get(workspaceController.getWorkspaceByUser);

router
  .route("/:id")
  .get(workspaceController.getWorkspaceById)
  .put(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

router
  .route("/industryType/:industryTypeId")
  .get(workspaceController.getWorkspaceByIndustryType);

router
  .route("/subscription/:subscription")
  .get(workspaceController.getWorkspaceBySubscription);

module.exports = router;
