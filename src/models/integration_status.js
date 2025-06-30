'use strict';
module.exports = (sequelize, DataTypes) => {
  const IntegrationStatus = sequelize.define('IntegrationStatus', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    organization_id: DataTypes.UUID,
    provider: DataTypes.STRING,
    last_sync_at: DataTypes.DATE,
    last_sync_status: DataTypes.STRING,
    failure_count: DataTypes.INTEGER,
    last_error: DataTypes.TEXT
  }, {
    tableName: 'integration_statuses',
    timestamps: false
  });

  IntegrationStatus.associate = function(models) {
    IntegrationStatus.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization'
    });
  };

  return IntegrationStatus;
};
