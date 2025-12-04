import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
  ExchangeRequest,
  ExchangeRequestStatus,
} from '../database/models/exchange-request.model';
import type { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import { SkillsService } from '../skills/skills.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(ExchangeRequest)
    private readonly exchangeRequestModel: typeof ExchangeRequest,
    private readonly usersService: UsersService,
    private readonly skillsService: SkillsService,
  ) {}

  async createExchange(
    dto: CreateExchangeRequestDto,
  ): Promise<ExchangeRequest> {
    const requester = await this.usersService.findById(dto.requesterId);
    if (!requester) {
      throw new BadRequestException(
        `Requester with ID ${dto.requesterId} not found`,
      );
    }

    const responder = await this.usersService.findById(dto.responderId);
    if (!responder) {
      throw new BadRequestException(
        `Responder with ID ${dto.responderId} not found`,
      );
    }

    const offeredSkill = await this.skillsService.findOne(dto.skillOfferedId);
    if (!offeredSkill) {
      throw new BadRequestException(
        `Offered skill with ID ${dto.skillOfferedId} not found`,
      );
    }

    const wantedSkill = await this.skillsService.findOne(dto.skillWantedId);
    if (!wantedSkill) {
      throw new BadRequestException(
        `Wanted skill with ID ${dto.skillWantedId} not found`,
      );
    }

    return this.exchangeRequestModel.create({
      requesterId: dto.requesterId,
      responderId: dto.responderId,
      skillOfferedId: dto.skillOfferedId,
      skillWantedId: dto.skillWantedId,
      status: 'PENDING',
    });
  }

  async findAll(): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.findAll({
      include: [{ all: true }],
    });
  }

  async findById(id: string): Promise<ExchangeRequest | null> {
    return this.exchangeRequestModel.findByPk(id, {
      include: [{ all: true }],
    });
  }

  async findByUserId(userId: string): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.findAll({
      where: {
        requesterId: userId,
      },
      include: [{ all: true }],
    });
  }

  async updateStatus(
    id: string,
    status: ExchangeRequestStatus,
  ): Promise<ExchangeRequest> {
    const request = await this.findById(id);
    if (!request) {
      throw new BadRequestException(`Exchange request with ID ${id} not found`);
    }

    await request.update({ status });
    return request;
  }
}
