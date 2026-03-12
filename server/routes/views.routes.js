const express = require("express");
const router  = express.Router();

// ── Redirect racine ──
router.get("/", (req, res) => res.redirect("/login"));

// ── Pages Auth (sans layout) ──
router.get("/login",           (req, res) => res.render("auth/login",           { layout: false, title: "Connexion" }));
router.get("/signup",          (req, res) => res.render("auth/signup",          { layout: false, title: "Inscription" }));
router.get("/forgot-password", (req, res) => res.render("auth/forgot-password", { layout: false, title: "Mot de passe oublié" }));
router.get("/reset-password",  (req, res) => res.render("auth/reset-password",  { layout: false, title: "Réinitialisation", token: req.query.token || "" }));

// ── Pages App (avec layout layouts/main.ejs) ──
// user est passé pour que le layout puisse afficher le rôle/nom
// Le vrai nom est mis à jour dynamiquement par main.js via /api/user/me
const defaultUser = { name: "Utilisateur", role: "agent" };

router.get("/dashboard", (req, res) => res.render("dashboard", { title: "Tableau de bord", page: "dashboard", user: defaultUser }));
router.get("/clients",   (req, res) => res.render("clients",   { title: "Clients",          page: "clients",   user: defaultUser }));
router.get("/invoices",  (req, res) => res.render("invoices",  { title: "Factures",         page: "invoices",  user: defaultUser }));
router.get("/recovery",  (req, res) => res.render("recovery",  { title: "Recouvrement",     page: "recovery",  user: defaultUser }));

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
