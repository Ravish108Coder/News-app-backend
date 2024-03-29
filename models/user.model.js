import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar: {
        type: String, // cloudinary url
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    favoriteNews:{
        type: Array
    }
})

export const User = mongoose.model('User', UserSchema)