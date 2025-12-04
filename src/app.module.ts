import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { DatabaseModule } from './database/database.module';
import { Skill, User, UserSkill, ExchangeRequest } from './database/models';
import { ExchangeModule } from './exchange/exchange.module';
import { HealthModule } from './health';
import { SkillsModule } from './skills/skills.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        uri: configService.get<string>('DB_STRING'),
        models: [User, Skill, UserSkill, ExchangeRequest],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    DatabaseModule,
    HealthModule,
    UsersModule,
    SkillsModule,
    ExchangeModule,
  ],
})
export class AppModule {}
