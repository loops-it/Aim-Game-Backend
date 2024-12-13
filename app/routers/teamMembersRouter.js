const express = require("express");
const TeamController = require("../controllers/TeamController");
const router = express.Router();
const { uploadProfilePhoto } = require("../middleware/image-upload.middleware");
const { validateToken, isAuth } = require("../middleware/authMiddleware");

router
  .route("/")
  .post([validateToken, uploadProfilePhoto], TeamController.createTeamMember) 
  .get(validateToken, TeamController.getTeamMembers);
router
  .route("/designation/presales")
  .get(validateToken, TeamController.getTeamMembersPresales);
router
  .route("/:id")
  .put(validateToken, TeamController.updateTeamMember)
  router
  .route("/search/:searchValue")
  .get(validateToken, TeamController.searchTeamMembers);
module.exports = router;
