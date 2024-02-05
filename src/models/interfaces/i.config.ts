import { TNODE_ENV } from '@models/types/t.node.env';
import { Algorithm } from 'jsonwebtoken';

export interface IConfig {
    PORT: number;
    MYSQL_ENV: IMYSQL_ENV;

    JWT: IJWT_ENV;

    S3: IS3_ENV;
};

export interface IJWT_ENV {
    JWT_SECRET_KEY: string;
    JWT_ALGORITHM: Algorithm;
    JWT_ACCESS_EXPIRED_IN: string;
    JWT_REFRESH_EXPIRED_IN: string;
    JWT_PUBLIC_PEM_KEY: string;
    JWT_PRIVATE_PEM_KEY: string;
    JWT_PASSPHRASE: string;
}

export interface IMYSQL_ENV {
    type: "mysql";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};

export interface IS3_ENV {

    BUCKET_NAME: string;
    ACCESS_KEY: string;
    SECRET_KEY: string;
    REGION: string;
}