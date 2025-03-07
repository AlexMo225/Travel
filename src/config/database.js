import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.NODE_ENV === "test" ? ":memory:" : "./travel_packing_list.sqlite",
    logging: false,
});

if (process.env.NODE_ENV !== 'test') {
    sequelize.authenticate()
        .then(() => console.log("Connexion à SQLite réussie !"))
        .catch((err) => console.error("Erreur de connexion à SQLite :", err));
}

export default sequelize;