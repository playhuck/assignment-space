import { IConfig } from "@models/interfaces/i.config";
import { getEnvNum, getEnvStr, getPemKey } from "./config.private";

export default (): IConfig => ({
    PORT: getEnvNum('PORT') || 4000,
    JWT: {
        JWT_SECRET_KEY: getEnvStr('JWT_SECRET_KEY')
    },
    MARIA_ENV: {
        type: 'mysql' as 'mysql',
        host: getEnvStr('MARIA_ENV_HOST'),
        port: getEnvNum('MARIA_ENV_PORT'),
        username: getEnvStr('MARIA_ENV_USER'),
        password: getEnvStr('MARIA_ENV_PWD'),
        database: process.env.NODE_ENV === 'test' ? getEnvStr('MARIA_ENV_TEST_DB_NAME') : getEnvStr('MARIA_ENV_DB_NAME')
    }
})