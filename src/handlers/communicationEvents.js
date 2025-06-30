const { logAudit } = require('../utils/auditLogger');
const { httpRequest } = require('../utils/circuitBreaker');
const { WebhookEvent } = require('../models');

async function handleCommunicationEvent(type, orgId, payload, eventId) {
  // Idempotency: skip if already processed
  if (eventId) {
    const existing = await WebhookEvent.findOne({ where: { event_id: eventId, status: 'processed' } });
    if (existing) return;
  }

  if (type === 'message.sent') {
    try {
      const response = await httpRequest({
        method: 'post',
        url: 'http://localhost:4003/messages',
        data: {
          recipient: payload.recipient,
          content: payload.content
        }
      });
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_MESSAGE_SENT',
        resourceType: 'message',
        resourceId: response.data.message_id,
        before: null,
        after: response.data
      });
    } catch (err) {
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_MESSAGE_SENT_FAILED',
        resourceType: 'message',
        resourceId: payload.message_id || null,
        before: null,
        after: { error: err.message }
      });
      throw err;
    }
  } else if (type === 'message.delivered') {
    await logAudit({
      actorId: null,
      organizationId: orgId,
      action: 'SYNC_MESSAGE_DELIVERED',
      resourceType: 'message',
      resourceId: payload.message_id,
      before: null,
      after: payload
    });
  } else if (type === 'message.bounced') {
    await logAudit({
      actorId: null,
      organizationId: orgId,
      action: 'SYNC_MESSAGE_BOUNCED',
      resourceType: 'message',
      resourceId: payload.message_id,
      before: null,
      after: payload
    });
  } else {
    throw new Error(`Unhandled communication event type: ${type}`);
  }
}

module.exports = { handleCommunicationEvent };
