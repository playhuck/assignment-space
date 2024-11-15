import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';
import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';

@Entity('space_user_alarm_settings')
export class SpaceUserAlarmSettings extends CustomBaseEntity {
  @PrimaryGeneratedColumn({
    name: 'space_user_alarm_settings_id',
    type: 'int',
  })
  spaceUserAlarmSettingsId!: number;

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
    name: 'post_create',
    type: 'tinyint',
    default: 1,
  })
  postCreate!: number;

  @Column({
    name: 'post_update',
    type: 'tinyint',
    default: 1,
  })
  postUpdate!: number;

  @Column({
    name: 'comment_create',
    type: 'tinyint',
    default: 1,
  })
  commentCreate!: number;

  @ManyToOne(() => Space, (space) => space.spaceUserAlarmSettings)
  @JoinColumn({ name: 'space_id' })
  space!: Space;

  @ManyToOne(() => User, (user) => user.spaecUserAlarmSettings)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  
}