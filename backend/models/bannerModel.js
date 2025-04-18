const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Optional: in case you want to track who uploaded it
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
