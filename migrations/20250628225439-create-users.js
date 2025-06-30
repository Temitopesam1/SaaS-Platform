'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'organizations', key: 'id' },
        onDelete: 'CASCADE'
      },
      role: Sequelize.STRING,
      external_user_ids: Sequelize.JSONB,
      status: Sequelize.STRING,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_login: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
