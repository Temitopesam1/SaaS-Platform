const { AuditLog } = require('../models');

async function getAuditLogs(req, res) {
  try {
    const orgId = req.user.organization_id;
    const logs = await AuditLog.findAll({ where: { organization_id: orgId }, order: [['timestamp', 'DESC']] });
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAuditLogs };