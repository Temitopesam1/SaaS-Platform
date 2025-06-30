// migrations/20240628-create-webhook-events.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('webhook_events', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      event_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        references: { model: 'organizations', key: 'id' }
      },
      provider: Sequelize.STRING,
      event_type: Sequelize.STRING,
      payload: Sequelize.JSONB,
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      last_error: Sequelize.TEXT,
      next_retry_at: Sequelize.DATE,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('webhook_events');
  }
};
