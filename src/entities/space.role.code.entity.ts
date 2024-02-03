import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';
import { SpaceRole } from './space.role.entity';
import { CustomBaseEntity } from './base.entity';

@Entity('space_role_code')
export class SpaceRoleCode extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'space_role_code_id',
        type: 'int'
    })
    spaceRoleCodeId!: number;

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
}