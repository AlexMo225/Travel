const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Créer un voyage
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, destination } = req.body;
        if (!name || !destination) {
            return res.status(400).json({ error: "Le nom et la destination sont requis." });
        }
        const trip = await Trip.create({ name, destination, userId: req.user.id });
        res.status(201).json({ message: "Voyage ajouté.", trip });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer tous les voyages d'un utilisateur
router.get("/", authMiddleware, async (req, res) => {
    try {
        const trips = await Trip.findAll({ where: { userId: req.user.id } });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;