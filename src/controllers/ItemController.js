import express from "express";
import Item from "../models/Item.js";
import Trip from "../models/Trip.js";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Schéma de validation pour un item
const itemSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
  tripId: z.number().int().positive(),
});

// Ajouter un item à un voyage
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, quantity, tripId } = itemSchema.parse(req.body);

    // Vérifier si le voyage appartient bien à l'utilisateur connecté
    const trip = await Trip.findOne({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(403).json({ message: "Accès interdit au voyage" });

    const item = await Item.create({ name, quantity, tripId });
    res.status(201).json({ message: "Item ajouté.", item });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    res.status(400).json({ error: error.errors || error.message });
  }
});

// Récupérer tous les items d'un voyage
router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    // Vérifier si le voyage appartient à l'utilisateur
    const trip = await Trip.findOne({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(403).json({ message: "Accès interdit au voyage" });

    const items = await Item.findAll({ where: { tripId } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer un item par son ID
router.get("/item/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: { model: Trip, where: { userId: req.user.id } },
    });

    if (!item) return res.status(404).json({ message: "Item non trouvé." });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Modifier un item
router.put("/item/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: { model: Trip, where: { userId: req.user.id } },
    });

    if (!item) return res.status(404).json({ message: "Item non trouvé." });

    const updatedData = itemSchema.partial().parse(req.body);
    await item.update(updatedData);

    res.json({ message: "Item mis à jour.", item });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

// Supprimer un item
router.delete("/item/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: { model: Trip, where: { userId: req.user.id } },
    });

    if (!item) return res.status(404).json({ message: "Item non trouvé." });

    await item.destroy();
    res.json({ message: "Item supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;