import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../database/models';
import { CreateUserDto, UpdateUserDto } from '../shared/dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash: dto.password,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['passwordHash'] },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findByIdOrThrow(id);

    const updateData: Partial<User> = {};
    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.password) updateData.passwordHash = dto.password;

    await user.update(updateData);
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findByIdOrThrow(id);
    await user.destroy();
  }

  async count(): Promise<number> {
    return this.userModel.count();
  }
}
