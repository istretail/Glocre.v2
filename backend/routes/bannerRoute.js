const express = require("express");
const router = express.Router();
const uploadBanner = require("../middlewares/uploadBanner")
const { uploadBannerImage, deleteBannerImage, getAllBannerImages } = require("../controllers/bannerController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");


// Upload a banner image (Admin only)
router.post("/banner/upload", isAuthenticatedUser, authorizeRoles("admin"), uploadBanner,uploadBannerImage);

// Get all banner images (optional for frontend to fetch dynamically)
router.get("/banner", getAllBannerImages);

// Delete a banner image by ID (Admin only)
router.delete(
    "/banner/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteBannerImage
);

module.exports = router;
