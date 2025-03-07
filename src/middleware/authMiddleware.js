import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token manquant");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentification requise", error: error.message });
  }
};

export default authMiddleware;