const express = require('express')
const { signUp, loginByEmail, loginByPhoneNumber, handleToken } = require('../controller/user.controller')
const router = express.Router()

router.post("/signup", signUp)
router.post("/loginByEmail", loginByEmail)
router.post("/loginByPhoneNumber", loginByPhoneNumber)
router.post("/token", handleToken)

module.exports = router