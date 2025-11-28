import { DataSource } from 'typeorm';
import { BookmarkEntity } from '@app/bookmarks/infrastructure/typeorm/bookmark.entity';

export class BookmarkStateDriver {
  private constructor(private readonly dataSource: DataSource) {}

  static create(dataSource: DataSource): BookmarkStateDriver {
    return new BookmarkStateDriver(dataSource);
  }

  async createBookmark(bookmark: {
    title: string;
    url: string;
    tags: string;
  }): Promise<BookmarkEntity> {
    const repo = this.dataSource.getRepository(BookmarkEntity);
    return repo.save(bookmark);
  }

  async createBookmarks(bookmarks: Array<{
    title: string;
    url: string;
    tags: string;
  }>): Promise<BookmarkEntity[]> {
    const repo = this.dataSource.getRepository(BookmarkEntity);
    return repo.save(bookmarks);
  }

  async clear(): Promise<void> {
    await this.dataSource.getRepository(BookmarkEntity).clear();
  }
}

