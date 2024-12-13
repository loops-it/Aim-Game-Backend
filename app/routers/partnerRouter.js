const express = require("express");
const partnerController = require("../controllers/PartnerController");
const { validateToken, isAuth } = require("../middleware/authMiddleware");
const { uploadProfilePhoto } = require("../middleware/image-upload.middleware");
const router = express.Router();

router
  .route("/")
  .post(validateToken, partnerController.createPartner)
  .get(validateToken, partnerController.getAllPartners);

router
  .route("/workspace/:workspaceId")
  .get(isAuth, partnerController.getAllPartnersByWorkspaceId);

router
  .route("/:id")
  .get(validateToken, partnerController.getPartnerById)
  .put(validateToken, partnerController.updatePartner)
  .delete(validateToken, partnerController.deletePartner);

router
  .route("/filterbyworkspace/:workspaceId")
  .get(validateToken, partnerController.filterByWorkspace);

router
.route("/filter/companies/get")
.get(validateToken, partnerController.companies);

router
.route("/filter/partners/get")
.post(validateToken, partnerController.partnersFilter);
module.exports = router;
