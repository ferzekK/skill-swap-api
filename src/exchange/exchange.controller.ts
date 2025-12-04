import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ExchangeService } from './exchange.service';
import type { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import type { UpdateExchangeStatusDto } from '../shared/dtos/update-exchange-status.dto';
import type { ExchangeRequest } from '../shared/interfaces/exchange-request.interface';

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  create(@Body() createExchangeDto: CreateExchangeRequestDto): ExchangeRequest {
    return this.exchangeService.createExchange(createExchangeDto);
  }

  @Get()
  findAll(): ExchangeRequest[] {
    return this.exchangeService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): ExchangeRequest[] {
    return this.exchangeService.findByUserId(userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateExchangeStatusDto,
  ): ExchangeRequest {
    return this.exchangeService.updateStatus(id, updateStatusDto.status);
  }
}
