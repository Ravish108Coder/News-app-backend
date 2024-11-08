import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Mocking the necessary modules
jest.mock('../../models/user.model');
jest.mock('jsonwebtoken');

// Setup connection and cleanup
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API Tests', () => {

    // Test for GET /api/auth/verify
    describe('GET /api/auth/verify', () => {
        it('should return error if token is invalid', async () => {
            const res = await request(app)
                .get('/api/auth/verify')
                .set('Cookie', 'token=invalid-token');

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Invalid token');
        });

        it('should verify the user if the token is valid', async () => {
            const mockUser = { id: '672b42ef1845e27bdb93bb6f', username: 'AK Sharma', email: 'aksharma@gmail.com' };

            jwt.verify.mockReturnValue({ id: '672b42ef1845e27bdb93bb6f' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue({ id: '672b42ef1845e27bdb93bb6f' }),
            });

            const res = await request(app)
                .get('/api/auth/verify')
                .set('Cookie', `token=valid-token`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('User verified');
        });

        it('should return error if token cookie is missing', async () => {
            const res = await request(app).get('/api/auth/verify');

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('User not logged in');
        });

        it('should return error if user is not found', async () => {
            jwt.verify.mockReturnValue({ id: 'nonexistent-user-id' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            const res = await request(app)
                .get('/api/auth/verify')
                .set('Cookie', `token=valid-mocked-token`);

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('User not found');
        });

        it('should handle unexpected errors gracefully', async () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            const res = await request(app)
                .get('/api/auth/verify')
                .set('Cookie', 'token=some-token');

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Unexpected error');
        });
    });

    // Test for POST /api/auth/logout
    describe('POST /api/auth/logout', () => {
        it('should log out successfully and clear the token cookie', async () => {
            const token = 'valid-token';

            const res = await request(app)
                .get('/api/auth/logout')
                .set('Cookie', `token=${token}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('User Logged out Successfully');

            const cookie = res.headers['set-cookie'][0];
            expect(cookie).toContain('token=');
        });

        it('should return error if token cookie is missing', async () => {
            const res = await request(app).get('/api/auth/logout');

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(false);
        });
    });

    // Test for POST /api/auth/register
    describe('POST /api/auth/register', () => {
        it('should return an error if the user already exists', async () => {
            const existingUser = {
                username: 'BBM Sharma',
                email: 'bbmsharma@gmail.com',
                password: 'kuch bhi',
            };

            const isUserPresent = await User.findOne({ email: existingUser.email })

            if (isUserPresent) {

                const response = await request(app).post('/api/auth/register').send(existingUser);

                expect(response.status).toBe(500);
                expect(response.body.status).toBe(false);
                expect(response.body.message).toBe('User already exists');
            }
        });
        it('should register a new user successfully', async () => {
            const newUser = {
                username: 'KKV Sharma',
                email: 'kkvsharma@gmail.com',
                password: 'kuch bhi',
            };

            const existingUser = await User.findOne({ email: newUser.email });
            if (existingUser) {
                await User.deleteOne({ email: newUser.email });
            }

            const checkUser = await User.findOne({ email: newUser.email });

            if (!checkUser) {

                const response = await request(app).post('/api/auth/register').send(newUser);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(true);
                expect(response.body.message).toBe('User Registered Successfully');

            }
        });



        it('should return an error if required fields are missing', async () => {
            const newUser = { email: 'aksharma@gmail.com', password: 'kuch bhi' };

            const response = await request(app).post('/api/auth/register').send(newUser);

            expect(response.status).toBe(500);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('All input fields are required');
        });


    });



});

