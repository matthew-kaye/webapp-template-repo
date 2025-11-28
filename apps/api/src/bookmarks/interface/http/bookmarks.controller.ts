import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookmarksService } from '../../application/bookmarks.service';
import { Bookmark } from '../../domain/bookmark';

type CreateBookmarkRequest = Omit<Bookmark, 'id' | 'created_at'>;
type CreateBookmarkResponse = Pick<Bookmark, 'id' | 'title' | 'url' | 'tags' | 'created_at'>;

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('create')
  async createBookmark(@Body() body: CreateBookmarkRequest): Promise<CreateBookmarkResponse> {
    const bookmark = await this.bookmarksService.createBookmark(body);
    return {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags,
      created_at: bookmark.created_at
    };
  }

  @Get()
  async listBookmarks(
    @Query('tag') tag?: string,
    @Query('q') query?: string
  ): Promise<Bookmark[]> {
    return this.bookmarksService.listBookmarks(tag, query);
  }

  @Delete(':id')
  async deleteBookmark(@Param('id') id: string): Promise<void> {
    return this.bookmarksService.deleteBookmark(id);
  }

  @Delete()
  async deleteAllBookmarks(): Promise<void> {
    return this.bookmarksService.deleteAllBookmarks();
  }
}

