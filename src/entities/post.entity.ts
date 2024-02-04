import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';

import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';
import { Space } from './space.entity';
import { PostFile } from './post.file.entity';

@Entity('post')
export class Post extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'post_id',
        type: 'int'
    })
    postId!: number;

    @Column({
        name: 'user_id',
        type: 'int',
        nullable: false
    })
    userId!: number;

    @Column({
        name: 'space_id',
        type: 'int',
        nullable: false
    })
    spaceId!: number;


    @Column({
        name: 'post_name',
        type: 'varchar',
        length: 128,
        nullable: false
    })
    postName!: string;

    @Column({
        name: 'post_contents',
        type: 'varchar',
        length: 1024,
        nullable: false
    })
    postContents!: string;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Space, space => space.posts)
    @JoinColumn({ name: 'space_id' })
    space!: Space;

    @OneToMany(() => PostFile, (postFile) => postFile.post, {
        onDelete: 'CASCADE',
        cascade: true
    })
    postFiles!: PostFile[];

};