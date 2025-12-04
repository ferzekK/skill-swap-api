import { Body, Controller, Get, Post } from '@nestjs/common';

import { SkillsService } from './skills.service';
import { Skill } from '../database/models/skill.model';
import type { CreateSkillDto } from '../shared/dtos/create-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  async findAll(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }
}
