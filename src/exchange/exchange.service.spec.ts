import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';

import { ExchangeService } from './exchange.service';
import {
  ExchangeRequest,
  ExchangeRequestStatus,
  Skill,
  User,
} from '../database/models';
import { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import { SkillsService } from '../skills/skills.service';
import { UsersService } from '../users/users.service';

describe('ExchangeService', () => {
  let service: ExchangeService;

  const mockExchangeRequestModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockSkillsService = {
    findOne: jest.fn(),
  };

  const expectedInclude = [
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: getModelToken(ExchangeRequest),
          useValue: mockExchangeRequestModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createExchange', () => {
    const mockRequester = {
      id: 'user-1',
      fullName: 'John Doe',
      email: 'john@example.com',
    };
    const mockResponder = {
      id: 'user-2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
    };
    const mockOfferedSkill = { id: 'skill-1', name: 'JavaScript' };
    const mockWantedSkill = { id: 'skill-2', name: 'Python' };

    const validDto: CreateExchangeRequestDto = {
      requesterId: 'user-1',
      responderId: 'user-2',
      skillOfferedId: 'skill-1',
      skillWantedId: 'skill-2',
    };

    it('should create an exchange request successfully', async () => {
      const expectedExchange = {
        id: 'exchange-1',
        ...validDto,
        status: 'PENDING',
      };

      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(mockResponder);
      mockSkillsService.findOne
        .mockResolvedValueOnce(mockOfferedSkill)
        .mockResolvedValueOnce(mockWantedSkill);
      mockExchangeRequestModel.create.mockResolvedValue(expectedExchange);

      const result = await service.createExchange(validDto);

      expect(result).toEqual(expectedExchange);
      expect(mockUsersService.findById).toHaveBeenNthCalledWith(1, 'user-1');
      expect(mockUsersService.findById).toHaveBeenNthCalledWith(2, 'user-2');
      expect(mockSkillsService.findOne).toHaveBeenNthCalledWith(1, 'skill-1');
      expect(mockSkillsService.findOne).toHaveBeenNthCalledWith(2, 'skill-2');
      expect(mockExchangeRequestModel.create).toHaveBeenCalledWith({
        requesterId: 'user-1',
        responderId: 'user-2',
        skillOfferedId: 'skill-1',
        skillWantedId: 'skill-2',
        status: 'PENDING',
      });
    });

    it('should throw BadRequestException when requester is not found', async () => {
      mockUsersService.findById.mockResolvedValueOnce(null);

      await expect(service.createExchange(validDto)).rejects.toThrow(
        new BadRequestException(
          `Requester with ID ${validDto.requesterId} not found`,
        ),
      );
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw BadRequestException when responder is not found', async () => {
      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(null);

      await expect(service.createExchange(validDto)).rejects.toThrow(
        new BadRequestException(
          `Responder with ID ${validDto.responderId} not found`,
        ),
      );
    });

    it('should throw BadRequestException when requester and responder are the same', async () => {
      const sameUserDto: CreateExchangeRequestDto = {
        ...validDto,
        responderId: 'user-1',
      };

      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(mockRequester);

      await expect(service.createExchange(sameUserDto)).rejects.toThrow(
        new BadRequestException('Cannot create exchange request with yourself'),
      );
    });

    it('should throw BadRequestException when offered skill is not found', async () => {
      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(mockResponder);
      mockSkillsService.findOne.mockResolvedValueOnce(null);

      await expect(service.createExchange(validDto)).rejects.toThrow(
        new BadRequestException(
          `Offered skill with ID ${validDto.skillOfferedId} not found`,
        ),
      );
    });

    it('should throw BadRequestException when wanted skill is not found', async () => {
      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(mockResponder);
      mockSkillsService.findOne
        .mockResolvedValueOnce(mockOfferedSkill)
        .mockResolvedValueOnce(null);

      await expect(service.createExchange(validDto)).rejects.toThrow(
        new BadRequestException(
          `Wanted skill with ID ${validDto.skillWantedId} not found`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return all exchange requests with correct query options', async () => {
      const mockExchanges = [
        { id: 'exchange-1', status: 'PENDING' },
        { id: 'exchange-2', status: 'ACCEPTED' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findAll();

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array when no exchanges exist', async () => {
      mockExchangeRequestModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('findById', () => {
    it('should return an exchange request by id with correct query options', async () => {
      const mockExchange = { id: 'exchange-1', status: 'PENDING' };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.findById('exchange-1');

      expect(result).toEqual(mockExchange);
      expect(mockExchangeRequestModel.findByPk).toHaveBeenCalledWith(
        'exchange-1',
        {
          include: expectedInclude,
        },
      );
    });

    it('should return null when exchange is not found', async () => {
      mockExchangeRequestModel.findByPk.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
      expect(mockExchangeRequestModel.findByPk).toHaveBeenCalledWith(
        'non-existent',
        {
          include: expectedInclude,
        },
      );
    });
  });

  describe('findByIdOrThrow', () => {
    it('should return an exchange request when found', async () => {
      const mockExchange = { id: 'exchange-1', status: 'PENDING' };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.findByIdOrThrow('exchange-1');

      expect(result).toEqual(mockExchange);
    });

    it('should throw NotFoundException when exchange is not found', async () => {
      mockExchangeRequestModel.findByPk.mockResolvedValue(null);

      await expect(service.findByIdOrThrow('non-existent')).rejects.toThrow(
        new NotFoundException(
          'Exchange request with ID non-existent not found',
        ),
      );
    });
  });

  describe('findByUserId', () => {
    it('should return exchanges where user is requester or responder with correct query', async () => {
      const mockExchanges = [
        { id: 'exchange-1', requesterId: 'user-1', responderId: 'user-2' },
        { id: 'exchange-2', requesterId: 'user-3', responderId: 'user-1' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByUserId('user-1');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ requesterId: 'user-1' }, { responderId: 'user-1' }],
        },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array when user has no exchanges', async () => {
      mockExchangeRequestModel.findAll.mockResolvedValue([]);

      const result = await service.findByUserId('user-999');

      expect(result).toEqual([]);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ requesterId: 'user-999' }, { responderId: 'user-999' }],
        },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('findByStatus', () => {
    it('should return exchanges filtered by PENDING status with correct query', async () => {
      const mockExchanges = [
        { id: 'exchange-1', status: 'PENDING' },
        { id: 'exchange-2', status: 'PENDING' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByStatus('PENDING');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return exchanges filtered by ACCEPTED status', async () => {
      const mockExchanges = [{ id: 'exchange-1', status: 'ACCEPTED' }];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByStatus('ACCEPTED');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: { status: 'ACCEPTED' },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return exchanges filtered by REJECTED status', async () => {
      const mockExchanges = [{ id: 'exchange-1', status: 'REJECTED' }];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByStatus('REJECTED');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: { status: 'REJECTED' },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array when no exchanges match status', async () => {
      mockExchangeRequestModel.findAll.mockResolvedValue([]);

      const result = await service.findByStatus('REJECTED');

      expect(result).toEqual([]);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalledWith({
        where: { status: 'REJECTED' },
        include: expectedInclude,
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('updateStatus', () => {
    it('should update status to ACCEPTED', async () => {
      const mockExchange = {
        id: 'exchange-1',
        status: 'PENDING' as ExchangeRequestStatus,
        update: jest.fn().mockImplementation(function (this: any, data: any) {
          this.status = data.status;
          return Promise.resolve(this);
        }),
      };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.updateStatus('exchange-1', 'ACCEPTED');

      expect(mockExchange.update).toHaveBeenCalledWith({ status: 'ACCEPTED' });
      expect(result.status).toBe('ACCEPTED');
    });

    it('should update status to REJECTED', async () => {
      const mockExchange = {
        id: 'exchange-1',
        status: 'PENDING' as ExchangeRequestStatus,
        update: jest.fn().mockImplementation(function (this: any, data: any) {
          this.status = data.status;
          return Promise.resolve(this);
        }),
      };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.updateStatus('exchange-1', 'REJECTED');

      expect(mockExchange.update).toHaveBeenCalledWith({ status: 'REJECTED' });
      expect(result.status).toBe('REJECTED');
    });

    it('should throw NotFoundException when exchange does not exist', async () => {
      mockExchangeRequestModel.findByPk.mockResolvedValue(null);

      await expect(
        service.updateStatus('non-existent', 'ACCEPTED'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an exchange request', async () => {
      const mockExchange = {
        id: 'exchange-1',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      await service.delete('exchange-1');

      expect(mockExchange.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when exchange does not exist', async () => {
      mockExchangeRequestModel.findByPk.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('count', () => {
    it('should return total count of exchanges', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(5);

      const result = await service.count();

      expect(result).toBe(5);
      expect(mockExchangeRequestModel.count).toHaveBeenCalledWith();
    });

    it('should return zero when no exchanges exist', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(0);

      const result = await service.count();

      expect(result).toBe(0);
    });
  });

  describe('countByStatus', () => {
    it('should return count of PENDING exchanges', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(3);

      const result = await service.countByStatus('PENDING');

      expect(result).toBe(3);
      expect(mockExchangeRequestModel.count).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
      });
    });

    it('should return count of ACCEPTED exchanges', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(2);

      const result = await service.countByStatus('ACCEPTED');

      expect(result).toBe(2);
      expect(mockExchangeRequestModel.count).toHaveBeenCalledWith({
        where: { status: 'ACCEPTED' },
      });
    });

    it('should return count of REJECTED exchanges', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(1);

      const result = await service.countByStatus('REJECTED');

      expect(result).toBe(1);
      expect(mockExchangeRequestModel.count).toHaveBeenCalledWith({
        where: { status: 'REJECTED' },
      });
    });
  });
});
