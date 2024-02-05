import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    Index,
    OneToMany
} from 'typeorm';
import { Space } from './space.entity';
import { CustomBaseEntity } from './base.entity';
import { SpaceRole } from './space.role.entity';
import { SpaceUserRole } from './space.user.role.entity';
import { Post } from './post.entity';
import { Comment } from './post.comment.entity';
import { CommentReply } from './post.comment.reply.entity';
import { SpaceUserAlarmSettings } from './space.user.alarm.settings.entity';
import { SpaceUserAlarm } from './space.user.alarm.entity';

@Entity('user')
@Unique(['email'])
@Index('index_email')
export class User extends CustomBaseEntity {

    @PrimaryGeneratedColumn({
        name: 'user_id',
        type: 'int'
    })
    userId!: number;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 128
    })
    email!: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 128
    })
    password!: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 50
    })
    lastName!: string;

    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 50
    })
    firstName!: string;

    @Column({
        name: 'profile_image',
        type: 'varchar',
        length: 128
    })
    profileImage!: string;

    @Column({
        name: 'refresh_token',
        type: 'varchar',
        length: 255,
        nullable: true
    })
    refreshToken?: string | null;

    @OneToMany(() => Space, (space) => space.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaces!: Space[];

    @OneToMany(() => SpaceUserRole, (spaceUserRole) => spaceUserRole.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceUserRoles!: SpaceUserRole[];

    @OneToMany(() => Post, (post) => post.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    posts!: Post[];

    @OneToMany(() => Comment, (comment) => comment.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    postComments!: Comment[];

    @OneToMany(() => CommentReply, (commentReply) => commentReply.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    postCommentReplys!: CommentReply[];

    @OneToMany(() => SpaceUserAlarmSettings, (alarmSettings) => alarmSettings.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaecUserAlarmSettings!: SpaceUserAlarmSettings[];

    @OneToMany(() => SpaceUserAlarm, (alarm) => alarm.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaecUserAlarms!: SpaceUserAlarm[];

}