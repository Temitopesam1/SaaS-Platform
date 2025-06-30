'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organizations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: Sequelize.STRING,
      subscription_tier: Sequelize.STRING,
      employee_limit: Sequelize.INTEGER,
      features_enabled: Sequelize.JSONB,
      webhook_endpoints: Sequelize.JSONB,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('organizations');
  }
};
