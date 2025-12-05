import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  Skill,
  User,
  UserSkill,
  ExchangeRequest,
} from '../src/database/models';
import { ExchangeModule } from '../src/exchange/exchange.module';
import { HealthModule } from '../src/health';
import { SkillsModule } from '../src/skills/skills.module';
import { UsersModule } from '../src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [User, Skill, UserSkill, ExchangeRequest],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    SkillsModule,
    ExchangeModule,
    HealthModule,
  ],
})
export class TestAppModule {}
