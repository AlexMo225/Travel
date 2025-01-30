const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Créer un voyage
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, destination } = req.body;
        const trip = await Trip.create({ name, destination, userId: req.user.id });

        res.status(201).json({ message: "Voyage ajouté.", trip });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer tous les voyages d'un utilisateur
router.get("/", authMiddleware, async (req, res) => {
    const trips = await Trip.findAll({ where: { userId: req.user.id } });
    res.json(trips);
});

module.exports = router;
