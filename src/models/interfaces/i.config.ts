export interface IConfig {
    PORT : number;
    MARIA_ENV: IMYSQL_ENV;

    JWT: IJWT_ENV;
};

export interface IJWT_ENV {
    JWT_SECRET_KEY: string;
}

export interface IMYSQL_ENV {
    type: "mysql";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}