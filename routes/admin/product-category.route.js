const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const { checkPermission } = require("../../middlewares/admin/auth.middleware");
const controller = require("../../controllers/admin/product-category.controller");

router.get("/", checkPermission("products-category_view"), controller.index);

router.get("/create", checkPermission("products-category_create"), controller.create);

router.post("/create",
            upload.single("thumbnail"),
            uploadCloud.upload,
            checkPermission("products-category_create"),
            controller.createPost);
router.get("/edit/:id", checkPermission("products-category_edit"), controller.edit);
router.patch("/edit/:id",
            upload.single("thumbnail"),
            uploadCloud.upload,
            checkPermission("products-category_edit"),
            controller.editPatch);
router.delete("/delete/:id", checkPermission("products-category_delete"), controller.delete);
module.exports = router;