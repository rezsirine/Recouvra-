const connection = require("./index");
const { Sequelize, DataTypes } = require("sequelize");

const RecoveryAction = connection.define("recoveryAction", {
    type: {
        type: DataTypes.ENUM('call', 'email', 'meeting'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    outcome: {
        type: DataTypes.ENUM('pending', 'successful', 'failed', 'rescheduled'),
        defaultValue: 'pending'
    },
    nextAction: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Clés étrangères
    invoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'invoices',
            key: 'id'
        }
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = RecoveryAction;