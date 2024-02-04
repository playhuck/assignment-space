import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('post_comment')
export class PostComment extends CustomBaseEntity {

    @PrimaryGeneratedColumn({
        name: 'post_comment_id',
        type: 'int'
    })
    commentId!: number;

    @Column({
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
        name: 'post_comment',
        type: 'int',
        nullable: false
    })
    postComment!: number;

    @Column({
        name: 'updated_at',
        type: 'varchar',
        length: 255 
    })
    updatedAt?: string;

    @ManyToOne(() => User, user => user.postComments)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Post, (post) => post.postComments)
    @JoinColumn({ name: 'post_id' })
    post!: Post;

};