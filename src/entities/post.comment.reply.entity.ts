import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Comment } from './post.comment.entity';

@Entity('post_comment_reply')
export class CommentReply extends CustomBaseEntity {

    @PrimaryGeneratedColumn({
        name: 'post_comment_reply_id',
        type: 'int'
    })
    replyId!: number;

    @Column({
        name: 'comment_id',
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
        name: 'post_comment_reply',
        type: 'varchar',
        length: 255,
        nullable: false
    })
    commentReply!: string;

    @Column({
        name: 'is_anonymous',
        type: 'tinyint'
    })
    isAnonymous!: number;

    @Column({
        name: 'updated_at',
        type: 'varchar',
        length: 255
    })
    updatedAt?: string;

    @ManyToOne(() => User, user => user.postCommentReplys)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Comment, comment => comment.commentReplys)
    @JoinColumn({ name: 'comment_id' })
    comment!: Comment;

};