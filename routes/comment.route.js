import {Router} from 'express'
// import { isAuthenticated } from '../middlewares/auth.js'
import { Comment } from '../models/comment.model.js'
import { User } from '../models/user.model.js'


const router = Router()

// router.use(isAuthenticated)

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findOneAndDelete({ _id: id }); // Find and delete comment by its id

        if (!comment) {
            return res.json({ message: 'Comment Not Found', status: false });
        }

        return res.json({ message: 'Comment deleted successfully', status: true });
    } catch (error) {
        return res.json({ message: error.message, status: false });
    }
});

router.get('/user/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const userData = await User.findOne({_id: id}).select('-password -favoriteNews');
        if(!userData) return res.json({message: 'No user found', status: false})
        return res.json({data: userData, status: true})
    } catch (error) {
        return res.json({message: error.message, status: false})
    }
})

router.post('/new', async(req, res)=>{
    try {
        const {userID, articleID, message} = req.body;
        const newComment = await Comment.create({
            userID, message, articleID
        })
        return res.json({
            message: 'Comment Created Successfully',
            data: newComment,
            status: true
        })
    } catch (error) {
        return res.json({
            message: error.message,
            status: false
        })
    }
})

router.get('/all/:id', async(req, res)=>{
    try {
        const id = req.params.id
        // console.log(id)
        const comments = await Comment.find({articleID: id}).sort({ created_at: -1 });
        return res.json({data: comments, status: true})
    } catch (error) {
        return res.json({message: error.message, status: false})
    }
})

router.get('/:id', async(req, res)=>{
    try {
        const id = req.params.id
        const comment = await Comment.findOne({_id: id})
        if(!comment) return res.json({message: 'No data found', status: false});
        return res.json({status: true, data: comment})
    } catch (error) {
        return res.json({message: error.message, status: false})
    }
})
export default router;