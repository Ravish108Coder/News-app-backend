import { favoriteArticlesController } from '../../../controllers/user.controller.js';

describe('favoriteArticlesController', () => {
  it('should return favorite articles when user is found', async () => {
    // Mock request and response objects
    const req = {
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
    await favoriteArticlesController(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: true, message: 'All favorite news', articles: req.user.favoriteNews });
  });

  it('should return error message when user is not found', async () => {
    // Mock request and response objects
    const req = {
      user: null
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the controller function
    await favoriteArticlesController(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: false, message: 'User not found' });
  });
});
