const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../utils/accessControl');
const { listUsers, createUser } = require('../controllers/userController');
const { createOrgRateLimiter } = require('../middlewares/rateLimiter');
const limiter = createOrgRateLimiter();
const { createUserSchema } = require('../validators/userValidator');
const { validateBody } = require('../middlewares/validate');
const setOrgRls = require('../middlewares/setOrgRls');

router.use(auth, setOrgRls, limiter);


router.get('/', requireRole('admin'), listUsers);
router.post('/', requireRole('admin'), validateBody(createUserSchema), createUser);

module.exports = router;
