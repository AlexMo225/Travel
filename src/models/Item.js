const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Trip = require("./Trip");

const Item = sequelize.define("Item", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isTaken: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    TripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Trip,
            key: "id",
        },
        onDelete: "CASCADE", 
    },
});

Trip.hasMany(Item, { foreignKey: "TripId", onDelete: "CASCADE" });
Item.belongsTo(Trip, { foreignKey: "TripId" });

module.exports = Item;
