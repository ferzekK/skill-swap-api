import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { TestAppModule } from './test-app.module';

describe('Skills (e2e)', () => {
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

  describe('POST /skills', () => {
    it('should create a new skill', async () => {
      const response = await request(app.getHttpServer())
        .post('/skills')
        .send({
          name: 'TypeScript',
          description: 'Typed JavaScript superset',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('TypeScript');
      expect(response.body.description).toBe('Typed JavaScript superset');
    });

    it('should return 400 for missing name', async () => {
      await request(app.getHttpServer())
        .post('/skills')
        .send({
          description: 'Some description',
        })
        .expect(400);
    });
  });

  describe('GET /skills', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/skills')
        .send({ name: 'React', description: 'UI library' });
      await request(app.getHttpServer())
        .post('/skills')
        .send({ name: 'Node.js', description: 'JavaScript runtime' });
    });

    it('should return all skills', async () => {
      const response = await request(app.getHttpServer())
        .get('/skills')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /skills/:id', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/skills').send({
        name: 'GetById Skill',
        description: 'Skill for get by id test',
      });
      skillId = response.body.id;
    });

    it('should return a skill by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/skills/${skillId}`)
        .expect(200);

      expect(response.body.id).toBe(skillId);
      expect(response.body.name).toBe('GetById Skill');
    });

    it('should return 404 for non-existent skill', async () => {
      await request(app.getHttpServer())
        .get('/skills/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/skills/invalid-uuid')
        .expect(400);
    });
  });

  describe('PATCH /skills/:id', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/skills').send({
        name: 'Update Skill',
        description: 'Original description',
      });
      skillId = response.body.id;
    });

    it('should update a skill', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/skills/${skillId}`)
        .send({
          name: 'Updated Skill Name',
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Skill Name');
      expect(response.body.description).toBe('Updated description');
    });

    it('should partially update a skill', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/skills/${skillId}`)
        .send({
          description: 'Only description updated',
        })
        .expect(200);

      expect(response.body.description).toBe('Only description updated');
    });

    it('should return 404 for non-existent skill', async () => {
      await request(app.getHttpServer())
        .patch('/skills/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .send({
          name: 'New Name',
        })
        .expect(404);
    });
  });

  describe('DELETE /skills/:id', () => {
    it('should delete a skill', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/skills')
        .send({
          name: 'Skill To Delete',
          description: 'Will be deleted',
        });

      await request(app.getHttpServer())
        .delete(`/skills/${createResponse.body.id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/skills/${createResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent skill', async () => {
      await request(app.getHttpServer())
        .delete('/skills/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')
        .expect(404);
    });
  });
});
