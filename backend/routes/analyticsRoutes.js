const express = require('express');
const { updateAnalytics, logEvent,getAnalyticsReport  } = require('../controllers/analyticsController');
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();

router.route('/analytics').post(updateAnalytics)
                            .get(isAuthenticatedUser, authorizeRoles('admin'), getAnalyticsReport);
router.post('/analytics/log', isAuthenticatedUser, logEvent);


module.exports = router;
