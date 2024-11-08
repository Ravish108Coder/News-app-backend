import request from 'supertest';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { app } from '../../app'; // assuming your Express app is exported from app.js
import { Comment } from '../../models/comment.model';
import { User } from '../../models/user.model';

jest.mock('../../models/comment.model');
jest.mock('../../models/user.model');

describe('API Security Tests', () => {

    describe('GET /api/comment/:id - NoSQL Injection Protection', () => {
        it('should return an error for invalid comment ID format', async () => {
            const injectionPayload = { $gt: '' };  // NoSQL Injection payload

            const res = await request(app).get(`/api/comment/${injectionPayload}`);

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Invalid comment ID');
        });
    });

    describe('GET /api/user/:id - NoSQL Injection Protection', () => {
        it('should return an error for invalid user ID format', async () => {
            const injectionPayload = { $ne: null };  // Another NoSQL Injection payload

            const res = await request(app).get(`/api/comment/user/${injectionPayload}`);

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Invalid user ID');
        });
    });
    
    describe('DELETE /api/comment/:id - NoSQL Injection Protection', () => {
        it('should prevent deletion with NoSQL injection attempt', async () => {
            const injectionPayload = { $ne: '' };

            const res = await request(app).delete(`/api/comment/${injectionPayload}`);

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Invalid comment ID');
        });
    });

    describe('POST /api/comment/new - Prevent NoSQL Injection in Body', () => {
        it('should return an error for invalid ObjectId in body fields', async () => {
            const maliciousUserID = { $gt: '' };  // NoSQL injection attempt
            const maliciousArticleID = { $ne: null };

            const res = await request(app).post('/api/comment/new').send({
                userID: maliciousUserID,
                articleID: maliciousArticleID,
                message: "This is a test comment"
            });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Invalid IDs provided');
        });
    });
});
