import express from "express";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import itemRoutes from "./routes/items.js";

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/items", itemRoutes);

// Route d'accueil
app.get("/", (req, res) => {
  res.status(200).send("Bienvenue sur l'API Travel Packing List !");
});

const PORT = process.env.PORT || 3000;

// Empêcher Jest de lancer un serveur pendant les tests
if (process.env.NODE_ENV !== "test") {
  sequelize.sync().then(() => {
    console.log("Base de données synchronisée !");
    app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
  });
}

export default app; 