'use strict';
module.exports = (sequelize, DataTypes) => {
  const WebhookEvent = sequelize.define('WebhookEvent', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    event_id: {
      type: DataTypes.STRING,
      unique: true
    },
    organization_id: DataTypes.UUID,
    provider: DataTypes.STRING,
    event_type: DataTypes.STRING,
    payload: DataTypes.JSONB,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_error: DataTypes.TEXT,
    next_retry_at: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    tableName: 'webhook_events',
    timestamps: false
  });

  WebhookEvent.associate = function(models) {
    WebhookEvent.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization'
    });
  };

  return WebhookEvent;
};
