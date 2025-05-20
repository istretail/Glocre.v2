const express = require('express')
const { subscribe, unsubscribe } = require('../controllers/subscribeController')

const router = express.Router()

router.route("/subscribe").post(subscribe)
router.route('/unsubscribe').post(unsubscribe)

module.exports = router;