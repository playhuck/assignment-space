import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IS3_ENV } from '@models/interfaces/i.config';
import { ConfigService } from '@nestjs/config';
import { TFileExtension } from '@models/types/t.common';

@Injectable()
export class S3Provider {

    private readonly S3_ENV: IS3_ENV;

    readonly s3Client: S3Client;

    constructor(
        private readonly config: ConfigService
    ) {
        this.S3_ENV = this.config.get<IS3_ENV>("S3")!
        this.s3Client = this.getS3Client();
    }

    private getS3Client() {
        return new S3Client({
            region: this.S3_ENV.REGION,
            credentials: {
                accessKeyId: this.S3_ENV.ACCESS_KEY,
                secretAccessKey: this.S3_ENV.SECRET_KEY
            }
        });
    };

    async getPresignedUrl(
        key: string,
        fileExtension: TFileExtension
    ) {
        const { BUCKET_NAME } = this.S3_ENV;

        const contentType = fileExtension === 'image' ?
            'image/*' : fileExtension === 'file' ?
                'multipart/form-data' :
                'application/octet-stream'
        const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, ContentType: contentType });

        return await getSignedUrl(
            this.s3Client as any, command as any, {
            expiresIn: 3600 * 100
        });
    };

    async deleteObject(key: string) {

        try {

            const { BUCKET_NAME } = this.S3_ENV;

            const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key });

            await this.s3Client.send(command);

            return true;

        } catch (err) {

            return false;

        }

    }

}