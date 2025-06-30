const { logAudit } = require('../utils/auditLogger');
const { httpRequest } = require('../utils/circuitBreaker');
const { WebhookEvent } = require('../models');

async function handleUserServiceEvent(type, orgId, payload, eventId) {
  // Idempotency: skip if already processed
  const existing = await WebhookEvent.findOne({ where: { event_id: eventId, status: 'processed' } });
  if (existing) return;

  if (type === 'user.created') {
    try {
      const externalUser = await httpRequest({
        method: 'get',
        url: `http://localhost:4001/users/${payload.user_id}`
      });
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_USER_CREATED',
        resourceType: 'user',
        resourceId: payload.user_id,
        before: null,
        after: externalUser.data
      });
    } catch (err) {
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_USER_CREATED_FAILED',
        resourceType: 'user',
        resourceId: payload.user_id,
        before: null,
        after: { error: err.message }
      });
      throw err;
    }
  } else if (type === 'user.updated') {
    await logAudit({
      actorId: null,
      organizationId: orgId,
      action: 'SYNC_USER_UPDATED',
      resourceType: 'user',
      resourceId: payload.user_id,
      before: payload.previous_values,
      after: payload.changes
    });
  } else if (type === 'user.deleted') {
    await logAudit({
      actorId: null,
      organizationId: orgId,
      action: 'SYNC_USER_DELETED',
      resourceType: 'user',
      resourceId: payload.user_id,
      before: payload,
      after: null
    });
  } else {
    throw new Error(`Unhandled user event: ${type}`);
  }
}

module.exports = { handleUserServiceEvent };
