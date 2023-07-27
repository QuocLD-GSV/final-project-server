import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId('64882c59fb0991ad2638c52a'),
    email: 'example@gmail.com',
    password: 'password123',
    googleId: 'googleId123',
    firstName: 'quoc',
    lastName: 'le',
    dateOfBirth: new Date('2001-01-01'),
    avatar: 'avatar.jpg',
    roles: ['user'],
    authenticate: [
      {
        refreshToken: 'refreshToken123',
        createdAt: new Date('2023-06-01T12:00:00Z'),
      },
    ],
    bio: "I'm a user.",
    follower: [],
    isDeleted: false,
  };
};
