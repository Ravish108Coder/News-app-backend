import { isAlreadyFavoriteController } from '../controllers/user.controller.js';

describe('isAlreadyFavoriteController', () => {
  it('should return success true when article is already in favoriteNews', async () => {
    // Mock request and response objects
    const req = {
      body: { uuid: 'article1' },
      user: {
        favoriteNews: [
          { uuid: 'article1', title: 'Article 1' },
          { uuid: 'article2', title: 'Article 2' }
        ]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the controller function
    await isAlreadyFavoriteController(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Article is already in favoriteNews', data: req.user.favoriteNews[0] });
  });

  
});
