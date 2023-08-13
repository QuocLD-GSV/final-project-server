import { ConfigService } from '@nestjs/config';

export class AwsConfig {
  constructor(private readonly configService: ConfigService) {}
  awsS3Bucket = {
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    region: this.configService.get('AWS_REGION'),
  };
}
