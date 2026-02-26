const connection = require("./index");
const { Sequelize, DataTypes } = require("sequelize");

const Client = connection.define("client", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Clé étrangère (à définir dans index.js)
    createdById: {
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

module.exports = Client;