const express = require("express");
const workspaceUserController = require("../controllers/WorkspaceUserController");
const { validateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .post(validateToken, workspaceUserController.createWorkspaceUser)
  .get(validateToken, workspaceUserController.getAllWorkspaceUsers);

router
  .route("/:id")
  .get(validateToken, workspaceUserController.getWorkspaceUserById)
  .put(validateToken, workspaceUserController.updateWorkspaceUser)
  .delete(validateToken, workspaceUserController.deleteWorkspaceUserById);

router
  .route("/workspace/:workspaceId")
  .get(validateToken, workspaceUserController.getWorkspaceUsersByWorkspaceId);

router
  .route("/workspace/:workspaceId/users/")
  .post(validateToken, workspaceUserController.addUserToWorkspace);

router
  .route("/workspace/:workspaceId/users/addNew")
  .post(validateToken, workspaceUserController.createUserAndAddToWorkspace);

router
  .route("/workspace/:workspaceId/users/:userId")
  .get(validateToken, workspaceUserController.getWorkspaceUserData);

module.exports = router;
