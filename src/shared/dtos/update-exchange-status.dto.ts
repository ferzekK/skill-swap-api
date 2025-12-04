import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateExchangeStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    example: 'ACCEPTED',
    description: 'New status of the exchange request',
  })
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED'], {
    message: 'Status must be PENDING, ACCEPTED or REJECTED',
  })
  @IsNotEmpty()
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
