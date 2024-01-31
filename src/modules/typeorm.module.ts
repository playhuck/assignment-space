import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IMYSQL_ENV } from "@models/interfaces/i.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
              ...config.get<IMYSQL_ENV>('MYSQL_ENV'),
              autoLoadEntities: true,
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