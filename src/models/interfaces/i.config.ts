import { TNODE_ENV } from '@models/types/t.node.env';
import { Algorithm } from 'jsonwebtoken';

export interface IConfig {
    PORT : number;
    STAGE : TNODE_ENV;
    MYSQL_ENV: IMYSQL_ENV;

    JWT: IJWT_ENV;
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
}