import request from 'supertest';
import mongoose from 'mongoose';
import { Comment } from '../../../models/comment.model';
import { app } from '../../../app';

jest.mock('../../../models/comment.model');

describe('POST /api/comment/new', () => {
    it('should create a new comment', async () => {
        const commentData = {
            userID: "65f6b696b8cf425ba24678fd",
            articleID: "ba483aa3-823a-46b8-9774-3b07ed4599f9",
            message: 'This is a test comment',
        };

        const mockResponseData = {
            ...commentData,
            likes: [],
            _id: "672b051db293bade543922ec",
            created_at: "2024-11-06T05:56:45.536Z",
            __v: 0
        };

        Comment.create.mockResolvedValue(mockResponseData);

        const res = await request(app).post('/api/comment/new').send(commentData);

        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Comment Created Successfully');
        expect(res.body.data).toMatchObject(mockResponseData);
    });

    it('should return error for missing fields', async () => {
        Comment.create.mockImplementation(() => {
            throw new mongoose.Error.ValidationError();
        });

        const res = await request(app).post('/api/comment/new').send({
            userID: "65f6b696b8cf425ba24678fd",
        });

        expect(res.body.status).toBe(false);
        expect(res.body.message).toBeDefined();
    });
});
