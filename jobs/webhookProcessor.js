const { WebhookEvent } = require('../models');
const { trackSuccess, trackFailure } = require('../utils/integrationTracker');
const { handleUserServiceEvent } = require('../handlers/userEvents');
const { handlePaymentEvent } = require('../handlers/paymentEvents');
const { handleCommunicationEvent } = require('../handlers/communicationEvents');

const MAX_ATTEMPTS = 5;

async function processWebhook(event) {
  const { provider, event_type, organization_id, payload, event_id } = event;

  try {
    switch (provider) {
      case 'user-service':
        await handleUserServiceEvent(event_type, organization_id, payload);
        break;
      case 'payment-service':
        await handlePaymentEvent(event_type, organization_id, payload);
        break;
      case 'communication-service':
        await handleCommunicationEvent(event_type, organization_id, payload);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    await WebhookEvent.update({ status: 'processed' }, { where: { id: event.id } });
    await trackSuccess(organization_id, provider);
  } catch (err) {
    if ((event.attempts || 0) + 1 >= MAX_ATTEMPTS) {
      // Move to dead-letter queue
      await WebhookEvent.update({
        status: 'dead_letter',
        attempts: (event.attempts || 0) + 1,
        last_error: err.message
      }, { where: { id: event.id } });
      console.error(`Event ${event_id} moved to dead-letter queue after ${MAX_ATTEMPTS} attempts.`);
    } else {
      const backoff = Math.pow(2, event.attempts || 0) * 1000;

      await WebhookEvent.update({
        status: 'retry',
        attempts: (event.attempts || 0) + 1,
        last_error: err.message,
        next_retry_at: new Date(Date.now() + backoff)
      }, { where: { id: event.id } });

      await trackFailure(organization_id, provider, err);

      console.error(`Failed to process event ${event_id}: ${err.message}`);
    }
  }
}

module.exports = { processWebhook };