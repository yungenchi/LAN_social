module.exports = (sequelize, DataTypes) =>
  sequelize.define("admin_user", {
    username: {
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    password_hash: {
      type: DataTypes.STRING(96),
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
  }, {
    timestamps: false
  });
