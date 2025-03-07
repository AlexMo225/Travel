import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Enregistrement d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
    }

    const user = await User.create({ email, password });
    res.status(201).json({ message: "Utilisateur créé.", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connexion d'un utilisateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;