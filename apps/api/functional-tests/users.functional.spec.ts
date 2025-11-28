import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { UserEntity } from '@app/users/infrastructure/typeorm/user.entity';
import {
  getFunctionalTestContext,
  waitForFunctionalTestContext
} from './context';

describe('GET /users/:id (functional)', () => {
  let dataSource: DataSource;
  const baseUrl = () => getFunctionalTestContext().baseUrl;

  beforeAll(
    async () => {
      let context;
      try {
        context = getFunctionalTestContext();
      } catch {
        context = await waitForFunctionalTestContext(5000, 50);
      }
      ({ dataSource } = context);
    },
    60_000
  );

  beforeEach(async () => {
    await dataSource.getRepository(UserEntity).clear();
  });

  it('returns the user when it exists', async () => {
    const saved = await dataSource.getRepository(UserEntity).save({});

    await request(baseUrl())
      .get(`/users/${saved.id}`)
      .expect(200)
      .expect({ id: saved.id });
  });

  it('returns 404 when user does not exist', async () => {
    await request(baseUrl()).get(`/users/${randomUUID()}`).expect(404);
  });
});
