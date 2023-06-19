import { userStub } from '../test/stubs/user.stub';

export const AuthService = jest.fn().mockReturnValue({
  login: jest.fn().mockReturnValue(userStub()),
  logout: jest.fn().mockReturnValue('success'),
  refresh: jest.fn().mockReturnValue('success'),
});
