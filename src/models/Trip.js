import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Trip = sequelize.define("Trip", {
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true, 
    },
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true, 
    },
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

export default Trip;