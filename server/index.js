const express = require('express');
const cors = require('cors');

// Import des routes
const userRoute = require("./routes/user.routes")
const clientRoute = require("./routes/client.routes")
const invoiceRoute = require("./routes/invoice.routes")
const recoveryRoute = require("./routes/recovery.routes")

// IMPORTANT : Importer la connexion MongoDB
require('./model/index');  // ← Ceci exécutera la connexion

const port = 5000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoute)
app.use("/api/client", clientRoute)
app.use("/api/invoice", invoiceRoute)
app.use("/api/recovery", recoveryRoute)

app.listen(port, ()=> {
console.log(`✅ listening on ${port}`);
});