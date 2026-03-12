const jwt = require("jsonwebtoken");
const User = require("../model/user");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Chercher le token dans le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Ou dans le cookie (si tu utilises les cookies)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Non authentifié. Token manquant." });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

// Middleware de restriction par rôle
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé. Rôle insuffisant." });
    }
    next();
  };
};

module.exports = { protect, restrictTo };