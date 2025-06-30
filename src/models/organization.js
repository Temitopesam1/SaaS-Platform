'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    name: DataTypes.STRING,
    subscription_tier: DataTypes.STRING,
    employee_limit: DataTypes.INTEGER,
    features_enabled: DataTypes.JSONB,
    webhook_endpoints: DataTypes.JSONB,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    tableName: 'organizations',
    timestamps: false
  });

  Organization.associate = function(models) {
    Organization.hasMany(models.User, {
      foreignKey: 'organization_id',
      as: 'users'
    });
    Organization.hasMany(models.AuditLog, {
      foreignKey: 'organization_id',
      as: 'audit_logs'
    });
    Organization.hasMany(models.WebhookEvent, {
      foreignKey: 'organization_id',
      as: 'webhook_events'
    });
  };

  return Organization;
};
