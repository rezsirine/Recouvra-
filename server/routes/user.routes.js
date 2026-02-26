const express = require('express')
const { signUp, loginByEmail, loginByPhoneNumber, handleToken, getAllUsers } = require('../controller/user.controller')
const router = express.Router()

router.get("/getAll",getAllUsers)
router.post("/signup",signUp)
router.post("/loginByEmail",loginByEmail)
router.post("/loginByPhoneNumber",loginByPhoneNumber)
router.post("/token",handleToken)
module.exports = router