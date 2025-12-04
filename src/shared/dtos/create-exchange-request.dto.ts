import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExchangeRequestDto {
  @IsString()
  @IsNotEmpty()
  requesterId: string;

  @IsString()
  @IsNotEmpty()
  responderId: string;

  @IsString()
  @IsNotEmpty()
  skillOfferedId: string;

  @IsString()
  @IsNotEmpty()
  skillWantedId: string;
}
