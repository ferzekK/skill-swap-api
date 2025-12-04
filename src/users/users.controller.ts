import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import type { CreateUserDto } from '../shared/dtos/create-user.dto';
import type { User } from '../shared/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): User | undefined {
    return this.usersService.findById(id);
  }
}
