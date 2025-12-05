import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { ExchangeService } from './exchange.service';
import { ExchangeRequest, ExchangeRequestStatus } from '../database/models';
import { CreateExchangeRequestDto } from '../shared/dtos/create-exchange-request.dto';
import { SkillsService } from '../skills/skills.service';
import { UsersService } from '../users/users.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let usersService: UsersService;
  let skillsService: SkillsService;

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
    usersService = module.get<UsersService>(UsersService);
    skillsService = module.get<SkillsService>(SkillsService);

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
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-1');
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-2');
      expect(mockSkillsService.findOne).toHaveBeenCalledWith('skill-1');
      expect(mockSkillsService.findOne).toHaveBeenCalledWith('skill-2');
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
    });

    it('should throw BadRequestException when responder is not found', async () => {
      mockUsersService.findById
        .mockResolvedValueOnce(mockRequester)
        .mockResolvedValueOnce(null);

      await expect(service.createExchange(validDto)).rejects.toThrow(
        BadRequestException,
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
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all exchange requests', async () => {
      const mockExchanges = [
        { id: 'exchange-1', status: 'PENDING' },
        { id: 'exchange-2', status: 'ACCEPTED' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findAll();

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no exchanges exist', async () => {
      mockExchangeRequestModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return an exchange request by id', async () => {
      const mockExchange = { id: 'exchange-1', status: 'PENDING' };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.findById('exchange-1');

      expect(result).toEqual(mockExchange);
      expect(mockExchangeRequestModel.findByPk).toHaveBeenCalledWith(
        'exchange-1',
        expect.any(Object),
      );
    });

    it('should return null when exchange is not found', async () => {
      mockExchangeRequestModel.findByPk.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
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
    it('should return exchanges where user is requester or responder', async () => {
      const mockExchanges = [
        { id: 'exchange-1', requesterId: 'user-1', responderId: 'user-2' },
        { id: 'exchange-2', requesterId: 'user-3', responderId: 'user-1' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByUserId('user-1');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findByStatus', () => {
    it('should return exchanges filtered by status', async () => {
      const mockExchanges = [
        { id: 'exchange-1', status: 'PENDING' },
        { id: 'exchange-2', status: 'PENDING' },
      ];
      mockExchangeRequestModel.findAll.mockResolvedValue(mockExchanges);

      const result = await service.findByStatus('PENDING');

      expect(result).toEqual(mockExchanges);
      expect(mockExchangeRequestModel.findAll).toHaveBeenCalled();
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
      expect(result).toEqual(mockExchange);
    });

    it('should update status to REJECTED', async () => {
      const mockExchange = {
        id: 'exchange-1',
        status: 'PENDING' as ExchangeRequestStatus,
        update: jest.fn().mockResolvedValue(undefined),
      };
      mockExchangeRequestModel.findByPk.mockResolvedValue(mockExchange);

      const result = await service.updateStatus('exchange-1', 'REJECTED');

      expect(mockExchange.update).toHaveBeenCalledWith({ status: 'REJECTED' });
      expect(result).toEqual(mockExchange);
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
      expect(mockExchangeRequestModel.count).toHaveBeenCalled();
    });
  });

  describe('countByStatus', () => {
    it('should return count of exchanges by status', async () => {
      mockExchangeRequestModel.count.mockResolvedValue(3);

      const result = await service.countByStatus('PENDING');

      expect(result).toBe(3);
      expect(mockExchangeRequestModel.count).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
      });
    });
  });
});
