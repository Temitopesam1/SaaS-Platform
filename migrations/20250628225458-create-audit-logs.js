'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'organizations', key: 'id' }
      },
      actor_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' }
      },
      action: Sequelize.STRING,
      resource_type: Sequelize.STRING,
      resource_id: Sequelize.UUID,
      before_state: Sequelize.JSONB,
      after_state: Sequelize.JSONB,
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  }
};
