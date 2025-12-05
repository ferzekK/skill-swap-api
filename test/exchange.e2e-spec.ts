import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { TestAppModule } from './test-app.module';
import { User, Skill } from '../src/database/models';

describe('Exchange (e2e)', () => {
  let app: INestApplication<App>;
  let testUser1: User;
  let testUser2: User;
  let testSkill1: Skill;
  let testSkill2: Skill;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const userModel = moduleFixture.get('UserRepository');
    const skillModel = moduleFixture.get('SkillRepository');

    testUser1 = await userModel.create({
      email: 'user1@test.com',
      fullName: 'Test User One',
      passwordHash: 'hash123',
    });

    testUser2 = await userModel.create({
      email: 'user2@test.com',
      fullName: 'Test User Two',
      passwordHash: 'hash456',
    });

    testSkill1 = await skillModel.create({
      name: 'JavaScript',
      description: 'Programming language',
    });

    testSkill2 = await skillModel.create({
      name: 'Python',
      description: 'Another programming language',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /exchanges', () => {
    it('should create an exchange request', async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: testUser1.id,
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('PENDING');
      expect(response.body.requesterId).toBe(testUser1.id);
      expect(response.body.responderId).toBe(testUser2.id);
    });

    it('should return 400 when requester is not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        })
        .expect(400);

      expect(response.body.message).toContain('Requester');
    });

    it('should return 400 when trying to exchange with yourself', async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: testUser1.id,
          responderId: testUser1.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        })
        .expect(400);

      expect(response.body.message).toContain('yourself');
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: 'invalid-uuid',
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        })
        .expect(400);
    });
  });

  describe('GET /exchanges', () => {
    it('should return all exchange requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/exchanges')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/exchanges?status=PENDING')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((exchange: any) => {
        expect(exchange.status).toBe('PENDING');
      });
    });
  });

  describe('GET /exchanges/:id', () => {
    let exchangeId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: testUser1.id,
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        });
      exchangeId = response.body.id;
    });

    it('should return an exchange by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exchanges/${exchangeId}`)
        .expect(200);

      expect(response.body.id).toBe(exchangeId);
    });

    it('should return 404 for non-existent exchange', async () => {
      await request(app.getHttpServer())
        .get('/exchanges/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/exchanges/invalid-uuid')
        .expect(400);
    });
  });

  describe('PATCH /exchanges/:id/status', () => {
    let exchangeId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: testUser1.id,
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        });
      exchangeId = response.body.id;
    });

    it('should update status to ACCEPTED', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/exchanges/${exchangeId}/status`)
        .send({ status: 'ACCEPTED' })
        .expect(200);

      expect(response.body.status).toBe('ACCEPTED');
    });

    it('should update status to REJECTED', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/exchanges/${exchangeId}/status`)
        .send({ status: 'REJECTED' })
        .expect(200);

      expect(response.body.status).toBe('REJECTED');
    });

    it('should return 404 for non-existent exchange', async () => {
      await request(app.getHttpServer())
        .patch('/exchanges/00000000-0000-0000-0000-000000000000/status')
        .send({ status: 'ACCEPTED' })
        .expect(404);
    });
  });

  describe('DELETE /exchanges/:id', () => {
    let exchangeId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/exchanges')
        .send({
          requesterId: testUser1.id,
          responderId: testUser2.id,
          skillOfferedId: testSkill1.id,
          skillWantedId: testSkill2.id,
        });
      exchangeId = response.body.id;
    });

    it('should delete an exchange', async () => {
      await request(app.getHttpServer())
        .delete(`/exchanges/${exchangeId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/exchanges/${exchangeId}`)
        .expect(404);
    });

    it('should return 404 for non-existent exchange', async () => {
      await request(app.getHttpServer())
        .delete('/exchanges/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /exchanges/user/:userId', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).post('/exchanges').send({
        requesterId: testUser1.id,
        responderId: testUser2.id,
        skillOfferedId: testSkill1.id,
        skillWantedId: testSkill2.id,
      });
    });

    it('should return exchanges for a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exchanges/user/${testUser1.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array for user with no exchanges', async () => {
      const response = await request(app.getHttpServer())
        .get('/exchanges/user/00000000-0000-0000-0000-000000000000')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
