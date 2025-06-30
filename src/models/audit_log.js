'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    actor_id: {
      type: DataTypes.UUID
    },
    action: DataTypes.STRING,
    resource_type: DataTypes.STRING,
    resource_id: DataTypes.UUID,
    before_state: DataTypes.JSONB,
    after_state: DataTypes.JSONB,
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    tableName: 'audit_logs',
    timestamps: false
  });

  AuditLog.associate = function(models) {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'actor_id',
      as: 'actor'
    });
    AuditLog.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization'
    });
  };

  return AuditLog;
};
