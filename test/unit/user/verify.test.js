import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user.model.js';
import jwt from 'jsonwebtoken';

jest.mock('../../../models/user.model.js');
jest.mock('jsonwebtoken');

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
            .set('Cookie', `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmI0MmVmMTg0NWUyN2JkYjkzYmI2ZiIsImlhdCI6MTczMDg4OTcwM30.--tmnVaGfHMuKsbuK-uEsxS3d0h0y5xg-gZyXKnLfro`);

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
