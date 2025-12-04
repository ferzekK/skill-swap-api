import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateExchangeRequestDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the user initiating the exchange',
  })
  @IsUUID('4', { message: 'requesterId must be a valid UUID' })
  @IsNotEmpty()
  requesterId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'UUID of the user receiving the exchange request',
  })
  @IsUUID('4', { message: 'responderId must be a valid UUID' })
  @IsNotEmpty()
  responderId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'UUID of the skill being offered',
  })
  @IsUUID('4', { message: 'skillOfferedId must be a valid UUID' })
  @IsNotEmpty()
  skillOfferedId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'UUID of the skill being requested',
  })
  @IsUUID('4', { message: 'skillWantedId must be a valid UUID' })
  @IsNotEmpty()
  skillWantedId: string;
}
