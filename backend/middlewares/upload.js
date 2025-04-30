const multer = require("multer");
const path = require("path");
const s3 = require('../config/s3');
const multerS3 = require('multer-s3');



// Ensure the uploads/product directory exists
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

const variantFields = Array.from({ length: 5 }, (_, i) => ({
    name: `variants[${i}][images]`,
    maxCount: 3
}));

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
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
}).fields([
    { name: 'images', maxCount: 3 },
    ...variantFields
]);




module.exports = upload;