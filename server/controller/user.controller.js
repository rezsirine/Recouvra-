const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
const signUp = async (req, res) => {
    try {
        const { name, email, phone_number, password, role } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone_number }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant' });
        }

        const user = new User({
            name,
            email,
            phone_number,
            password,
            role: role || 'agent'
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Utilisateur créé',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion par email
const loginByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion par téléphone
const loginByPhoneNumber = async (req, res) => {
    try {
        const { phone_number, password } = req.body;
        
        const user = await User.findOne({ phone_number }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Numéro ou mot de passe incorrect' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Numéro ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rafraîchir token
const handleToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const newToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export NOMINATIF (important !)
module.exports = {
    signUp,
    loginByEmail,
    loginByPhoneNumber,
    handleToken,
    getAllUsers
};