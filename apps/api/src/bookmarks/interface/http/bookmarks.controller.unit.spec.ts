import { mock } from 'jest-mock-extended';
import { BookmarksService } from '../../application/bookmarks.service';
import { BookmarksController } from './bookmarks.controller';

describe('BookmarksController', () => {
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

