const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./travel_packing_list.sqlite",
});

sequelize.authenticate()
    .then(() => console.log("Connexion à SQLite réussie !"))
    .catch((err) => console.error("Erreur de connexion à SQLite :", err));

module.exports = sequelize;
