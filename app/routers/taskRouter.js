const express = require("express");
const taskController = require("../controllers/TaskController");
const { validateToken, isAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .post(validateToken, taskController.createTask)
  .get(validateToken, taskController.getAllTasks);

router
  .route("/:id")
  .get(validateToken, taskController.getTaskById)
  .put(validateToken, taskController.updateTask);
router.route("/my/tasks").get(validateToken, taskController.fetchMyTasks);
router
  .route("/users/:userId")
  .get(validateToken, taskController.getAllTasksByUserId);

router
  .route("/opportunities/:opportunityId")
  .get(validateToken, taskController.getAllTasksByOpportunityId);

module.exports = router;
