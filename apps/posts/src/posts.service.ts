import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Types } from 'mongoose';
import { HTTPExceptions } from '../../../libs/common/src/decorators/try-catch';
import { CreatePostDto } from './dto/create-new-post.dto';
import { PostErrors } from './errors/posts.errors';
import { LikesRepository } from './repository/likes.repository';
import { PostsRepository } from './repository/posts.repository';
import { generateAwsKey } from './utils/awsKey.utils';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostsRepository,
    private configService: ConfigService,
    private likeRepository: LikesRepository,
  ) {}

  getAll() {
    return this.postRepository.find({});
  }

  @HTTPExceptions(
    PostErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createPost(
    data: CreatePostDto,
    user_id: Types.ObjectId,
    files?: Express.Multer.File[],
  ) {
    const filesUploaded = [];

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          const newFileUploaded = await this.uploadFileToAwsS3(
            file.buffer,
            file.originalname,
          );
          filesUploaded.push({ ...newFileUploaded, type: 'image' });
        }),
      );
    }

    return await this.postRepository.create({
      ...data,
      user_id: user_id,
      media: [...filesUploaded],
      type: 'image',
    });
  }

  @HTTPExceptions(
    PostErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  private async uploadFileToAwsS3(dataBuffer: Buffer, filename: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_KEY'),
        Body: dataBuffer,
        Key: generateAwsKey(filename),
        ACL: 'public-read',
      })
      .promise();
    return { key: uploadResult.Key, url: uploadResult.Location };
  }

  @HTTPExceptions(
    PostErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async likePost(post_id: Types.ObjectId, user_id: Types.ObjectId) {
    const exitLike = await this.likeRepository.findOne({
      author_id: user_id,
      post_id: post_id,
    });

    if (exitLike) {
      await this.likeRepository.findOneAndUpdate(
        { _id: exitLike._id },
        { unliked: !exitLike.unliked },
      );
    } else {
      const like = await this.likeRepository.create({
        author_id: user_id,
        post_id: post_id,
        unlike: false,
      });

      await this.postRepository.findOneAndUpdate(
        { _id: post_id },
        {
          $addToSet: {
            likes: like._id,
          },
        },
      );
    }

    const returnLikes = await this.likeRepository.find({
      post_id: post_id,
    });

    return returnLikes;
  }
}
