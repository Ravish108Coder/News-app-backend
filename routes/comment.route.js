import { Router } from 'express';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import sanitizeHtml from 'sanitize-html';
import mongoose from 'mongoose';

const router = Router();

// Helper function to validate ObjectId format
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format to prevent injection attempts
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid comment ID', status: false });
        }
        
        const comment = await Comment.findByIdAndDelete(id); // Safely find and delete by ID
        if (!comment) {
            return res.status(404).json({ message: 'Comment Not Found', status: false });
        }

        return res.json({ message: 'Comment deleted successfully', status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid user ID', status: false });
        }

        const userData = await User.findById(id).select('-password -favoriteNews');
        if (!userData) return res.status(404).json({ message: 'No user found', status: false });

        return res.json({ data: userData, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
});

router.post('/new', async (req, res) => {
    try {
        const { userID, articleID, message } = req.body;

        // Validate ObjectId format
        if (!isValidObjectId(userID) || !isValidObjectId(articleID)) {
            return res.status(400).json({ message: 'Invalid IDs provided', status: false });
        }

        // Sanitize message to prevent XSS
        const sanitizedMessage = sanitizeHtml(message);

        const newComment = await Comment.create({
            userID,
            articleID,
            message: sanitizedMessage,
        });

        return res.json({
            message: 'Comment Created Successfully',
            data: newComment,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
});

router.get('/all/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid article ID', status: false });
        }

        const comments = await Comment.find({ articleID: id }).sort({ created_at: -1 });
        return res.json({ data: comments, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid comment ID', status: false });
        }

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: 'No data found', status: false });

        return res.json({ status: true, data: comment });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
});

export default router;
