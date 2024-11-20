import mongoose from 'mongoose';
import chalk from "chalk";
import {CONSTANTS} from "../config/index.js";


const { Schema } = mongoose;

const UserSchema = new Schema({
    phoneNumber: {
        type: String,
    },
    pushName: {
        type: String,
    },
    device: {
        type: String,
    },
    token: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: CONSTANTS.NAME_COLLECTION
});

const userSchema = mongoose.model('users', UserSchema);
userSchema.createCollection().then((collection) => {
    console.log(chalk.green('<<<<<< Collection created >>>>>>'));
});
export default userSchema;
