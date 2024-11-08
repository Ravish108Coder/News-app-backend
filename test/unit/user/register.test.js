import request from 'supertest';
import { app } from '../../../app.js';
import mongoose from 'mongoose';
import { User } from '../../../models/user.model.js';

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await User.deleteOne({ email: 'aksharma@gmail.com' });
        await mongoose.connection.close();
    });

    it('should register a new user successfully', async () => {
        const newUser = {
            username: 'AK Sharma',
            email: 'aksharma@gmail.com',
            password: 'kuch bhi',
        };

        const response = await request(app).post('/api/auth/register').send(newUser);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User Registered Successfully');

        const user = await User.findOne({ email: newUser.email });
        expect(user).not.toBeNull();
        expect(user.username).toBe(newUser.username);
    });

    it('should return an error if required fields are missing', async () => {
        const newUser = { email: 'aksharma@gmail.com', password: 'kuch bhi' };

        const response = await request(app).post('/api/auth/register').send(newUser);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('All input fields are required');
    });

    it('should return an error if the user already exists', async () => {
        const existingUser = {
            username: 'AK Sharma',
            email: 'aksharma@gmail.com',
            password: 'kuch bhi',
        };

        await request(app).post('/api/auth/register').send(existingUser);

        // Now try to register the same user again
        const response = await request(app).post('/api/auth/register').send(existingUser);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('User already exists');
    });
});
