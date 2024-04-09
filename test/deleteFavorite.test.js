// Assuming you're using Jest with a commonJS environment

const { deleteFromFavoriteController } = require('../controllers/user.controller.js');
const { User } = require('../models/user.model.js');

// Mocking required modules
jest.mock('../models/user.model.js', () => ({
    User: {
        findById: jest.fn().mockResolvedValue({
            favoriteNews: [
                { uuid: 'article1' },
                { uuid: 'article2' },
                { uuid: 'article3' }
            ],
            save: jest.fn().mockResolvedValue()
        })
    }
}));

describe('deleteFromFavoriteController', () => {
    it('should remove an article from favoriteNews', async () => {
        const req = {
            body: { uuid: 'article2' },
            user: {
                favoriteNews: [
                    { uuid: 'article1' },
                    { uuid: 'article2' },
                    { uuid: 'article3' }
                ],
                save: jest.fn()
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteFromFavoriteController(req, res);

        expect(req.user.favoriteNews).toHaveLength(2);
        expect(req.user.favoriteNews).not.toContainEqual({ uuid: 'article2' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Removed from favoriteNews successfully'
        });
    });

    
});
