import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../users/schemas/user.schema';
import { userStub } from './stubs/user.stub';
import { MockProxy, mock } from 'jest-mock-extended';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

jest.mock('../auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let response: MockProxy<Response>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService, ConfigService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    response = mock<Response>({ cookie: jest.fn() });
    jest.clearAllMocks();
  });

  describe('login', () => {
    describe('when login is called', () => {
      let user: User;
      let currentUser = { ...userStub() };
      const ipAddress = '127.0.0.1';
      const request = {
        userAgent: 'user-agent',
      };

      beforeEach(async () => {
        jest.spyOn(response, 'cookie');
        response.cookie.mockImplementation(() => response);
        user = await authController.login(
          currentUser,
          response,
          ipAddress,
          request,
        );
      });

      test('then its should call authServive', () => {
        expect(authService.login).toHaveBeenCalledWith(currentUser, response, {
          ipAddress,
          userAgent: request.userAgent,
        });
      });

      test('should login', () => {
        expect(user).toEqual({ ...userStub(), password: 'private' });
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      const request = {
        userAgent: 'user-agent',
        cookies: {
          RefreshToken: 'mockrefreshToken',
        },
      };
      let currentUser = { ...userStub() };

      beforeEach(async () => {
        await authController.logout(currentUser, response, request);
      });

      test('then it should call authservice', () => {
        expect(authService.logout).toHaveBeenCalledWith(response, {
          refreshToken: request.cookies.RefreshToken,
          user_id: userStub()._id,
        });
      });
    });
  });

  describe('refresh token', () => {
    const request = {
      cookies: {
        RefreshToken: 'mockrefreshToken',
      },
    };
    beforeEach(async () => {
      await authController.refresh(request, response);
    });

    test('the its should call authService', () => {
      expect(authService.refresh).toHaveBeenCalledWith(
        request.cookies.RefreshToken,
        response,
      );
    });
  });
});
