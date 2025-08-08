const express = require("express");
const router = express.Router();
const { checkPermission } = require("../../middlewares/admin/auth.middleware");

const controller = require("../../controllers/admin/role.controller");

router.get("/", checkPermission("roles_view"), controller.index);
router.get("/create", checkPermission("roles_create"), controller.create);
router.post("/create", checkPermission("roles_create"), controller.createPost);
router.get("/edit/:id", checkPermission("roles_edit"), controller.edit);
router.patch("/edit/:id", checkPermission("roles_edit"), controller.editPatch);
router.get("/permission", checkPermission("roles_permissions"), controller.permission);
router.patch("/permission", checkPermission("roles_permissions"), controller.permissionPatch);
module.exports = router;