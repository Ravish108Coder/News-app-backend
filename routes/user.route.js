import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcryptjs';
import { upload } from '../middlewares/multer.js';
import cloudinary from '../utils/cloudinary.js';
const router = Router()

router.use(isAuthenticated)

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' })
        };
        const result = await cloudinary.uploader.upload(req.file.path);

        const user = req.user;
        user.avatar = result.url;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Pic Uploaded Successfully",
            data: result,
            user: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error in uploading image"
        });
    }
});

router.get('/favoriteArticles', async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('User not found')
        }

        return res.status(200).json({ status: true, message: 'All favorite news', articles: user.favoriteNews })

    }catch(error){
        return res.status(500).json({ status: false, message: error.message })
    }
})

router.post('/deleteFromFavorite', async (req, res) => {
    try {
        const article = req.body;
        const user = req.user;
        const newFavoriteNews = user.favoriteNews.filter((news) => news.uuid !== article.uuid);
        user.favoriteNews = newFavoriteNews;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Removed from favoriteNews successfully"
        })
    } catch (error) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error in uploading image"
        });
    }
})

router.post('/isAlreadyFavorite', async (req, res) => {
    try {
        const article = req.body;
        const user = req.user;
        const isArticleExist = user.favoriteNews.find((news) => news.uuid === article.uuid);
        if (isArticleExist) {
            return res.status(200).json({
                success: true,
                message: "Article is already in favoriteNews",
                data: isArticleExist
            })
        } else {
            return res.status(200).json({
                success: false,
                message: "Article is not in favoriteNews",
                data: isArticleExist
            })
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error in checking favorite news or not"
        });
    }
})

router.post('/addToFavorite', async (req, res) => {
    try {
        const article = req.body;
        const user = req.user;

        const isArticleExist = user.favoriteNews.find((news) => news.uuid === article.uuid);
        if (isArticleExist) {
            return res.status(200).json({
                success: true,
                message: "Added to favoriteNews successfully"
            })
        }

        user.favoriteNews.push(article);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Added to favoriteNews successfully"
        })
    } catch (error) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error in uploading image"
        });
    }
})

router.get('/profile', async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error('User not found')
        }

        return res.status(200).json({ status: true, message: 'User profile', data: user })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

router.put('/profile', async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('User not found')
        }
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new Error('All input fields are required')
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.name = name;
        user.email = email;
        user.password = hashPassword;
        await user.save();
        return res.status(200).json({ status: true, message: 'User profile updated', data: user })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

router.post('/sendmail', async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        if (!email || !subject || !message) {
            return res.status(400).json({ status: false, message: 'All input fields are required' })
        }
        const { status, msg } = sendMail(email, subject, message)
        if (!status) {
            throw new Error(msg)
        }
        return res.status(200).json({ status: true, message: 'Mail sent successfully' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

export default router;