import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { isEmail } from "validator";
const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            validate: {
                validator: isEmail,
                message: "{VALUE} is not a valid email!",
                isAsync: false
            }
        },
        fullName: {
            type: String,
            trim: true,
            required: "Fullname is required!"
        },
        salted: {
            type: String,
            required: true
        },
        hashed: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('User', UserSchema);