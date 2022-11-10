module.exports = (sequelize, DataTypes) =>
  sequelize.define("follow", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    followedBy: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    timestamps: false
  });
