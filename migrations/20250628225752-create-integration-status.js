'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('integration_statuses', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'organizations', key: 'id' }
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_sync_at: Sequelize.DATE,
      last_sync_status: Sequelize.STRING,
      failure_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_error: Sequelize.TEXT
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('integration_statuses');
  }
};
