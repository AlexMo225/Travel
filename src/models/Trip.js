const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Trip = sequelize.define("Trip", {
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    UserId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
});

User.hasMany(Trip, { foreignKey: "UserId" });
Trip.belongsTo(User, { foreignKey: "UserId" });

module.exports = Trip;
