import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { DatabaseModule } from './database/database.module';
import { ExchangeRequest } from './database/models/exchange-request.model';
import { Skill } from './database/models/skill.model';
import { UserSkill } from './database/models/user-skill.model';
import { User } from './database/models/user.model';
import { ExchangeModule } from './exchange/exchange.module';
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
    UsersModule,
    SkillsModule,
    ExchangeModule,
  ],
})
export class AppModule {}
