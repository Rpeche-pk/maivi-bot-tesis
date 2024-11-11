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

export default mongoose.model('user', UserSchema);