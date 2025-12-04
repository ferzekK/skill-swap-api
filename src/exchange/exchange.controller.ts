import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ExchangeService } from './exchange.service';
import { ExchangeRequest } from '../database/models';
import { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import { UpdateExchangeStatusDto } from '../shared/dtos/update-exchange-status.dto';

@ApiTags('exchanges')
@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  @ApiOperation({ summary: 'Create exchange request' })
  @ApiCreatedResponse({ description: 'Exchange request created successfully' })
  async create(
    @Body() createExchangeDto: CreateExchangeRequestDto,
  ): Promise<ExchangeRequest> {
    return this.exchangeService.createExchange(createExchangeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exchange requests' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    description: 'Filter by status',
  })
  @ApiOkResponse({ description: 'List of exchange requests' })
  async findAll(
    @Query('status') status?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<ExchangeRequest[]> {
    if (status) {
      return this.exchangeService.findByStatus(status);
    }
    return this.exchangeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange request by ID' })
  @ApiParam({ name: 'id', description: 'Exchange request UUID' })
  @ApiOkResponse({ description: 'Exchange request data' })
  @ApiNotFoundResponse({ description: 'Exchange request not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExchangeRequest> {
    return this.exchangeService.findByIdOrThrow(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user exchange requests' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiOkResponse({ description: 'List of user exchange requests' })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ExchangeRequest[]> {
    return this.exchangeService.findByUserId(userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update exchange request status' })
  @ApiParam({ name: 'id', description: 'Exchange request UUID' })
  @ApiOkResponse({ description: 'Status updated successfully' })
  @ApiNotFoundResponse({ description: 'Exchange request not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateExchangeStatusDto,
  ): Promise<ExchangeRequest> {
    return this.exchangeService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete exchange request' })
  @ApiParam({ name: 'id', description: 'Exchange request UUID' })
  @ApiNotFoundResponse({ description: 'Exchange request not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.exchangeService.delete(id);
  }
}
