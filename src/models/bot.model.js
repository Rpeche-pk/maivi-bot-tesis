import mongoose from 'mongoose';

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
    versionKey: false
});

const userSchema = mongoose.model('user', UserSchema);
export default userSchema;