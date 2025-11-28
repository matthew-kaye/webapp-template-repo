import { DataSource } from 'typeorm';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarkEntity } from './bookmark.entity';

describe('BookmarksRepository', () => {
  let dataSource: DataSource;
  let repository: BookmarksRepository;

  beforeAll(async () => {
    dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [BookmarkEntity],
      synchronize: true,
      logging: false
    }).initialize();
    repository = new BookmarksRepository(dataSource.getRepository(BookmarkEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(BookmarkEntity).clear();
  });

  it('creates and returns a bookmark', async () => {
    const bookmarkData = {
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: 'web,development'
    };

    const bookmark = await repository.create(bookmarkData);

    expect(bookmark).toMatchObject(bookmarkData);
    expect(bookmark.id).toBeDefined();

    // Verify it was saved to the database
    const saved = await dataSource
      .getRepository(BookmarkEntity)
      .findOne({ where: { id: bookmark.id } });
    expect(saved).toBeDefined();
    expect(saved?.title).toBe('Example Bookmark');
    expect(saved?.url).toBe('https://example.com');
    expect(saved?.tags).toBe('web,development');
  });

  describe('update', () => {
    it('updates a bookmark by id', async () => {
      const repo = dataSource.getRepository(BookmarkEntity);
      const saved = await repo.save({
        title: 'Original Title',
        url: 'https://original.com',
        tags: 'original'
      });

      const updated = await repository.update(saved.id, {
        title: 'Updated Title',
        url: 'https://updated.com',
        tags: 'updated'
      });

      expect(updated.id).toBe(saved.id);
      expect(updated.title).toBe('Updated Title');
      expect(updated.url).toBe('https://updated.com');
      expect(updated.tags).toBe('updated');

      const found = await repo.findOne({ where: { id: saved.id } });
      expect(found?.title).toBe('Updated Title');
      expect(found?.url).toBe('https://updated.com');
      expect(found?.tags).toBe('updated');
    });
  });

  describe('list', () => {
    it('returns all bookmarks', async () => {
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

      const bookmarks = await repository.list();

      expect(bookmarks).toHaveLength(2);
      expect(bookmarks[0].title).toBe('Example Bookmark 1');
      expect(bookmarks[1].title).toBe('Example Bookmark 2');
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

      const bookmarks = await repository.list('web');

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].title).toBe('Web Development');
    });

    it('searches bookmarks by title', async () => {
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

      const bookmarks = await repository.list(undefined, 'React');

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].title).toBe('React Documentation');
    });

    it('searches bookmarks by URL', async () => {
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

      const bookmarks = await repository.list(undefined, 'vuejs');

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].title).toBe('Vue Guide');
    });

    it('combines tag filter and search query', async () => {
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
        },
        {
          title: 'React Native',
          url: 'https://reactnative.dev',
          tags: 'mobile,react'
        }
      ]);

      const bookmarks = await repository.list('web', 'React');

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].title).toBe('React Documentation');
    });
  });

  describe('delete', () => {
    it('deletes a bookmark by id', async () => {
      const repo = dataSource.getRepository(BookmarkEntity);
      const saved = await repo.save({
        title: 'Example Bookmark',
        url: 'https://example.com',
        tags: 'web,development'
      });

      await repository.delete(saved.id);

      const found = await repo.findOne({ where: { id: saved.id } });
      expect(found).toBeNull();
    });
  });

  describe('deleteAll', () => {
    it('deletes all bookmarks', async () => {
      const repo = dataSource.getRepository(BookmarkEntity);
      await repo.save([
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

      await repository.deleteAll();

      const count = await repo.count();
      expect(count).toBe(0);
    });
  });
});

