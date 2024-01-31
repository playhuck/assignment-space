import { IConfig } from "@models/interfaces/i.config";
import { getEnvLiteralTypeValue, getEnvNum, getEnvStr, getPemKey } from "./config.private";

export default (): IConfig => ({
    PORT: getEnvNum('PORT') || 4000,
    JWT: {
        JWT_SECRET_KEY: getEnvStr('JWT_SECRET_KEY'),
        JWT_ACCESS_EXPIRED_IN: getEnvStr('JWT_ACCESS_EXPIRED_IN'),
        JWT_REFRESH_EXPIRED_IN: getEnvStr('JWT_REFRESH_EXPIRED_IN'),
        JWT_ALGORITHM: getEnvLiteralTypeValue('JWT_ALGORITHM'),
        JWT_PUBLIC_PEM_KEY: getPemKey('secrets/jwt.public'),
        JWT_PRIVATE_PEM_KEY: getPemKey('secrets/jwt.private'),
        JWT_PASSPHRASE: getEnvStr('JWT_PASSPHRASE')
    },
    MYSQL_ENV: {
        type: 'mysql' as 'mysql',
        host: getEnvStr('MYSQL_ENV_HOST'),
        port: getEnvNum('MYSQL_ENV_PORT'),
        username: getEnvStr('MYSQL_ENV_USER'),
        password: getEnvStr('MYSQL_ENV_PWD'),
        database: process.env.NODE_ENV === 'test' ? getEnvStr('MYSQL_ENV_TEST_DB_NAME') : getEnvStr('MYSQL_ENV_DB_NAME')
    }
})