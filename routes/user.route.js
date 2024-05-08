import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { sendMail } from '../utils/sendMail.js';
import { upload } from '../middlewares/multer.js';
import cloudinary from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { addToFavoriteController, deleteAccountController, deleteFromFavoriteController, favoriteArticlesController, getProfileController, isAlreadyFavoriteController, sendMailController, updateProfileController, uploadController } from '../controllers/user.controller.js';
const router = Router()

router.use(isAuthenticated)

// router.post('/upload', upload.single('image'), uploadController);

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' });
      }
  
      const filePath = req.file.path
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto"
      });
      console.log(result);
  
      const user = req.user;
      user.avatar = result.url;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Pic Uploaded Successfully",
        data: result,
        user: user
      });
    } catch (err) {
      if (err.http_code === 499) {
        console.error('Request to Cloudinary timed out');
        return res.status(500).json({
          success: false,
          message: "Image upload timed out. Please try again or check your internet connection."
        });
      } else {
        console.log('hi',err);
        return res.status(500).json({
          success: false,
          message: "Error in uploading image"
        });
      }
    }
  })

router.get('/favoriteArticles', favoriteArticlesController)

router.post('/deleteFromFavorite', deleteFromFavoriteController)

router.post('/isAlreadyFavorite', isAlreadyFavoriteController)

router.post('/addToFavorite', addToFavoriteController)

router.get('/profile', getProfileController)

router.put('/profile', updateProfileController)

router.delete('/deleteAccount', deleteAccountController)

router.post('/sendmail', sendMailController)

export default router;