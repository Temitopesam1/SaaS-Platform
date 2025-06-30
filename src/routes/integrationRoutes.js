const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getIntegrationStatus } = require('../controllers/integrationController');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();
const setOrgRls = require('../middlewares/setOrgRls');

router.use(auth, setOrgRls, limiter);

router.get('/status', getIntegrationStatus);

module.exports = router;
