const express = require("express");
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const controller = require("../../controllers/admin/setting.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single('logo'),
  uploadCloud.uploadSingle,
  controller.generalPatch
);

module.exports = router;