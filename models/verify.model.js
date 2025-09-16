const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
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
        code: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        verified : {
            type: Boolean,
            default: false,
        }
    }
);
  
const verification = mongoose.model("Verification", verificationSchema);
module.exports = verification;
  