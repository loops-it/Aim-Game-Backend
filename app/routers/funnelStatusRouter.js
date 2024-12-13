const express = require("express");
const funnelStatusController = require("../controllers/FunnelStatusController");
const router = express.Router();

router
  .route("/")
  .post(funnelStatusController.createFunnelStatus)
  .get(funnelStatusController.getAllFunnelStatuses);

router
  .route("/:id")
  .get(funnelStatusController.getFunnelStatusById)
  .put(funnelStatusController.updateFunnelStatus)
  .delete(funnelStatusController.deleteFunnelStatus);

router.route("/funnel/:workspaceId").get(funnelStatusController.getFunnel);

module.exports = router;
