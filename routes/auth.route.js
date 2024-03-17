import { Router } from 'express'
const router = Router()
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";

router.post('/register', async (req, res) => {
    try {
        // console.log(req.body)
        const { username, email, password } = req.body;
        // console.log(username, email, password)
        if (!username || !email || !password) {
            throw new Error('All input fields are required')
        }
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists')
        }
        const hashPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            username, email, password: hashPassword
        })

        return res.status(200).json({ status: true, message: 'User Registered Successfully' })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        // console.log(email, password)
        if (!email || !password) {
            throw new Error('All input fields are required')
        }
        let user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not registered')
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) throw new Error('Email or Password is incorrect')

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        // console.log(token)
        res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.PROD_ENV === "Development" ? "lax" : "none",
            secure: process.env.PROD_ENV === "Development" ? false : true,
        })
        .json({ status: true, message: 'User Login Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: error.message, error: 'error hai' })
    }
})

router.get('/verify', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('User not logged in')
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            throw new Error('User not verified')
        }
        const user = await User.findById(verified.id).select("-password");
        if (!user) {
            throw new Error('User not found')
        }
        return res.status(200).json({ status: true, message: 'User verified', token: token, user: user})
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

router.get('/logout', async (req, res) => {
    try {
        res
        .status(200)
        .cookie("token", '', {
            httpOnly: true,
            expires: new Date(0),
            sameSite: process.env.PROD_ENV === "Development" ? "lax" : "none",
            secure: process.env.PROD_ENV === "Development" ? false : true,
        })
        .json({ status: true, message: 'User Logged out Successfully' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
})

export default router;