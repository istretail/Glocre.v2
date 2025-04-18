const multer = require("multer");
const path = require("path");
const s3 = require("../config/s3");
const multerS3 = require("multer-s3");

// === Only accept image files ===
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// === Multer Setup ===
const uploadBanner = multer({
    storage: multerS3({
        s3: s3,
        bucket: "glocreawsimagebucket", // Your bucket
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            // Use original file name
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB per file
    fileFilter: fileFilter,
}).array("images", 10); // Accept up to 10 files under the 'banners' field

module.exports = uploadBanner;
