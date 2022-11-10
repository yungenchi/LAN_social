module.exports = (sequelize, DataTypes) =>
  sequelize.define("post", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parent_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    }
  }, {
    timestamps: true
  });
