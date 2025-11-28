import { Inject, Injectable } from '@nestjs/common';
import { Bookmark } from '../domain/bookmark';
import { BOOKMARKS_REPOSITORY, BookmarksRepositoryPort } from '../domain/bookmarks.repository.port';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(BOOKMARKS_REPOSITORY)
    private readonly bookmarksRepository: BookmarksRepositoryPort
  ) {}

  async createBookmark(bookmark: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark> {
    return this.bookmarksRepository.create(bookmark);
  }
}

