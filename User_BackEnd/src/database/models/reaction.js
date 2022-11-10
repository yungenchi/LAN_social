module.exports = (sequelize, DataTypes) =>
  sequelize.define("reaction", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    creator: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: true
  });
