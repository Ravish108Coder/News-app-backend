import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";  // Add validator for input sanitization and validation
import DOMPurify from "isomorphic-dompurify";  // XSS prevention (purifies HTML strings)

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
          return res.status(400).json({ status: false, message: 'All fields are required' });
        }
          // Simple XSS protection for username (basic example)
          const sanitizedUsername = username.replace(/<[^>]*>/g, '');  // Strip HTML tags
      
          // Prevent NoSQL injection in email field by checking for problematic characters
          if (typeof email === 'object' || email.includes('$')) {
            return res.status(400).json({ status: false, message: 'Invalid email format' });
          }
      
          const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.]/g, '');  // Basic sanitization for email
      
          // Simulate further processing like saving to DB
          res.status(200).json({
            status: true,
            message: 'User Registered Successfully',
            user: {
              username: sanitizedUsername,
              email: sanitizedEmail
            }
          });
        } catch (error) {
          // Handle unexpected errors gracefully
          console.error('Error during registration:', error);
          return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'All input fields are required' });
        }

        // Sanitize and validate inputs
        const sanitizedEmail = validator.normalizeEmail(email);
        const sanitizedPassword = DOMPurify.sanitize(password);

        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({ status: false, message: 'Invalid email format' });
        }

        let user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
            return res.status(400).json({ status: false, message: 'User not registered' });
        }

        const isPasswordMatching = await bcrypt.compare(sanitizedPassword, user.password);
        if (!isPasswordMatching) {
            return res.status(400).json({ status: false, message: 'Email or Password is incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        user.password = undefined;

        res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.PROD_ENV === "Development" ? "lax" : "none",
                secure: process.env.PROD_ENV === "Development" ? false : true,
            })
            .json({ status: true, message: 'User Login Successfully', user: user, token: token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const verifyController = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(400).json({ status: false, message: 'User not logged in' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(400).json({ status: false, message: 'Invalid token' });
        }

        const user = await User.findById(verified.id).select("-password -favoriteNews");
        if (!user) {
            return res.status(400).json({ status: false, message: 'User not found' });
        }

        return res.status(200).json({ status: true, message: 'User verified', token: token, user: user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", '', {
                httpOnly: true,
                expires: new Date(0),
                sameSite: process.env.PROD_ENV === "Development" ? "lax" : "none",
                secure: process.env.PROD_ENV === "Development" ? false : true,
            })
            .json({ status: true, message: 'User Logged out Successfully' });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};
