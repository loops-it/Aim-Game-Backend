const express = require("express");
const industryTypeController = require("../controllers/IndustryTypeController");
const router = express.Router();
const { validateToken } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(validateToken, industryTypeController.createIndustryType)
  .get(industryTypeController.getAllIndustryTypes);

router
  .route("/:id")
  .get(validateToken, industryTypeController.getIndustryTypeById)
  .put(validateToken, industryTypeController.updateIndustryType)
  .delete(validateToken, industryTypeController.deleteIndustryType);

module.exports = router;
