
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('post_file')
export class PostFile extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'post_file_id',
        type: 'int'
    })
    postFileId!: number;

    @Column({
        name: 'post_id',
        type: 'int',
        nullable: false
    })
    postId!: number;

    @Column({
        name: 'post_name',
        type: 'varchar',
        length: 128,
        nullable: false
    })
    postFileName!: string;

    @ManyToOne(() => Post, post => post.postId)
    @JoinColumn({ name: 'post_id' })
    post!: Post;

};