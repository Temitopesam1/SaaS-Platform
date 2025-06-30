const db = require('../models');

module.exports = async function setOrgRls(req, res, next) {
  if (req.user && req.user.organization_id) {
    await db.sequelize.query(
      `SET app.current_organization_id = :orgId`,
      { replacements: { orgId: req.user.organization_id } }
    );
  }
  next();
};