import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcryptjs';
import { upload } from '../middlewares/multer.js';
import cloudinary from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { addToFavoriteController, deleteAccountController, deleteFromFavoriteController, favoriteArticlesController, getProfileController, isAlreadyFavoriteController, sendMailController, updateProfileController, uploadController } from '../controllers/user.controller.js';
const router = Router()

router.use(isAuthenticated)

router.post('/upload', upload.single('image'), uploadController);

router.get('/favoriteArticles', favoriteArticlesController)

router.post('/deleteFromFavorite', deleteFromFavoriteController)

router.post('/isAlreadyFavorite', isAlreadyFavoriteController)

router.post('/addToFavorite', addToFavoriteController)

router.get('/profile', getProfileController)

router.put('/profile', updateProfileController)

router.delete('/deleteAccount', deleteAccountController)

router.post('/sendmail', sendMailController)

export default router;