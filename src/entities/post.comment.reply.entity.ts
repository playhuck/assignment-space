import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { PostComment } from './post.comment.entity';

@Entity('post_comment_reply')
export class PostCommentReply extends CustomBaseEntity {

    @PrimaryGeneratedColumn({
        name: 'post_comment_reply_id',
        type: 'int'
    })
    commentReplyId!: number;

    @Column({
        name: 'post_comment_id',
        type: 'int'
    })
    commentId!: number;

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
    postCommentReply!: number;

    @Column({
        name: 'updated_at',
        type: 'varchar',
        length: 255
    })
    updatedAt?: string;

    @ManyToOne(() => User, user => user.postCommentReplys)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => PostComment, comment => comment.postCommentReplys)
    @JoinColumn({ name: 'post_comment_id' })
    comment!: PostComment;

};