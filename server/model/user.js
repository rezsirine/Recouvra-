const connection = require("./index")
const mongoose = require("mongoose")


    const userSchema = new mongoose.Schema({
        username: {
            type : String,
            required:true,
            maxlength: 45
        },
        email: {
            type : String,
            required:false,
            unique: true,
        },
        phone_number: {
            type : Number,
            required:false,
            unique: true,
        },
        password: {
            type : String,
            required:true
        },
        role: {
            type : String,
            enum:['admin','client','seller'],
            required:true
        }
    })


module.exports = mongoose.model("User,userSchema");