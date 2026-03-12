require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

// Routes API
const userRoute = require("./routes/user.routes");
const clientRoute = require("./routes/client.routes");
const invoiceRoute = require("./routes/invoice.routes");
const recoveryRoute = require("./routes/recovery.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// EJS + layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);

// Swagger
setupSwagger(app);

// API Routes
app.use("/api/user", userRoute);
app.use("/api/client", clientRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/recovery", recoveryRoute);

// ===== FRONTEND ROUTES (EJS) =====
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
  res.render("pages/auth/login", { layout: false, error: null, success: null });
});

app.get("/forgot-password", (req, res) => {
  res.render("pages/auth/forgot-password", { layout: false, error: null, success: null });
});

app.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("pages/auth/reset-password", { layout: false, token, error: null });
});

app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard/index", { title: "Tableau de bord", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/clients", (req, res) => {
  res.render("pages/clients/index", { title: "Clients", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/invoices", (req, res) => {
  res.render("pages/invoices/index", { title: "Factures", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/recovery", (req, res) => {
  res.render("pages/recovery/index", { title: "Recouvrement", user: { name: "Utilisateur", role: "agent" } });
});

app.get("/logout", (req, res) => res.redirect("/login"));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;