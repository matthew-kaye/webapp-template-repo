import { DataSource } from 'typeorm';
import { TypeOrmUsersRepository } from './users.repository';
import { UserEntity } from './user.entity';

describe('TypeOrmUsersRepository', () => {
  let dataSource: DataSource;
  let repository: TypeOrmUsersRepository;

  beforeAll(async () => {
    dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [UserEntity],
      synchronize: true
    }).initialize();
    repository = new TypeOrmUsersRepository(dataSource.getRepository(UserEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('returns the user when it exists', async () => {
    const saved = await dataSource.getRepository(UserEntity).save({});

    const user = await repository.findById(saved.id);

    expect(user).toEqual({ id: saved.id });
  });

  it('returns null when user is missing', async () => {
    const user = await repository.findById('missing');

    expect(user).toBeNull();
  });
});
