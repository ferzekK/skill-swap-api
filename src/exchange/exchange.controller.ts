import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ExchangeService } from './exchange.service';
import { ExchangeRequest } from '../database/models/exchange-request.model';
import type { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import type { UpdateExchangeStatusDto } from '../shared/dtos/update-exchange-status.dto';

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  async create(
    @Body() createExchangeDto: CreateExchangeRequestDto,
  ): Promise<ExchangeRequest> {
    return this.exchangeService.createExchange(createExchangeDto);
  }

  @Get()
  async findAll(): Promise<ExchangeRequest[]> {
    return this.exchangeService.findAll();
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ExchangeRequest[]> {
    return this.exchangeService.findByUserId(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateExchangeStatusDto,
  ): Promise<ExchangeRequest> {
    return this.exchangeService.updateStatus(id, updateStatusDto.status);
  }
}
