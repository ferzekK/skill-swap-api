import { Injectable } from '@nestjs/common';

import type { CreateUserDto } from '../shared/dtos/create-user.dto';
import type { User } from '../shared/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: Date.now().toString(),
      email: dto.email,
      fullName: dto.fullName,
      passwordHash: dto.password, // In production, hash this with bcrypt
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
