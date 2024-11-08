import request from 'supertest';
import { app } from '../../../app';

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
