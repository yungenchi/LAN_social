module.exports = (sequelize, DataTypes) => 
    sequelize.define("stats_users", {
        username: {
            type: DataTypes.STRING(32),
            primaryKey: true
        },
        date: {
            type: DataTypes.DATEONLY,
            primaryKey: true
        },
        login: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        profileVisits: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        followed: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        createdAt: true,
        updatedAt: false,
        createdAt: "date"
    });