import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserSkill, ExchangeRequest, Skill, User } from './models';
import { DatabaseSeeder } from './seeders';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Skill, UserSkill, ExchangeRequest]),
  ],
  providers: [DatabaseSeeder],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
