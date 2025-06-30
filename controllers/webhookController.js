const { WebhookEvent } = require('../models');
const { enqueueWebhookJob } = require('../jobs/queue');

async function receiveWebhook(req, res) {
  try {
    const { provider } = req.params;
    // Accept either a single event or an array of events
    const events = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const eventData of events) {
      const { event_type, event_id, organization_id, data } = eventData;

      const existing = await WebhookEvent.findOne({ where: { event_id } });

      if (existing) {
        if (existing.status === 'processed') {
          results.push({ event_id, status: 'already_processed' });
          continue;
        }
        if (['retry', 'failed'].includes(existing.status)) {
          await enqueueWebhookJob(existing);
          results.push({ event_id, status: 'retrying' });
          continue;
        }
        results.push({ event_id, status: 'in_progress' });
        continue;
      }

      // Create + queue event
      const event = await WebhookEvent.create({
        event_id,
        provider,
        event_type,
        organization_id,
        payload: data
      });

      await enqueueWebhookJob(event);
      results.push({ event_id, status: 'queued' });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error receiving webhook:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

module.exports = { receiveWebhook };