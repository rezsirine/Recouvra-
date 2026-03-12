const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recouvra+ API",
      version: "1.0.0",
      description: "API REST de gestion du recouvrement de factures impayées",
    },
    servers: [{ url: "http://localhost:5000/api", description: "Serveur de développement" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone_number: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["agent", "manager", "admin"] },
          },
        },
        Client: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            company: { type: "string" },
            siret: { type: "string" },
            address: { type: "string" },
          },
        },
        Invoice: {
          type: "object",
          properties: {
            number: { type: "string" },
            client: { type: "string" },
            amount: { type: "number" },
            dueDate: { type: "string", format: "date" },
            status: { type: "string", enum: ["unpaid", "paid", "overdue", "pending"] },
            paidAmount: { type: "number" },
            description: { type: "string" },
          },
        },
        RecoveryAction: {
          type: "object",
          properties: {
            invoice: { type: "string" },
            type: { type: "string", enum: ["call", "email", "meeting"] },
            description: { type: "string" },
            date: { type: "string", format: "date" },
            outcome: { type: "string", enum: ["pending", "successful", "failed", "rescheduled"] },
            nextAction: { type: "string", format: "date" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { background-color: #1e3a5f; }",
    customSiteTitle: "Recouvra+ API Docs",
  }));
};

module.exports = setupSwagger;