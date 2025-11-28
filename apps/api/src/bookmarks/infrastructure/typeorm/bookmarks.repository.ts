import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../domain/bookmark';
import { BOOKMARKS_REPOSITORY, BookmarksRepositoryPort } from '../../domain/bookmarks.repository.port';
import { BookmarkEntity } from './bookmark.entity';

@Injectable()
export class BookmarksRepository implements BookmarksRepositoryPort {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly repository: Repository<BookmarkEntity>
  ) {}

  async create(bookmark: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark> {
    const entity = this.repository.create({
      ...bookmark,
      created_at: new Date()
    });
    const saved = await this.repository.save(entity);
    return {
      id: saved.id,
      title: saved.title,
      url: saved.url,
      tags: saved.tags,
      created_at: saved.created_at
    };
  }
}

export const BookmarksRepositoryProvider = {
  provide: BOOKMARKS_REPOSITORY,
  useClass: BookmarksRepository
};

