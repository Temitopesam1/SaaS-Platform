'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    role: DataTypes.STRING,
    external_user_ids: DataTypes.JSONB,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'suspended']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    last_login: DataTypes.DATE
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = function(models) {
    User.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization'
    });
    User.hasMany(models.AuditLog, {
      foreignKey: 'actor_id',
      as: 'actions'
    });
  };

  return User;
};
