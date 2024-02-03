import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SpaceRole } from './space.role.entity';
import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';
import { Space } from './space.entity';

@Entity('space_user_role')
export class SpaceUserRole extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'space_user_role_id',
        type: 'int',
    })
    spaceUserRoleId!: number;

    @Column({
        name: 'user_id',
        type: 'int'
    })
    userId!: number;

    @Column({
        name: 'space_id',
        type: 'int'
    })
    spaceId!: number;

    @Column({
        name: 'space_role_id',
        type: 'int'
    })
    spaceRoleId!: number;

    @ManyToOne(() => Space, space => space.spaceId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'space_id' })
    space!: Space;

    @ManyToOne(() => SpaceRole, role => role.spaceRoleId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'space_role_id' })
    spaceRole!: SpaceRole;

    @ManyToOne(() => User, (user) => user.spaceUserRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}