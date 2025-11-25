import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { UserEntity } from '../../src/users/infrastructure/typeorm/user.entity';
import { getFunctionalTestContext } from './context';

describe('GET /users/:id (functional)', () => {
  let dataSource: DataSource;
  const baseUrl = () => getFunctionalTestContext().baseUrl;

  beforeAll(() => {
    ({ dataSource } = getFunctionalTestContext());
  });

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
