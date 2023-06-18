import { Test } from '@nestjs/testing';
import { CreateUserRequest } from '../users/dto/create-user.request';
import { User } from '../users/schemas/user.schema';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { userStub } from './stubs/user.stub';

jest.mock('../users/users.service');

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

    describe('createUser', () => {
      describe('when createUser Is called', () => {
        let user: User;
        let createUserDto: CreateUserRequest;

        beforeEach(async () => {
          createUserDto = {
            email: userStub().email,
            password: userStub().password,
            googleId: userStub().password,
            dateOfBirth: userStub().dateOfBirth,
            avatar: userStub().avatar,
            bio: userStub().bio,
          };
          user = await usersController.createUser(createUserDto);
        });

        test('then its should call usersService', () => {
          expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });
});
