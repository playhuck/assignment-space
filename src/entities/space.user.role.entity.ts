import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SpaceRole } from './space.role.entity';
import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';

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

    @ManyToOne(() => SpaceRole, spaceRole => spaceRole.spaceRoleId)
    @JoinColumn({ name: 'space_role_id' })
    spaceRole!: SpaceRole;

    @ManyToOne(() => User, user => user.userId)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}