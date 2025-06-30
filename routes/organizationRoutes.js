const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../utils/accessControl');
const { createOrganization, getMyOrganization } = require('../controllers/organizationController');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();
const setOrgRls = require('../middlewares/setOrgRls');

router.use(auth, setOrgRls, limiter);

router.get('/', requireRole('super_admin', 'admin'), getMyOrganization);
router.post('/', requireRole('super_admin'), createOrganization);
module.exports = router;
