import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IMYSQL_ENV } from "@models/interfaces/i.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from 'path';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
              ...config.get<IMYSQL_ENV>('MYSQL_ENV'),
              entities: [path.join(__dirname, '/../entities/*.entity.{js,ts}')],
              synchronize: false,
              connectTimeout: 30000,
              extra: {
                connectionLimit: 30,
              },
            }),
            inject: [ConfigService],
          })
    ]
})
export class CustomTypeOrmModule {}