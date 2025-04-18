const Banner = require("../models/bannerModel");

exports.uploadBannerImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        // For simplicity, just save the first banner
        const newBanner = await Banner.create({
            url: req.files[0].location,
            key: req.files[0].key,
        });

        res.status(201).json({ success: true, banner: newBanner });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to upload banner image" });
    }
};


exports.getAllBannerImages = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: banners.length,
            banners,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch banner images",
            error: error.message,
        });
    }
};

// DELETE BANNER IMAGE
exports.deleteBannerImage = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        // Remove image from S3
        // const imageKey = banner.url.split("/").pop(); // if full URL was stored
        // const params = {
        //     Bucket: "glocreawsimagebucket",
        //     Key: imageKey,
        // };

        // await s3.deleteObject(params).promise();

        // Remove from database
        await banner.deleteOne();

        res.status(200).json({
            success: true,
            message: "Banner image deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete banner image",
            error: error.message,
        });
    }
};