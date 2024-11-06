import request from 'supertest';
import { Comment } from '../../../models/comment.model';
import { app } from '../../../app';

jest.mock('../../../models/comment.model');

describe('DELETE /api/comment/:id', () => {
    let commentId;

    // Step 1: Create a new comment
    beforeAll(async () => {
        const newComment = {
            userID: '65f6b696b8cf425ba24678fd',
            articleID: 'ba483aa3-823a-46b8-9774-3b07ed4599f',
            message: 'This is a test comment to be deleted',
            likes: [],
            created_at: '2024-11-06T06:22:45.281Z',
        };

        Comment.create.mockResolvedValue({
            ...newComment,
            _id: 'mocked-comment-id',
        });

        const createdComment = await Comment.create(newComment);
        commentId = createdComment._id;
    });

    // Test case 1: Deleting the created comment successfully
    it('should delete the created comment successfully', async () => {
        Comment.findOneAndDelete.mockResolvedValue({
            _id: commentId,
            userID: '65f6b696b8cf425ba24678fd',
            articleID: 'ba483aa3-823a-46b8-9774-3b07ed4599f',
            message: 'This is a test comment to be deleted',
            likes: [],
            created_at: '2024-11-06T06:22:45.281Z',
            __v: 0
        });

        const res = await request(app).delete(`/api/comment/${commentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Comment deleted successfully');
    });

    // Test case 2: Deleting a comment that doesn't exist
    it('should return "Comment Not Found" if the comment does not exist', async () => {
        const nonexistentCommentId = 'nonexistent-comment-id';

        Comment.findOneAndDelete.mockResolvedValue(null);

        const res = await request(app).delete(`/api/comment/${nonexistentCommentId}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Comment Not Found');
    });

    // Test case 3: Error handling when an exception occurs
    it('should return an error message if an exception occurs during deletion', async () => {
        const commentIdForError = 'mocked-comment-id';

        Comment.findOneAndDelete.mockRejectedValue(new Error('Database error'));

        const res = await request(app).delete(`/api/comment/${commentIdForError}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Database error');
    });
});
