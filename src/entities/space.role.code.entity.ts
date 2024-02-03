import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
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
        name: 'space_role_id',
        type: 'int',
        nullable: false
    })
    spaceRoleId!: number;

    @Column({
        name: 'space_id',
        type: 'int',
        nullable: false
    })
    spaceId!: number;

    @Column({
        name: 'space_role_code',
        type: 'varchar',
        length: 20,
        nullable: false
    })
    code!: string;

    @OneToOne(()=> SpaceRole, (role) => role.spaceCodes)
    @JoinColumn({ 
        name: 'space_role_id',
        referencedColumnName: 'spaceRoleId' 
    })
    spaceRole!: SpaceRole;

    @ManyToOne(()=> Space, (space) => space.spaceId)
    @JoinColumn({ 
        name: 'space_id',
        referencedColumnName: 'spaceId' 
    })
    space!: Space;
}