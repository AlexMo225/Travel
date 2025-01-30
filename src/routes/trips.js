const express = require("express");
const Trip = require("../models/Trip");
const { z } = require("zod");

const router = express.Router();

const tripSchema = z.object({
    destination: z.string(),
    startDate: z.string(),
    endDate: z.string(),
});

//Créer un voyage
router.post("/", async (req, res) => {
    try {
        console.log("Données reçues :", req.body); // Vérifier ce qui est reçu

        const { destination, startDate, endDate, userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "UserId est obligatoire" });
        }

        const trip = await Trip.create({ destination, startDate, endDate, UserId: userId });
        res.status(201).json({ message: "Voyage créé.", trip });
    } catch (error) {
        console.error("Erreur lors de la création du voyage :", error);
        res.status(500).json({ error: error.message });
    }
});


//Lister les voyages
router.get("/", async (req, res) => {
    const trips = await Trip.findAll();
    res.json(trips);
});

module.exports = router;
