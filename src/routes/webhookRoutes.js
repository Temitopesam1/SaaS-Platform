const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const webhookController = require('../controllers/webhookController');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();


router.use(auth, limiter);

router.post('/:provider', webhookController.receiveWebhook);

module.exports = router;
