import { Test } from '@nestjs/testing';
import { User } from '../schemas/user.schema';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    describe('when getUserById is called', () => {
      let user: User;

      const mockRequest = {
        user: {
          _id: userStub()._id,
        },
      };
      beforeEach(async () => {
        user = await usersController.getUserById(mockRequest);
      });

      test('it should call usersService', () => {
        expect(usersService.getUserById).toBeCalledWith(mockRequest.user._id);
      });

      test('then its should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
