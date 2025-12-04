import { BadRequestException, Injectable } from '@nestjs/common';

import type { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import type { ExchangeRequest } from '../shared/interfaces/exchange-request.interface';
import { SkillsService } from '../skills/skills.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExchangeService {
  private requests: ExchangeRequest[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly skillsService: SkillsService,
  ) {}

  createExchange(dto: CreateExchangeRequestDto): ExchangeRequest {
    // Validate requester exists
    const requester = this.usersService.findById(dto.requesterId);
    if (!requester) {
      throw new BadRequestException(
        `Requester with ID ${dto.requesterId} not found`,
      );
    }

    // Validate responder exists
    const responder = this.usersService.findById(dto.responderId);
    if (!responder) {
      throw new BadRequestException(
        `Responder with ID ${dto.responderId} not found`,
      );
    }

    // Validate offered skill exists
    const offeredSkill = this.skillsService.findOne(dto.skillOfferedId);
    if (!offeredSkill) {
      throw new BadRequestException(
        `Offered skill with ID ${dto.skillOfferedId} not found`,
      );
    }

    // Validate wanted skill exists
    const wantedSkill = this.skillsService.findOne(dto.skillWantedId);
    if (!wantedSkill) {
      throw new BadRequestException(
        `Wanted skill with ID ${dto.skillWantedId} not found`,
      );
    }

    // Create exchange request with PENDING status
    const newRequest: ExchangeRequest = {
      id: Date.now().toString(),
      requesterId: dto.requesterId,
      responderId: dto.responderId,
      skillOfferedId: dto.skillOfferedId,
      skillWantedId: dto.skillWantedId,
      status: 'PENDING',
    };

    this.requests.push(newRequest);
    return newRequest;
  }

  findAll(): ExchangeRequest[] {
    return this.requests;
  }

  findById(id: string): ExchangeRequest | undefined {
    return this.requests.find((request) => request.id === id);
  }
}
