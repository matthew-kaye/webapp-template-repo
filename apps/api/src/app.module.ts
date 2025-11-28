import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm.config';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UsersModule,
    BookmarksModule
  ],
  providers: [TypeOrmConfigService]
})
export class AppModule {}
