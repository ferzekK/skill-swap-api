import { Injectable } from '@nestjs/common';

import type { CreateSkillDto } from '../shared/dtos/create-skill.dto';
import type { Skill } from '../shared/interfaces/skill.interface';

@Injectable()
export class SkillsService {
  private skills: Skill[] = [
    {
      id: '1',
      name: 'JavaScript',
      description: 'Programming language for web development',
    },
    {
      id: '2',
      name: 'TypeScript',
      description: 'Typed superset of JavaScript',
    },
    {
      id: '3',
      name: 'NestJS',
      description: 'Progressive Node.js framework',
    },
  ];

  create(dto: CreateSkillDto): Skill {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: dto.name,
      description: dto.description,
    };

    this.skills.push(newSkill);
    return newSkill;
  }

  findAll(): Skill[] {
    return this.skills;
  }

  findOne(id: string): Skill | undefined {
    return this.skills.find((skill) => skill.id === id);
  }
}
