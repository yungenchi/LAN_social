module.exports = (sequelize, DataTypes) =>
  sequelize.define("deprecate_post", {
    id: {
      type: DataTypes.INTEGER,
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
    timestamps: false
  });
