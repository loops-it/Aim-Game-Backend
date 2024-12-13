const express = require("express");
const userController = require("../controllers/UserController");
const router = express.Router();
const { validateToken, isAuth } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(userController.createUser)
  .get(validateToken, userController.getAllUsers);

router
  .route("/:id")
  .get(validateToken, userController.getUserById)
  .put(validateToken, userController.updateUser)
  .delete(validateToken, userController.deleteUser);

router
  .route("/:id/workspaces/:workspaceId/details")
  .get(validateToken, userController.getUserDetailsByUserIdAndWorkspaceId);

router
  .route("/my/workspaces")
  .get(validateToken, userController.getAllWorkspacesByUser);
router
  .route("/my/workspaces/:workspaceId")
  .get(validateToken, userController.getAllWorkspacesByUser);

module.exports = router;
