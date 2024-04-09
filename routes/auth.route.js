import { Router } from 'express'
const router = Router()
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { loginController, logoutController, registerController, verifyController } from '../controllers/auth.controller.js';

router.post('/register', registerController)

router.post('/login', loginController)

router.get('/verify', verifyController)

router.get('/logout', logoutController)

export default router;