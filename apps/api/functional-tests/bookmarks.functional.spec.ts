import { DataSource } from 'typeorm';
import request from 'supertest';
import { BookmarkEntity } from '@app/bookmarks/infrastructure/typeorm/bookmark.entity';
import {
  getFunctionalTestContext,
  waitForFunctionalTestContext
} from './context';
import { BookmarkStateDriver } from './utils/bookmark-state-driver';

describe('Bookmarks API (functional)', () => {
  let dataSource: DataSource;
  let bookmarkStateDriver: BookmarkStateDriver;
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
      bookmarkStateDriver = BookmarkStateDriver.create(dataSource);
    },
    60_000
  );

  beforeEach(async () => {
    await bookmarkStateDriver.clear();
  });

  describe('POST /bookmarks/create', () => {
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

  describe('PUT /bookmarks/:id', () => {
    it('updates a bookmark successfully', async () => {
      const saved = await bookmarkStateDriver.createBookmark({
        title: 'Original Title',
        url: 'https://original.com',
        tags: 'original'
      });

      const updateData = {
        title: 'Updated Title',
        url: 'https://updated.com',
        tags: 'updated'
      };

      const response = await request(baseUrl())
        .put(`/bookmarks/${saved.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        id: saved.id,
        title: 'Updated Title',
        url: 'https://updated.com',
        tags: 'updated',
        created_at: expect.any(String)
      });

      const found = await bookmarkStateDriver.findBookmarkById(saved.id);
      expect(found?.title).toBe('Updated Title');
      expect(found?.url).toBe('https://updated.com');
      expect(found?.tags).toBe('updated');
    });
  });

  describe('GET /bookmarks', () => {
    it('returns list of bookmarks', async () => {
      await bookmarkStateDriver.createBookmarks([
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
      await bookmarkStateDriver.createBookmarks([
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
      await bookmarkStateDriver.createBookmarks([
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

      let response = await request(baseUrl())
        .get('/bookmarks?q=React')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('React Documentation');

      response = await request(baseUrl())
        .get('/bookmarks?q=vuejs')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Vue Guide');
    });
  });

  describe('DELETE /bookmarks/:id', () => {
    it('deletes a bookmark', async () => {
      const saved = await bookmarkStateDriver.createBookmark({
        title: 'To Delete',
        url: 'https://delete.com',
        tags: 'test'
      });

      await request(baseUrl())
        .delete(`/bookmarks/${saved.id}`)
        .expect(200);

      const repo = dataSource.getRepository(BookmarkEntity);
      const found = await repo.findOne({ where: { id: saved.id } });
      expect(found).toBeNull();
    });
  });

  describe('DELETE /bookmarks', () => {
    it('deletes all bookmarks', async () => {
      await bookmarkStateDriver.createBookmarks([
        {
          title: 'Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web'
        },
        {
          title: 'Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design'
        }
      ]);

      await request(baseUrl())
        .delete('/bookmarks')
        .expect(200);

      const repo = dataSource.getRepository(BookmarkEntity);
      const count = await repo.count();
      expect(count).toBe(0);
    });
  });
});

