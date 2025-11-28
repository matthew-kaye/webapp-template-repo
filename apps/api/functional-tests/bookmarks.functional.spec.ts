import { DataSource } from 'typeorm';
import request from 'supertest';
import { BookmarkEntity } from '@app/bookmarks/infrastructure/typeorm/bookmark.entity';
import {
  getFunctionalTestContext,
  waitForFunctionalTestContext
} from './context';

describe('POST /bookmarks/create (functional)', () => {
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
    await dataSource.getRepository(BookmarkEntity).clear();
  });

  it('creates a bookmark successfully', async () => {
    const bookmarkData = {
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: 'web,development',
    };

    const response = await request(baseUrl())
      .post('/bookmarks/create')
      .send(bookmarkData)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: 'web,development',
      created_at: expect.any(String),
    });
    expect(new Date(response.body.created_at)).toBeInstanceOf(Date);
  });
});

