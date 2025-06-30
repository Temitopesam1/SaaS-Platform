const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const auth = require('../middlewares/auth');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();
const setOrgRls = require('../middlewares/setOrgRls');

router.use(auth, setOrgRls, limiter);

router.get('/', getAuditLogs);

module.exports = router;