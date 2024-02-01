import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export async function conn() {

    const mysqlConfig = {
        host: process.env.MYSQL_ENV_HOST!,
        port: +process.env.MYSQL_ENV_PORT!,
        user: process.env.MYSQL_ENV_USER!,
        password: process.env.MYSQL_ENV_PWD!,
        database: process.env.MYSQL_ENV_TEST_DB_NAME!
    };

    const connection = mysql.createConnection(mysqlConfig);

    return connection;

}