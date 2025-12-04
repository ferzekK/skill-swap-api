import { Injectable } from '@nestjs/common';

import type { CreateUserDto } from '../shared/dtos/create-user.dto';
import type { User } from '../shared/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'alice@example.com',
      fullName: 'Alice',
      passwordHash: 'hashed_password_123',
    },
    {
      id: '2',
      email: 'bob@example.com',
      fullName: 'Bob',
      passwordHash: 'hashed_password_456',
    },
  ];

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: Date.now().toString(),
      email: dto.email,
      fullName: dto.fullName,
      passwordHash: dto.password,
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
