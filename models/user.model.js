const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            require : true,
            uniq : true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified : {
            type: Boolean,
            default: false,
        }
    } , { timestamps: true }
);

const User = mongoose.model("User" , userSchema);
module.exports = User;