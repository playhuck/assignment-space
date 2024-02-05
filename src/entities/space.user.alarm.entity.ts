import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { CustomBaseEntity } from './base.entity';

@Entity('space_user_alarm')
export class SpaceUserAlarm extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'space_user_alarm_id',
        type: 'int',
    })
    spaceUserAlarmId!: number;

    @Column({
        name: 'space_id',
        type: 'int',
    })
    spaceId!: number;

    @Column({
        name: 'user_id',
        type: 'int',
    })
    userId!: number;

    @Column({
        name: 'post_id',
        type: 'int',
    })
    postId!: number;

    @Column({
        name: 'post_create',
        type: 'tinyint',
        default: 0,
    })
    postCreate!: number;

    @Column({
        name: 'post_update',
        type: 'tinyint',
        default: 0,
    })
    postUpdate!: number;

    @Column({
        name: 'comment_create',
        type: 'tinyint',
        default: 0,
    })
    commentCreate!: number;

    @ManyToOne(() => Space, (space) => space.spaceUserAlarms)
    @JoinColumn({ name: 'space_id' })
    space!: Space;

    @ManyToOne(() => Post, (post) => post.spaceUserAlarms)
    @JoinColumn({ name: 'post_id' })
    post!: Post;

    @ManyToOne(() => User, (user) => user.spaecUserAlarms)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}