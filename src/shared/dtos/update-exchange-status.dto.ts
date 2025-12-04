import { IsEnum } from 'class-validator';

import type { ExchangeRequestStatus } from '../interfaces/exchange-request.interface';

export class UpdateExchangeStatusDto {
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED'])
  status: ExchangeRequestStatus;
}
