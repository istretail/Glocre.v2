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

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'glocreawsimagebucket', // replace with actual bucket name
        // acl: 'public-read', 
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
            cb(null, filename);
        }
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: fileFilter
}).fields([
    { name: 'images', maxCount: 3 },
    { name: 'variants[0][images]', maxCount: 3 },
    { name: 'variants[1][images]', maxCount: 3 },
    { name: 'variants[2][images]', maxCount: 3 },
    { name: 'variants[3][images]', maxCount: 3 },
    { name: 'variants[4][images]', maxCount: 3 },
]);




module.exports = upload;