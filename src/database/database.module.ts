import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ExchangeRequest } from './models/exchange-request.model';
import { Skill } from './models/skill.model';
import { UserSkill } from './models/user-skill.model';
import { User } from './models/user.model';
import { DatabaseSeeder } from './seeders/database.seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Skill, UserSkill, ExchangeRequest]),
  ],
  providers: [DatabaseSeeder],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
