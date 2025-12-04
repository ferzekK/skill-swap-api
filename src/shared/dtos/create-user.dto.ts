import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Jane Doe',
    description: 'New full name',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'New password',
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;
}
