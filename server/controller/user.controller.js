
const  {User}  = require("../model/populate");
// const {User} = require("../model/index");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv').config()
//sign up 
module.exports = {
  signUp: async (req, res) => {
    try {
      const { username, email, phone_number, password, role } = req.body;
      const find = await User.findOne({
        where: { email: email },
      });
      if (find) {
        return res.send("Email already exist");
      }
      const hashPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: username,
        email: email,
        phone_number: phone_number,
        password: hashPassword,
        role: role
      });
      return res.status(200).send('Registration successful');

    } catch (error) {
      return res.status(500).send("Server error");
    }
  },
  // login using the email
  loginByEmail: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        return res.send("User does not exist");
      }
      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        return res.send("Password Incorrect");
      }

      const token = jwt.sign(user.dataValues, dotenv.parsed.SECRET_KEY)
      res.status(200).send(token);
    }
    catch (error) {
      return res.status(500).send("Sign in error");
    }
  },
  // login using the phone_Number
  loginByPhoneNumber: async (req, res) => {
    try {
      const { phone_number, password } = req.body;
      const user = await User.findOne({ where: { phone_number: phone_number } })

      if (!user) {
        return res.send("User does not exist");
      }
      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        return res.send("Password Incorrect");
      }

      console.log(passwordValid)
      const token = jwt.sign(user.dataValues, dotenv.parsed.SECRET_KEY)
      console.log('token: ', token)
      res.status(200).send(token);
    }
    catch (error) {
      return res.status(500).send("Sign in error");
    }
  },
  getAllUsers: async (req,res)=>{
    try {
      const all = await User.findAll({include:{all:true}})
      res.status(200).send(all);
    } catch (error) {
      throw Error(error)
    }
  }
}

// verify  the token
module.exports.handleToken = (req, res) => {
  const token = req.body.token;
  if (token) {
    try {
      const verification = jwt.verify(token, process.env.SECRET_KEY);
      return res.send(verification);
    } catch (error) {
      throw error
    }
  }
   res.send("Token not found ")

};
