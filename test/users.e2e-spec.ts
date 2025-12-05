import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { TestAppModule } from './test-app.module';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'newuser@example.com',
          fullName: 'New User',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.fullName).toBe('New User');
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          fullName: 'Test User',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test2@example.com',
        })
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'getbyid@example.com',
        fullName: 'Get By Id User',
        password: 'password123',
      });
      userId = response.body.id;
    });

    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('getbyid@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer()).get('/users/invalid-uuid').expect(400);
    });
  });

  describe('PATCH /users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'update@example.com',
        fullName: 'Update User',
        password: 'password123',
      });
      userId = response.body.id;
    });

    it('should update a user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({
          fullName: 'Updated Name',
        })
        .expect(200);

      expect(response.body.fullName).toBe('Updated Name');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .patch('/users/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .send({
          fullName: 'New Name',
        })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'delete-me@example.com',
          fullName: 'Delete Me',
          password: 'password123',
        });

      await request(app.getHttpServer())
        .delete(`/users/${createResponse.body.id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/users/${createResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .expect(404);
    });
  });
});
