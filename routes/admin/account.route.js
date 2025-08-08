const express = require("express");
const router = express.Router();
const multer  = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const { checkPermission } = require("../../middlewares/admin/auth.middleware");
const upload = multer();

const controller = require("../../controllers/admin/account.controller");

router.get("/", checkPermission("accounts_view"), controller.index);

router.get("/create", checkPermission("accounts_create"), controller.create);

router.post("/create",
            upload.single('avatar'),
            uploadCloud.upload,
            checkPermission("accounts_create"),
            controller.createPost);


router.get("/edit/:id", checkPermission("accounts_edit"), controller.edit);
router.patch("/edit/:id",
            upload.single('avatar'),
            uploadCloud.upload,
            checkPermission("accounts_edit"),
            controller.editPatch);
module.exports = router;