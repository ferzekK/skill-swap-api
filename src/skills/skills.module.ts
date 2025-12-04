import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { Skill } from '../database/models/skill.model';

@Module({
  imports: [SequelizeModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
