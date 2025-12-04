import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Skill } from '../database/models/skill.model';
import type { CreateSkillDto } from '../shared/dtos/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill)
    private readonly skillModel: typeof Skill,
  ) {}

  async create(dto: CreateSkillDto): Promise<Skill> {
    return this.skillModel.create({
      name: dto.name,
      description: dto.description,
    });
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.findAll();
  }

  async findOne(id: string): Promise<Skill | null> {
    return this.skillModel.findByPk(id);
  }

  async findByIds(ids: string[]): Promise<Skill[]> {
    return this.skillModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }
}
