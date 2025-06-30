const { logAudit } = require('../utils/auditLogger');
const { httpRequest } = require('../utils/circuitBreaker');
const { WebhookEvent } = require('../models');

async function handlePaymentEvent(type, orgId, payload, eventId) {
  // Idempotency: skip if already processed
  if (eventId) {
    const existing = await WebhookEvent.findOne({ where: { event_id: eventId, status: 'processed' } });
    if (existing) return;
  }

  if (type === 'subscription.created') {
    // Fetch subscription details from mock payment service
    try {
      const subscription = await httpRequest({
        method: 'get',
        url: `http://localhost:4002/subscriptions/${payload.subscription_id}`
      });
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_SUBSCRIPTION_CREATED',
        resourceType: 'subscription',
        resourceId: payload.subscription_id,
        before: null,
        after: subscription.data
      });
    } catch (err) {
      await logAudit({
        actorId: null,
        organizationId: orgId,
        action: 'SYNC_SUBSCRIPTION_CREATED_FAILED',
        resourceType: 'subscription',
        resourceId: payload.subscription_id,
        before: null,
        after: { error: err.message }
      });
      throw err;
    }
  } else if (type === 'payment.failed') {
    await logAudit({
      actorId: null,
      organizationId: orgId,
      action: 'SYNC_PAYMENT_FAILED',
      resourceType: 'payment',
      resourceId: payload.payment_id,
      before: null,
      after: payload
    });
  } else {
    throw new Error(`Unhandled payment event type: ${type}`);
  }
}

module.exports = { handlePaymentEvent };
