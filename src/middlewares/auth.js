const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(payload.role === "super_admin") {
      req.user = {
        id: payload.sub,
        role: payload.role
      };
      return next();
    }
    const user = await User.findOne({ where: { id: payload.sub } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = {
      id: user.id,
      role: user.role,
      organization_id: user.organization_id
    };

    return next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
