const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }, // Anonymous users may not have a userId
  event: {
    type: String,
    required: true
  }, // e.g., "view_product", "add_to_cart"
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  pageUrl: {
    type: String,
    required: false
  },
  searchKeyword: {
    type: String,
    required: false
  },
  buttonClicked: {
    type: String,
    required: false
  },
  timeSpent: {
    type: Number,
    required: false
  }, // Time in seconds
  timestamp: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);