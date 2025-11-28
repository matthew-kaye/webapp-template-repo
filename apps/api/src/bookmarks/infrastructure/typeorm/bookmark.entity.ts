import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmarks')
export class BookmarkEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column()
  tags!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}

