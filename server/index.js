require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const path         = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const connectDB    = require("./config/db");
const setupSwagger = require("./config/swagger");

// Routes
const userRoute     = require("./routes/user.routes");
const clientRoute   = require("./routes/client.routes");
const invoiceRoute  = require("./routes/invoice.routes");
const recoveryRoute = require("./routes/recovery.routes");
const viewsRoute    = require("./routes/views.routes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Base de données ──
connectDB();

// ── Middlewares globaux ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Fichiers statiques ──
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js",  express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public")));

// ── EJS + Layouts ──
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);

// ── Swagger ──
setupSwagger(app);

// ── Routes vues (pages HTML) ──
app.use("/", viewsRoute);

// ── Routes API ──
app.use("/api/user",     userRoute);
app.use("/api/client",   clientRoute);
app.use("/api/invoice",  invoiceRoute);
app.use("/api/recovery", recoveryRoute);

// ── Démarrage ──
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;