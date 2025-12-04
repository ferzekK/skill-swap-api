import { Body, Controller, Get, Post } from '@nestjs/common';

import { SkillsService } from './skills.service';
import type { CreateSkillDto } from '../shared/dtos/create-skill.dto';
import type { Skill } from '../shared/interfaces/skill.interface';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto): Skill {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  findAll(): Skill[] {
    return this.skillsService.findAll();
  }
}
