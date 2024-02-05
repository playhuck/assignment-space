import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { IS3_ENV } from '@models/interfaces/i.config';
import { ConfigService } from '@nestjs/config';
import { TFileExtension } from '@models/types/t.common';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';

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

    async putPresignedUrl(
        userId: number,
        spaceId: number,
        fileName: string,
        fileExtension: TFileExtension
    ) {
        const { BUCKET_NAME } = this.S3_ENV;

        const key = `${userId}/${spaceId}/${fileName}`;

        const contentType = fileExtension === 'image' ?
            'image/*' : fileExtension === 'file' ?
                'multipart/form-data' :
                'application/octet-stream';
                
        const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, ContentType: contentType });

        return await getSignedUrl(
            this.s3Client as any, command as any, {
            expiresIn: 3600 * 100
        });
    };

    async putPresignedUrlForPost(
        userId: number,
        spaceId: number,
        postId: number,
        fileName: string,
        fileExtension: TFileExtension
    ) {
        const { BUCKET_NAME } = this.S3_ENV;

        const key = `${userId}/${spaceId}/${postId}/${fileName}`;

        const contentType = fileExtension === 'image' ?
            'image/*' : fileExtension === 'file' ?
                'multipart/form-data' :
                'application/octet-stream';
                
        const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, ContentType: contentType });

        return await getSignedUrl(
            this.s3Client as any, command as any, {
            expiresIn: 3600 * 100
        });
    };

    async putPresignedUrlForUser(
        userId: number,
        fileName: string
    ) {
        const { BUCKET_NAME } = this.S3_ENV;

        const key = `${userId}/${fileName}`;

        const contentType = 'image/*'
                
        const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, ContentType: contentType });

        return await getSignedUrl(
            this.s3Client as any, command as any, {
            expiresIn: 3600 * 100
        });
    };

    async getPresignedUrl(
        Key: string
    ) {

        try {

            const { BUCKET_NAME } = this.S3_ENV;

            const getObject = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key
            });

            const getPresignedUrl = await getSignedUrl(
                this.s3Client as any, getObject as any, {
                expiresIn: 300
            });

            return getPresignedUrl;

        } catch (e) {
            console.log(e);
            
            throw new CustomException(
                `S3 ERROR : ${JSON.stringify(e)}`,
                ECustomExceptionCode['AWS-S3-EXCEPTION'],
                500
            )
        };
    }

    async deleteObject(key: string) {

        try {

            const { BUCKET_NAME } = this.S3_ENV;

            const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key });

            await this.s3Client.send(command);

            return true;

        } catch (err) {

            return false;

        }

    };

}