const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();


// router.use(limiter);

router.post('/:provider', webhookController.receiveWebhook);

module.exports = router;
