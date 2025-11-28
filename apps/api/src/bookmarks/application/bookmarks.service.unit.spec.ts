import { mock } from 'jest-mock-extended';
import { Bookmark } from '../domain/bookmark';
import { BookmarksRepositoryPort } from '../domain/bookmarks.repository.port';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  describe('create', () => {
    it('creates a bookmark using the repository', async () => {
      const repository = mock<BookmarksRepositoryPort>();
      const service = new BookmarksService(repository);
      const bookmarkData: Omit<Bookmark, 'id' | 'created_at'> = {
        title: 'Example Bookmark',
        url: 'https://example.com',
        tags: 'web,development'
      };
      const createdBookmark: Bookmark = {
        id: 'bookmark-1',
        ...bookmarkData,
        created_at: new Date('2024-01-15T10:30:00Z')
      };

      repository.create.mockResolvedValue(createdBookmark);

      const result = await service.createBookmark(bookmarkData);

      expect(result).toEqual(createdBookmark);
      expect(repository.create).toHaveBeenCalledWith(bookmarkData);
    });
  });

  describe('list', () => {
    it('returns list of bookmarks from repository', async () => {
      const repository = mock<BookmarksRepositoryPort>();
      const bookmarks: Bookmark[] = [
        {
          id: '1',
          title: 'Example Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web,development',
          created_at: new Date('2024-01-15T10:30:00Z')
        },
        {
          id: '2',
          title: 'Example Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design,resources',
          created_at: new Date('2024-01-16T10:30:00Z')
        }
      ];

      repository.list.mockResolvedValue(bookmarks);
      const service = new BookmarksService(repository);

      const result = await service.listBookmarks();

      expect(result).toEqual(bookmarks);
      expect(repository.list).toHaveBeenCalledWith(undefined, undefined);
    });

    it('filters bookmarks by tag', async () => {
      const repository = mock<BookmarksRepositoryPort>();
      const bookmarks: Bookmark[] = [
        {
          id: '1',
          title: 'Web Development',
          url: 'https://web.dev',
          tags: 'web,development',
          created_at: new Date('2024-01-15T10:30:00Z')
        }
      ];

      repository.list.mockResolvedValue(bookmarks);
      const service = new BookmarksService(repository);

      const result = await service.listBookmarks('web');

      expect(result).toEqual(bookmarks);
      expect(repository.list).toHaveBeenCalledWith('web', undefined);
    });

    it('searches bookmarks by query', async () => {
      const repository = mock<BookmarksRepositoryPort>();
      const bookmarks: Bookmark[] = [
        {
          id: '1',
          title: 'React Documentation',
          url: 'https://react.dev',
          tags: 'web,react',
          created_at: new Date('2024-01-15T10:30:00Z')
        }
      ];

      repository.list.mockResolvedValue(bookmarks);
      const service = new BookmarksService(repository);

      const result = await service.listBookmarks(undefined, 'React');

      expect(result).toEqual(bookmarks);
      expect(repository.list).toHaveBeenCalledWith(undefined, 'React');
    });
  });

  describe('delete', () => {
    it('deletes a bookmark using the repository', async () => {
      const repository = mock<BookmarksRepositoryPort>();
      repository.delete.mockResolvedValue(undefined);
      const service = new BookmarksService(repository);

      await service.deleteBookmark('bookmark-1');

      expect(repository.delete).toHaveBeenCalledWith('bookmark-1');
    });
  });
});

