const express = require("express");
const Item = require("../models/Item");
const { z } = require("zod");

const router = express.Router();

// 📌 Schéma de validation pour un item
const itemSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    tripId: z.number(),
});

//  Ajouter un item
router.post("/", async (req, res) => {
    try {
        console.log("Données reçues :", req.body); // Ajoute cette ligne pour voir les données reçues

        const { name, quantity, tripId } = req.body;
        const item = await Item.create({ name, quantity, TripId: tripId });

        res.status(201).json({ message: "Item ajouté.", item });
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        res.status(400).json({ error: error.message });
    }
});

//  Récupérer un item par son ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item non trouvé." });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

//  Modifier un item
router.put("/:id", async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item non trouvé." });
        }
        
        // Validation des nouvelles données
        const updatedData = itemSchema.partial().parse(req.body);

        await item.update(updatedData);
        res.json({ message: "Item mis à jour.", item });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un item
router.delete("/:id", async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item non trouvé." });
        }
        await item.destroy();
        res.json({ message: "Item supprimé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
