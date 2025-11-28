import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './application/bookmarks.service';
import { BookmarkEntity } from './infrastructure/typeorm/bookmark.entity';
import { BookmarksRepositoryProvider } from './infrastructure/typeorm/bookmarks.repository';
import { BookmarksController } from './interface/http/bookmarks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity])],
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksRepositoryProvider]
})
export class BookmarksModule {}

