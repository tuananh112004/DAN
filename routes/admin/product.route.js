// const express = require('express');
// const router = express.Router();
// const controller = require("../../controllers/admin/product.controller");

// const validate = require("../../validates/admin/product.validate");
// const multer  = require('multer')
// const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// const upload = multer();



// router.get("/",controller.index);

// router.patch("/change-status/:status/:id",controller.changeStatus);

// router.patch("/change-multi",controller.changeMulti);

// router.delete("/delete/:id",controller.delete);

// router.get("/create", controller.createGet);

// router.post("/create",
//             upload.single('thumbnail'),
//             uploadCloud.upload,
//             validate.createPost,
//             controller.createPOST
//             );

// router.get("/edit/:id",
//             upload.single('thumbnail'),
//             controller.edit
//           );
// router.patch("/edit/:id",
//             upload.single('thumbnail'),
//             uploadCloud.upload,
//             validate.createPost,
//             controller.editPatch
//           );


// router.get("/detail/:id",controller.detail);
// module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");
const multer  = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const { requireAuth, checkPermission } = require("../../middlewares/admin/auth.middleware");

const upload = multer();

// Xem danh sách sản phẩm
router.get("/", 
  checkPermission("products_view"), 
  controller.index
);

// Đổi trạng thái sản phẩm
router.patch("/change-status/:status/:id", 
  checkPermission("products_edit"), 
  controller.changeStatus
);

// Đổi trạng thái nhiều sản phẩm
router.patch("/change-multi", 
  checkPermission("products_edit"), 
  controller.changeMulti
);

// Xóa sản phẩm
router.delete("/delete/:id", 
  checkPermission("products_delete"), 
  controller.delete
);

// Form tạo sản phẩm
router.get("/create", 
  checkPermission("products_create"), 
  controller.createGet
);

// Xử lý tạo sản phẩm
router.post("/create",
  checkPermission("products_create"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPOST
);

// Form sửa sản phẩm
router.get("/edit/:id",
  checkPermission("products_edit"),
  upload.single('thumbnail'),
  controller.edit
);

// Xử lý sửa sản phẩm
router.patch("/edit/:id",
  checkPermission("products_edit"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

// Xem chi tiết sản phẩm
router.get("/detail/:id", 
  checkPermission("products_view"), 
  controller.detail
);

module.exports = router;
