import { addToFavoriteController, deleteFromFavoriteController } from '../../controllers/user.controller.js';

describe('User Favorite Article Integration Test', () => {

    it('should add an article to favoriteNews and then remove it', async () => {
        // Initial mock request and response objects
        const req = {
            body: { uuid: 'article3', title: 'Article 3' },
            user: {
                favoriteNews: [
                    { uuid: 'article1', title: 'Article 1' },
                    { uuid: 'article2', title: 'Article 2' }
                ],
                save: jest.fn()
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call addToFavoriteController to add the article
        await addToFavoriteController(req, res);

        // Assertions after adding the article
        expect(req.user.favoriteNews).toHaveLength(3);
        expect(req.user.favoriteNews).toContainEqual(req.body);
        expect(req.user.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Added to favoriteNews successfully'
        });

        // Reset mock status and json methods before the next test
        res.status.mockClear();
        res.json.mockClear();

        // Call deleteFromFavoriteController to remove the article
        req.body = { uuid: 'article2' }; // Simulate the deletion of article2
        await deleteFromFavoriteController(req, res);

        // Assertions after removing the article
        expect(req.user.favoriteNews).toHaveLength(2); // article2 should be removed
        expect(req.user.favoriteNews).not.toContainEqual({ uuid: 'article2' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Removed from favoriteNews successfully'
        });
    });
});