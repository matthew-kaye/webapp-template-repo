import { DataSource } from 'typeorm';
import request from 'supertest';
import { BookmarkEntity } from '@app/bookmarks/infrastructure/typeorm/bookmark.entity';
import {
  getFunctionalTestContext,
  waitForFunctionalTestContext
} from './context';

describe('Bookmarks API (functional)', () => {
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

  describe('GET /bookmarks', () => {
    it('returns list of bookmarks', async () => {
      // Create test bookmarks
      const repo = dataSource.getRepository(BookmarkEntity);
      await repo.save([
        {
          title: 'Example Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web,development'
        },
        {
          title: 'Example Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design,resources'
        }
      ]);

      const response = await request(baseUrl())
        .get('/bookmarks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        title: expect.any(String),
        url: expect.any(String),
        tags: expect.any(String)
      });
    });

    it('filters bookmarks by tag', async () => {
      const repo = dataSource.getRepository(BookmarkEntity);
      await repo.save([
        {
          title: 'Web Development',
          url: 'https://web.dev',
          tags: 'web,development'
        },
        {
          title: 'Design Resources',
          url: 'https://design.com',
          tags: 'design,resources'
        }
      ]);

      const response = await request(baseUrl())
        .get('/bookmarks?tag=web')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Web Development');
    });

    it('searches bookmarks by title and URL', async () => {
      const repo = dataSource.getRepository(BookmarkEntity);
      await repo.save([
        {
          title: 'React Documentation',
          url: 'https://react.dev',
          tags: 'web,react'
        },
        {
          title: 'Vue Guide',
          url: 'https://vuejs.org',
          tags: 'web,vue'
        }
      ]);

      // Search by title
      let response = await request(baseUrl())
        .get('/bookmarks?q=React')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('React Documentation');

      // Search by URL
      response = await request(baseUrl())
        .get('/bookmarks?q=vuejs')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Vue Guide');
    });
  });
});

