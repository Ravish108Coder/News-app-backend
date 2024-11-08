import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user.model.js';
import bcrypt from 'bcryptjs';

jest.mock('../../../models/user.model.js');
jest.mock('bcryptjs');

describe('POST /login', () => {
    it('should login successfully', async () => {
        const user = {
            email: 'aksharma@gmail.com',
            password: 'kuch bhi',
        };

        const mockUser = {
            _id: '672b42ef1845e27bdb93bb6f',
            username: 'AK Sharma',
            email: 'aksharma@gmail.com',
            favoriteNews: [],
            createdAt: '2024-11-06T10:20:31.960Z',
            __v: 0,
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);

        const res = await request(app).post('/api/auth/login').send(user);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('User Login Successfully');
        expect(res.body.user).toMatchObject({
            _id: mockUser._id,
            username: mockUser.username,
            email: mockUser.email,
            favoriteNews: mockUser.favoriteNews,
            createdAt: mockUser.createdAt,
            __v: mockUser.__v,
        });
        expect(res.body.token).toBeDefined(); // Token should be included
    });

    it('should return error if fields are missing', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: 'aksharma@gmail.com' });

        expect(res.status).toBe(500);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('All input fields are required');
    });

    it('should return error if user does not exist', async () => {
        const user = { email: 'aksharma@gmail.com', password: 'kuch bhi' };

        User.findOne.mockResolvedValue(null); // User not found

        const res = await request(app).post('/api/auth/login').send(user);

        expect(res.status).toBe(500);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('User not registered');
    });

    it('should return error if password is incorrect', async () => {
        const user = { email: 'aksharma@gmail.com', password: 'wrongpassword' };

        const mockUser = {
            _id: '672b42ef1845e27bdb93bb6f',
            username: 'AK Sharma',
            email: 'aksharma@gmail.com',
            favoriteNews: [],
            createdAt: '2024-11-06T10:20:31.960Z',
            __v: 0,
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Password does not match

        const res = await request(app).post('/api/auth/login').send(user);

        expect(res.status).toBe(500);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Email or Password is incorrect');
    });
});
