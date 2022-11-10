module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
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
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  });
