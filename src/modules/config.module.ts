import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import config from "@config/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env.dev',
            ignoreEnvFile: process.env.NODE_ENV === 'production',
            isGlobal: true,
            load: [config]
          })
    ]
})
export class CustomConfigModule {}