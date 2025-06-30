const { AuditLog } = require('../models');

async function logAudit({ actorId, organizationId, action, resourceType, resourceId, before, after }) {
  try {
    await AuditLog.create({
      actor_id: actorId,
      organization_id: organizationId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      before_state: before,
      after_state: after
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAudit };
