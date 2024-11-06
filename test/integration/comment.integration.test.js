import request from 'supertest';
import mongoose from 'mongoose';
import { Comment } from '../../models/comment.model';
import { app } from '../../app';

jest.mock('../../models/comment.model');

describe('Comment API Integration Test', () => {

    let createdCommentId;

    it('should create a new comment', async () => {
        const commentData = {
            userID: "65f6b696b8cf425ba24678fd",
            articleID: "ba483aa3-823a-46b8-9774-3b07ed4599f9",
            message: 'This is an integration test comment',
        };

        const mockResponseData = {
            ...commentData,
            likes: [],
            _id: "integration-test-comment-id",
            created_at: "2024-11-06T05:56:45.536Z",
            __v: 0
        };

        Comment.create.mockResolvedValue(mockResponseData);

        const res = await request(app).post('/api/comment/new').send(commentData);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Comment Created Successfully');
        expect(res.body.data).toMatchObject(mockResponseData);

        createdCommentId = mockResponseData._id;  // Save the created comment ID for later tests
    });

    it('should retrieve the created comment by ID', async () => {
        const mockComment = {
            _id: createdCommentId,
            userID: '65f6b696b8cf425ba24678fd',
            articleID: 'ba483aa3-823a-46b8-9774-3b07ed4599f9',
            message: 'This is an integration test comment',
            likes: [],
            created_at: '2024-11-06T05:56:45.536Z',
            __v: 0
        };

        Comment.findOne.mockResolvedValue(mockComment);

        const res = await request(app).get(`/api/comment/${createdCommentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data).toMatchObject(mockComment);
    });

    it('should delete the created comment successfully', async () => {
        Comment.findOneAndDelete.mockResolvedValue({
            _id: createdCommentId,
            userID: '65f6b696b8cf425ba24678fd',
            articleID: 'ba483aa3-823a-46b8-9774-3b07ed4599f9',
            message: 'This is an integration test comment',
            likes: [],
            created_at: '2024-11-06T05:56:45.536Z',
            __v: 0
        });

        const res = await request(app).delete(`/api/comment/${createdCommentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Comment deleted successfully');
    });

    it('should return "Comment Not Found" if the comment does not exist', async () => {
        const nonexistentCommentId = 'nonexistent-comment-id';

        Comment.findOneAndDelete.mockResolvedValue(null);

        const res = await request(app).delete(`/api/comment/${nonexistentCommentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Comment Not Found');
    });

    it('should handle errors during creation due to missing fields', async () => {
        Comment.create.mockImplementation(() => {
            throw new mongoose.Error.ValidationError();
        });

        const res = await request(app).post('/api/comment/new').send({
            userID: "65f6b696b8cf425ba24678fd",
        });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBeDefined();
    });

});