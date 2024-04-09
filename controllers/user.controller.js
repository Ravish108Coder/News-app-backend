import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import { sendMail } from "../utils/sendMail.js";

export const uploadController = async (req, res) => {
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
}

export const favoriteArticlesController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('User not found')
        }

        return res.status(200).json({ status: true, message: 'All favorite news', articles: user.favoriteNews })

    }catch(error){
        return res.status(500).json({ status: false, message: error.message })
    }
}

export const deleteFromFavoriteController = async (req, res) => {
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
}

export const isAlreadyFavoriteController = async (req, res) => {
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
}

export const addToFavoriteController = async (req, res) => {
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
}

export const getProfileController = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error('User not found')
        }

        return res.status(200).json({ status: true, message: 'User profile', data: user })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

export const updateProfileController = async (req, res) => {
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
}

export const deleteAccountController = async (req, res) => {
    try {
        let user = req.user;
        const {password} = req.body;
        user = await User.findOne({email: user.email}) 
        const verified = await bcrypt.compare(password, user.password)
    
        if(!verified) return res.json({success: false, message: 'Wrong Password'});
    
        await User.deleteOne({email: user.email});
    
        return res.json({success: true, message: 'Account Deleted Successfully'})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message})
    }
}

export const sendMailController = async (req, res) => {
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
}