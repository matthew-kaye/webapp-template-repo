import { Bookmark } from './bookmark';

export const BOOKMARKS_REPOSITORY = Symbol('BOOKMARKS_REPOSITORY');

export interface BookmarksRepositoryPort {
  create(bookmark: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark>;
  list(tag?: string, query?: string): Promise<Bookmark[]>;
}

