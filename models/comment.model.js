import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    // user ref, comment, likes
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true
    },
    articleID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    likes: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const Comment = mongoose.model('comment', CommentSchema)
