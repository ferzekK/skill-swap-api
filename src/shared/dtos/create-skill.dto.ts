import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    example: 'JavaScript',
    description: 'Skill name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Skill name is required' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Modern JavaScript including ES6+ features',
    description: 'Skill description',
  })
  @IsString()
  @IsNotEmpty({ message: 'Skill description is required' })
  description: string;
}

export class UpdateSkillDto {
  @ApiPropertyOptional({
    example: 'TypeScript',
    description: 'New skill name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Typed superset of JavaScript',
    description: 'New skill description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
