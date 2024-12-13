const express = require("express");
const partnerController = require("../controllers/PartnerController");
const { uploadProfilePhoto } = require("../middleware/image-upload.middleware");
const router = express.Router();

router
  .route("/")
  .post(partnerController.createPartner)
  .get(partnerController.getAllPartners);

// router
//   .route("/:id")
//   .get(partnerController.getClientById)
//   .put(partnerController.updateClient)
//   .delete(partnerController.deleteClient);

module.exports = router;
