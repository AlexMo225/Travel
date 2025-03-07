import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Trip from "./Trip.js";

const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, 
    },
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

export default Item;