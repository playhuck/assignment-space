import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Space } from './space.entity';
import { SpaceUserRole } from './space.user.role.entity';
import { CustomBaseEntity } from './base.entity';

@Entity('space_role')
export class SpaceRole extends CustomBaseEntity {
    @PrimaryGeneratedColumn({
        name: 'space_role_id',
        type: 'int'
    })
    spaceRoleId!: number;

    @Column({
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
        name: 'role_name',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    roleName!: string;

    @Column({
        name: 'space_update',
        type: 'tinyint',
        nullable: false
    })
    spaceUpdate!: number;

    @Column({
        name: 'space_delete',
        type: 'tinyint',
        nullable: false
    })
    spaceDelete!: number;

    @Column({
        name: 'space_forced_exit',
        type: 'tinyint',
        nullable: false
    })
    spaceForcedExit!: number;

    @Column({
        name: 'space_owner_assign',
        type: 'tinyint',
        nullable: false
    })
    spaceOwnerAssign!: number;

    @Column({
        name: 'space_role_update',
        type: 'tinyint',
        nullable: false
    })
    spaceRoleUpdate!: number;

    @Column({
        name: 'space_role_delete',
        type: 'tinyint',
        nullable: false
    })
    spaceRoleDelete!: number;

    @Column({
        name: 'space_post_notice',
        type: 'tinyint',
        nullable: false
    })
    spacePostNotice!: number;

    @Column({
        name: 'space_post_admin_delete',
        type: 'tinyint',
        nullable: false
    })
    spacePostAdminDelete!: number;

    @Column({
        name: 'space_chat_admin_delete',
        type: 'tinyint',
        nullable: false
    })
    spaceChatAdminDelete!: number;

    @ManyToOne(() => Space, space => space.spaceId)
    @JoinColumn({ name: 'space_id' })
    space!: Space;

    @OneToMany(() => SpaceUserRole, (spaceUserRole) => spaceUserRole.spaceRole)
    spaceUserRoles!: SpaceUserRole[];
}