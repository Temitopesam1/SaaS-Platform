const rateLimit = require('express-rate-limit');

function createOrgRateLimiter(windowMs = 60 * 1000, max = 2) {
  // console.log(req.user.organization_id)
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => req.user.organization_id || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests. Please try again later.'
  });
}

module.exports = { createOrgRateLimiter };
