import request from 'supertest';
import { Comment } from '../models/comment.model';
import { app } from '../app';

jest.mock('../models/comment.model');

describe('GET /api/comment/:id', () => {

    it('should retrieve a comment when a valid id is provided', async () => {
        const commentId = 'valid-comment-id';

        const mockComment = {
            _id: commentId,
            userID: 'user-id',
            articleID: 'article-id',
            message: 'This is a test comment',
            likes: [],
            created_at: '2024-11-06T06:22:45.281Z',
            __v: 0
        };
        Comment.findOne.mockResolvedValue(mockComment);

        const res = await request(app).get(`/api/comment/${commentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data).toMatchObject(mockComment);
    });

    it('should return a message "No data found" if no comment is found with the given id', async () => {
        const commentId = 'nonexistent-comment-id';

        Comment.findOne.mockResolvedValue(null);

        const res = await request(app).get(`/api/comment/${commentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('No data found');
    });

    it('should return an error message if an exception occurs while retrieving the comment', async () => {
        const commentId = 'valid-comment-id';

        Comment.findOne.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get(`/api/comment/${commentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Database error');
    });
});
