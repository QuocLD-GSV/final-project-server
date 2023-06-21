import { Types } from 'mongoose';
import { User } from '../../schemas/user.schema';

const userStub: User = Object.assign(new User(), {
  _id: new Types.ObjectId(),
  email: 'example@gmail.com',
  password: 'password123',
  googleId: 'googleId123',
  dateOfBirth: new Date('2001-01-01'),
  avatar: 'avatar.jpg',
  roles: ['user'],
  authenticate: [
    {
      refreshToken: 'refreshToken123',
      createdAt: new Date(),
    },
  ],
  bio: "I'm a user.",
  isDeleted: false,
});

console.log(userStub);
