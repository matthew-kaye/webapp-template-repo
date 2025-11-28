import { mock } from 'jest-mock-extended';
import { Bookmark } from '../domain/bookmark';
import { BookmarksRepositoryPort } from '../domain/bookmarks.repository.port';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
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

