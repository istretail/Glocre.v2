const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
  getSellerProducts,
  addSellerProduct,
  updateSellerProduct,
  getSellerSingleProduct,
  cloneProduct,
  archiveProduct,
  unarchiveProduct,
  getArchiveProducts,
} = require("../controllers/productController");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const handleVariantUploads = (req, res, next) => {
  if (req.body.variants && typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid variants JSON format" });
    }
  } else {
    req.body.variants = [];
  }

  if (req.files) {
    if (req.files["images"]) {
      req.body.images = req.files["images"].map((file) => ({
        image: file.location,
      }));
    }

    if (req.files["variantsImages"]) {
      req.body.variants.forEach((variant, index) => {
        variant.images = req.files["variantsImages"].splice(0, 3).map((file) => ({
          image: file.location,
        }));
      });
    }

    // console.log(req.files);
  }

  next();
};

// Configure fields for upload
// const uploadFields = upload.fields([
//   { name: "images", maxCount: 3 }, // Main product images
//   { name: "variantsImages", maxCount: 9 }, // Handle all variant images in one field
// ]);


// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
router.route("/products").get(getProducts);
router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(isAuthenticatedUser, createReview)
  .delete(deleteReview);
router.route("/reviews").get(isAuthenticatedUser, getReviews);

// Admin routes
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), upload, // Multer middleware to process FormData
  handleVariantUploads, newProduct);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), upload, handleVariantUploads, updateProduct);
router.route("/admin/reviews").get(isAuthenticatedUser, authorizeRoles("admin"), getReviews);
router.route("/admin/review").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

// Seller Routes
router.route("/seller/products").get(isAuthenticatedUser, authorizeRoles("seller"), getSellerProducts);
router
  .route("/seller/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    upload, // Multer middleware to process FormData
    handleVariantUploads, // Custom middleware to process variants
    addSellerProduct // Controller to handle the request
  );
router.route("/seller/product/:id").put(isAuthenticatedUser, authorizeRoles("seller"), upload, handleVariantUploads,updateSellerProduct)
router.route("/seller/product/:id").get(isAuthenticatedUser, authorizeRoles("seller"), getSellerSingleProduct);
router.route("/seller/archive/products").get(isAuthenticatedUser, authorizeRoles("seller"), getArchiveProducts);
router.route("/seller/product/clone/:id").post(isAuthenticatedUser, authorizeRoles("seller"), cloneProduct);
router.route('/seller/product/archive/:id').put(isAuthenticatedUser, authorizeRoles("seller") , archiveProduct);
router.route('/seller/product/unarchive/:id').put(isAuthenticatedUser, authorizeRoles("seller") , unarchiveProduct);
module.exports = router;