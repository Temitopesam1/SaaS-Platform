const { IntegrationStatus } = require('../models');

async function getIntegrationStatus(req, res) {
    try {
        const organization_id = req.user.organization_id;

        const statuses = await IntegrationStatus.findAll(
            {
                where: { organization_id },
                attributes: ['provider', 'last_sync_at', 'last_sync_status', 'failure_count']
            }
        );

        return res.json(statuses);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  
}

module.exports = { getIntegrationStatus };
