const multer = require("multer");
const path = require("path");
const s3 = require('../config/s3');
const multerS3 = require('multer-s3');

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
   
};

// Define fields for variant images
const variantFields = Array.from({ length: 10 }, (_, i) => ({
    name: `variants[${i}][images]`,
    maxCount: 3
}));

// Multer configuration
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'glocreawsimagebucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
            cb(null, filename);
        }
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
}).fields([
    { name: 'images', maxCount: 3 }, // Main product images
    ...variantFields // Variant images
]);

module.exports = upload;