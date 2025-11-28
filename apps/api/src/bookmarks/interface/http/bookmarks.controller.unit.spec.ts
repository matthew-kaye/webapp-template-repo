import { mock } from 'jest-mock-extended';
import { BookmarksService } from '../../application/bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from '../../domain/bookmark';

describe('BookmarksController', () => {
  describe('create', () => {
    it('creates a bookmark and returns the created bookmark', async () => {
      const service = mock<BookmarksService>();
      const bookmarkData = {
        title: 'Example Bookmark',
        url: 'https://example.com',
        tags: 'web,development'
      };
      const createdBookmark = {
        id: 'bookmark-1',
        ...bookmarkData,
        created_at: new Date('2024-01-15T10:30:00Z')
      };

      service.createBookmark.mockResolvedValue(createdBookmark);
      const controller = new BookmarksController(service);

      const response = await controller.createBookmark(bookmarkData);

      expect(response).toEqual({
        id: 'bookmark-1',
        title: 'Example Bookmark',
        url: 'https://example.com',
        tags: 'web,development',
        created_at: new Date('2024-01-15T10:30:00Z')
      });
      expect(service.createBookmark).toHaveBeenCalledWith(bookmarkData);
    });
  });

  describe('update', () => {
    it('updates a bookmark and returns the updated bookmark', async () => {
      const service = mock<BookmarksService>();
      const bookmarkData = {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
        tags: 'updated'
      };
      const updatedBookmark = {
        id: 'bookmark-1',
        ...bookmarkData,
        created_at: new Date('2024-01-15T10:30:00Z')
      };

      service.updateBookmark.mockResolvedValue(updatedBookmark);
      const controller = new BookmarksController(service);

      const response = await controller.updateBookmark('bookmark-1', bookmarkData);

      expect(response).toEqual({
        id: 'bookmark-1',
        title: 'Updated Bookmark',
        url: 'https://updated.com',
        tags: 'updated',
        created_at: new Date('2024-01-15T10:30:00Z')
      });
      expect(service.updateBookmark).toHaveBeenCalledWith('bookmark-1', bookmarkData);
    });
  });

  describe('list', () => {
    it('returns list of bookmarks', async () => {
      const service = mock<BookmarksService>();
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

      service.listBookmarks.mockResolvedValue(bookmarks);
      const controller = new BookmarksController(service);

      const response = await controller.listBookmarks();

      expect(response).toEqual(bookmarks);
      expect(service.listBookmarks).toHaveBeenCalledWith(undefined, undefined);
    });

    it('filters bookmarks by tag', async () => {
      const service = mock<BookmarksService>();
      const bookmarks: Bookmark[] = [
        {
          id: '1',
          title: 'Web Development',
          url: 'https://web.dev',
          tags: 'web,development',
          created_at: new Date('2024-01-15T10:30:00Z')
        }
      ];

      service.listBookmarks.mockResolvedValue(bookmarks);
      const controller = new BookmarksController(service);

      const response = await controller.listBookmarks('web');

      expect(response).toEqual(bookmarks);
      expect(service.listBookmarks).toHaveBeenCalledWith('web', undefined);
    });

    it('searches bookmarks by query', async () => {
      const service = mock<BookmarksService>();
      const bookmarks: Bookmark[] = [
        {
          id: '1',
          title: 'React Documentation',
          url: 'https://react.dev',
          tags: 'web,react',
          created_at: new Date('2024-01-15T10:30:00Z')
        }
      ];

      service.listBookmarks.mockResolvedValue(bookmarks);
      const controller = new BookmarksController(service);

      const response = await controller.listBookmarks(undefined, 'React');

      expect(response).toEqual(bookmarks);
      expect(service.listBookmarks).toHaveBeenCalledWith(undefined, 'React');
    });
  });

  describe('delete', () => {
    it('deletes a bookmark', async () => {
      const service = mock<BookmarksService>();
      service.deleteBookmark.mockResolvedValue(undefined);
      const controller = new BookmarksController(service);

      await controller.deleteBookmark('bookmark-1');

      expect(service.deleteBookmark).toHaveBeenCalledWith('bookmark-1');
    });
  });

  describe('deleteAll', () => {
    it('deletes all bookmarks', async () => {
      const service = mock<BookmarksService>();
      service.deleteAllBookmarks.mockResolvedValue(undefined);
      const controller = new BookmarksController(service);

      await controller.deleteAllBookmarks();

      expect(service.deleteAllBookmarks).toHaveBeenCalled();
    });
  });
});

