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
});

