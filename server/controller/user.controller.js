const User = require("../model/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/mailer");

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });


const signUp = async (req, res) => {
  try {
    const { name, email, phone_number, password, role } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }
    
   
    const user = await User.create({
      name,
      email,
      phone_number,
      password,
      role: role || "agent"
    });
    
  
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
    
   
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("Erreur signup:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    const token = signToken(user._id, user.role);
    res.json({ message: "Connexion réussie", user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginByPhoneNumber = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    const user = await User.findOne({ phone_number }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Numéro ou mot de passe incorrect" });
    const token = signToken(user._id, user.role);
    res.json({ message: "Connexion réussie", user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    const newToken = signToken(user._id, user.role);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Aucun compte associé à cet email" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, resetToken, user.name);
    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email: " + error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const jwtToken = signToken(user._id, user.role);
    res.json({ message: "Mot de passe réinitialisé avec succès", token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { signUp, loginByEmail, loginByPhoneNumber, handleToken, forgotPassword, resetPassword, getAllUsers, getMe };