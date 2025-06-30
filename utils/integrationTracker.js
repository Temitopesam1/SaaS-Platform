const { IntegrationStatus } = require('../models');

async function trackSuccess(organization_id, provider) {
  await IntegrationStatus.upsert({
    organization_id,
    provider,
    last_sync_at: new Date(),
    last_sync_status: 'success',
    failure_count: 0,
    last_error: null
  }, { returning: false });
}

async function trackFailure(organization_id, provider, error) {
  const existing = await IntegrationStatus.findOne({ where: { organization_id, provider } });

  await IntegrationStatus.upsert({
    organization_id,
    provider,
    last_sync_at: new Date(),
    last_sync_status: 'failed',
    failure_count: existing ? existing.failure_count + 1 : 1,
    last_error: error.message
  }, { returning: false });
}

module.exports = { trackSuccess, trackFailure };
