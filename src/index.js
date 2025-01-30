require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/items", itemRoutes);

sequelize.sync({ force: true }).then(() => {
    console.log("Base de données synchronisée !");
    app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
});
