import bcrypt from 'bcryptjs';
import { deleteAccountController } from '../../../controllers/user.controller.js';
import { User } from '../../../models/user.model.js';

// Mocking the User model
jest.mock('../../../models/user.model.js', () => ({
  User: {
    findOne: jest.fn(),
    deleteOne: jest.fn()
  }
}));


// Mocking bcrypt functions
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('deleteAccountController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { email: 'user@example.com' },
      body: { password: 'password123' }
    };
    res = {
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it('should return error message if an error occurs', async () => {
    const errorMessage = 'Internal Server Error';
    User.findOne.mockRejectedValueOnce(new Error(errorMessage));

    await deleteAccountController(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.user.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(User.deleteOne).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
  });
});
