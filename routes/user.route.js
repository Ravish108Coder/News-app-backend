import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcryptjs';
const router = Router()

router.use(isAuthenticated)

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
        const {status, msg} = sendMail(email, subject, message)
        if(!status){
            throw new Error(msg)
        }
        return res.status(200).json({ status: true, message: 'Mail sent successfully' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

export default router;