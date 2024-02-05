import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';
import { SpaceRole } from './space.role.entity';
import { SpaceUserRole } from './space.user.role.entity';
import { SpaceRoleCode } from './space.role.code.entity';
import { Post } from './post.entity';
import { SpaceUserAlarmSettings } from './space.user.alarm.settings.entity';
import { SpaceUserAlarm } from './space.user.alarm.entity';

@Entity('space')
export class Space extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'space_id',
        type: 'int'
    })
    spaceId!: number;

    @Column({
        name: 'user_id',
        type: 'int'
    })
    userId!: number;

    @Column({
        name: 'space_name',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    spaceName!: string;

    @Column({
        name: 'space_logo',
        type: 'varchar',
        length: 128,
        nullable: false
    })
    spaceLogo!: string;

    @ManyToOne(() => User, user => user.spaces)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => SpaceRole, role => role.space, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceRoles!: SpaceRole[];

    @OneToMany(() => SpaceUserRole, userRole => userRole.space, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceUserRoles!: SpaceUserRole[];

    @OneToMany(() => SpaceRoleCode, roleCode => roleCode.space, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceRoleCodes!: SpaceRoleCode[];

    @OneToMany(() => Post, (post) => post.user, {
        onDelete: 'CASCADE',
        cascade: true
    })
    posts!: Post[];

    @OneToMany(() => SpaceUserAlarm, (alarm) => alarm.space, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceUserAlarms!: SpaceUserAlarm[];

    @OneToMany(() => SpaceUserAlarmSettings, (alarmSettings) => alarmSettings.space, {
        onDelete: 'CASCADE',
        cascade: true
    })
    spaceUserAlarmSettings!: SpaceUserAlarmSettings[];

}