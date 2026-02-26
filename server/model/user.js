const connection = require("./index")
const mongoose = require("mongoose")


    const userSchema = new mongoose.Schema({
        username: {
            type : STRING,
            required:true,
            maxlength: 45
        },
        email: {
            type : STRING,
            required:false,
            unique: true,
        },
        phone_number: {
            type : Number,
            required:false,
            unique: true,
        },
        password: {
            type : STRING,
            required:true
        },
        role: {
            type : String,
            enum:['admin','client','seller'],
            required:true
        }
    })


module.exports = mongoose.model("User,userSchema");