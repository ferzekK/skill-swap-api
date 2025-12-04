import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Skill } from '../database/models';
import {
  CreateSkillDto,
  UpdateSkillDto,
} from '../shared/dtos/create-skill.dto';

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
    return this.skillModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Skill | null> {
    return this.skillModel.findByPk(id);
  }

  async findOneOrThrow(id: string): Promise<Skill> {
    const skill = await this.findOne(id);
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async findByIds(ids: string[]): Promise<Skill[]> {
    return this.skillModel.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
  }

  async search(query: string): Promise<Skill[]> {
    return this.skillModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['name', 'ASC']],
    });
  }

  async update(id: string, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOneOrThrow(id);

    const updateData: Partial<Skill> = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.description) updateData.description = dto.description;

    await skill.update(updateData);
    return skill;
  }

  async delete(id: string): Promise<void> {
    const skill = await this.findOneOrThrow(id);
    await skill.destroy();
  }

  async count(): Promise<number> {
    return this.skillModel.count();
  }
}
