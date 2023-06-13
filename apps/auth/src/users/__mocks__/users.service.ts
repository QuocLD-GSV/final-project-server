import { userStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUserById: jest.fn().mockReturnValue(userStub()),
  createUser: jest.fn().mockReturnValue(userStub()),
});
