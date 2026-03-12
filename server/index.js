require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");

const userRoute = require("./routes/user.routes");
const clientRoute = require("./routes/client.routes");
const invoiceRoute = require("./routes/invoice.routes");
const recoveryRoute = require("./routes/recovery.routes");
const viewsRoute = require("./routes/views.routes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use("/css", express.static(path.join(__dirname, "style")));
app.use("/js",  express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);

// Swagger
setupSwagger(app);

// Views routes
app.use('/', viewsRoute);

// API
app.use("/api/user", userRoute);
app.use("/api/client", clientRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/recovery", recoveryRoute);

// =====  =====
// === ROUTES POST POUR LES FORMULAIRES ===
const User = require('./model/user'); // Ajoutez en haut du fichier si pas déjà fait
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Utilisez votre modèle User directement
    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { 
        layout: false, 
        error: 'Email ou mot de passe incorrect',
        success: null 
      });
    }
    
    // Générer le token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "secret", 
      { expiresIn: "7d" }
    );
    
    // Option 1: Cookie HTTP only (plus sécurisé)
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    // Option 2: Passer le token en query (pour le localStorage côté client)
    // res.redirect(`/dashboard?token=${token}`);
    
    // Redirection simple
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error(error);
    res.render('auth/login', { 
      layout: false, 
      error: 'Erreur de connexion',
      success: null 
    });
  }
});
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
  res.render("auth/login", { layout: false, error: null, success: null });
});

app.get("/register", (req, res) => {
  res.render("auth/signup", { layout: false, error: null, success: null });
});

app.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password", { layout: false, error: null, success: null });
});

app.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("auth/reset-password", { layout: false, token, error: null });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Tableau de bord", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/clients", (req, res) => {
  res.render("clients", { title: "Clients", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/invoices", (req, res) => {
  res.render("invoices", { title: "Factures", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/recovery", (req, res) => {
  res.render("recovery", { title: "Recouvrement", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/logout", (req, res) => res.redirect("/login"));

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;