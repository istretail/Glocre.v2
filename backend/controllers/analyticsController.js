const Analytics = require('../models/analyticsModel');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Save or update aggregated analytics data
exports.updateAnalytics = catchAsyncError(async (req, res, next) => {
    const { categories, searchKeywords, productTimes } = req.body;
    const userId = req.user ? req.user.id : null; // Handle both logged-in and guest users

    let analytics = await Analytics.findOne({ userId });

    if (analytics) {
        // Update existing analytics
        analytics.categories = [...new Set([...analytics.categories, ...categories])];
        analytics.searchKeywords = [...new Set([...analytics.searchKeywords, ...searchKeywords])];
        for (const [productId, time] of Object.entries(productTimes)) {
            analytics.productTimes.set(productId, (analytics.productTimes.get(productId) || 0) + time);
        }
        analytics.updatedAt = Date.now();
    } else {
        // Create new analytics
        analytics = await Analytics.create({ userId, categories, searchKeywords, productTimes });
    }

    await analytics.save();
    res.status(200).json({ success: true, message: "Analytics updated successfully" });
});

// Log granular events like page views, button clicks, etc.
exports.logEvent = catchAsyncError(async (req, res, next) => {
    const { event, productId, pageUrl, searchKeyword, buttonClicked, timeSpent } = req.body;
    const userId = req.user ? req.user.id : null; // Optional for guest users

    // Add a new analytics record for this specific event
    await Analytics.create({
        userId,
        event,
        productId,
        pageUrl,
        searchKeyword,
        buttonClicked,
        timeSpent,
        timestamp: Date.now(),
    });

    res.status(201).json({ success: true, message: "Event logged successfully" });
});

// Get analytics data for the logged-in user
exports.getAnalytics = catchAsyncError(async (req, res, next) => {
    const analytics = await Analytics.findOne({ userId: req.user.id });

    if (!analytics) {
        return res.status(404).json({ success: false, message: "No analytics data available" });
    }
    res.status(200).json({ success: true, ...analytics.toObject() });
});

// Get analytics report for admin (all users)
exports.getAnalyticsReport = catchAsyncError(async (req, res, next) => {
    const analyticsData = await Analytics.find().populate('userId').populate('productId');
    res.status(200).json({ success: true, data: analyticsData });
});

