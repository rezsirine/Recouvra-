const connection = require("./index");
const { Sequelize, DataTypes } = require("sequelize");
const Client = require("./client");
const User = require("./user");

const Invoice = connection.define("invoice", {
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'overdue', 'pending'),
        defaultValue: 'unpaid',
        allowNull: false
    },
    paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Clés étrangères (à définir dans index.js)
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: (invoice) => {
            // Mettre à jour le statut automatiquement
            if (invoice.paidAmount >= invoice.amount) {
                invoice.status = 'paid';
                invoice.paidAt = new Date();
            } else if (new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid') {
                invoice.status = 'overdue';
            }
        }
    }
});

module.exports = Invoice;