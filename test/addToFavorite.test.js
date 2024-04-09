import { addToFavoriteController } from '../controllers/user.controller.js';

describe('addToFavoriteController', () => {
  it('should add article to favoriteNews if not already exist', async () => {
    // Mock request and response objects
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

    // Call the controller function
    await addToFavoriteController(req, res);

    // Assertions
    expect(req.user.favoriteNews).toHaveLength(3);
    expect(req.user.favoriteNews).toContainEqual(req.body);
    expect(req.user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Added to favoriteNews successfully' });
  });

  it('should return success true when article is already in favoriteNews', async () => {
    // Mock request and response objects
    const req = {
      body: { uuid: 'article2', title: 'Article 2' },
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

    // Call the controller function
    await addToFavoriteController(req, res);

    // Assertions
    expect(req.user.favoriteNews).toHaveLength(2);
    expect(req.user.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Added to favoriteNews successfully' });
  });

 
});
