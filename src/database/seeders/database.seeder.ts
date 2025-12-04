import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { defaultSkills, defaultUsers } from './seed-data';
import { Skill, User } from '../models';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Skill) private readonly skillModel: typeof Skill,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    const isEmpty = await this.isDatabaseEmpty();

    if (!isEmpty) {
      this.logger.log('Database already has data. Skipping seed');
      return;
    }

    this.logger.log('Seeding...');
    await this.seedUsers();
    await this.seedSkills();
    this.logger.log('Seeding completed successfully');
  }

  private async isDatabaseEmpty(): Promise<boolean> {
    const userCount = await this.userModel.count();
    const skillCount = await this.skillModel.count();
    return userCount === 0 && skillCount === 0;
  }

  private async seedUsers(): Promise<void> {
    await this.userModel.bulkCreate(defaultUsers.map((u) => ({ ...u })));
    this.logger.log(`Seeded ${defaultUsers.length} users`);
  }

  private async seedSkills(): Promise<void> {
    await this.skillModel.bulkCreate(defaultSkills.map((s) => ({ ...s })));
    this.logger.log(`Seeded ${defaultSkills.length} skills`);
  }
}
