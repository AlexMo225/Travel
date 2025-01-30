const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// Inscription
router.post("/register", async (req, res) => {
    try {
        const { email, password } = registerSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "Utilisateur créé.", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Mot de passe incorrect." });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
