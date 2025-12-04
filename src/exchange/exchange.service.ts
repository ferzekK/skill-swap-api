import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import {
  Skill,
  User,
  ExchangeRequest,
  ExchangeRequestStatus,
} from '../database/models';
import { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
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

    if (dto.requesterId === dto.responderId) {
      throw new BadRequestException(
        'Cannot create exchange request with yourself',
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
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'fullName', 'email'],
        },
        { model: Skill, as: 'skillOffered', attributes: ['id', 'name'] },
        { model: Skill, as: 'skillWanted', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<ExchangeRequest | null> {
    return this.exchangeRequestModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'fullName', 'email'],
        },
        { model: Skill, as: 'skillOffered', attributes: ['id', 'name'] },
        { model: Skill, as: 'skillWanted', attributes: ['id', 'name'] },
      ],
    });
  }

  async findByIdOrThrow(id: string): Promise<ExchangeRequest> {
    const request = await this.findById(id);
    if (!request) {
      throw new NotFoundException(`Exchange request with ID ${id} not found`);
    }
    return request;
  }

  async findByUserId(userId: string): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.findAll({
      where: {
        [Op.or]: [{ requesterId: userId }, { responderId: userId }],
      },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'fullName', 'email'],
        },
        { model: Skill, as: 'skillOffered', attributes: ['id', 'name'] },
        { model: Skill, as: 'skillWanted', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStatus(
    status: ExchangeRequestStatus,
  ): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.findAll({
      where: { status },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'responder',
          attributes: ['id', 'fullName', 'email'],
        },
        { model: Skill, as: 'skillOffered', attributes: ['id', 'name'] },
        { model: Skill, as: 'skillWanted', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async updateStatus(
    id: string,
    status: ExchangeRequestStatus,
  ): Promise<ExchangeRequest> {
    const request = await this.findByIdOrThrow(id);
    await request.update({ status });
    return request;
  }

  async delete(id: string): Promise<void> {
    const request = await this.findByIdOrThrow(id);
    await request.destroy();
  }

  async count(): Promise<number> {
    return this.exchangeRequestModel.count();
  }

  async countByStatus(status: ExchangeRequestStatus): Promise<number> {
    return this.exchangeRequestModel.count({ where: { status } });
  }
}
