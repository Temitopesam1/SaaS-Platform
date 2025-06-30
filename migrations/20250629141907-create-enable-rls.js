'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enable RLS and add policies for each table
    await queryInterface.sequelize.query(`
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      CREATE POLICY org_isolation_users ON users
        USING (organization_id::text = current_setting('app.current_organization_id', true));

      ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
      CREATE POLICY org_isolation_audit_logs ON audit_logs
        USING (organization_id::text = current_setting('app.current_organization_id', true));

      ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
      CREATE POLICY org_isolation_webhook_events ON webhook_events
        USING (organization_id::text = current_setting('app.current_organization_id', true));

      ALTER TABLE integration_statuses ENABLE ROW LEVEL SECURITY;
      CREATE POLICY org_isolation_integration_statuses ON integration_statuses
        USING (organization_id::text = current_setting('app.current_organization_id', true));
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users DISABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS org_isolation_users ON users;

      ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS org_isolation_audit_logs ON audit_logs;

      ALTER TABLE webhook_events DISABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS org_isolation_webhook_events ON webhook_events;

      ALTER TABLE integration_statuses DISABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS org_isolation_integration_statuses ON integration_statuses;
    `);
  }
};