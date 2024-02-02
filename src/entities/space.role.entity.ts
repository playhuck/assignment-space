import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Space } from './space.entity';
import { User } from './user.entity';
import { SpaceUserRole } from './space.user.role.entity';

@Entity('space_role')
export class SpaceRole {
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
        type: 'bigint',
        nullable: false
    })
    spaceUpdate!: number;

    @Column({
        name: 'space_delete',
        type: 'bigint',
        nullable: false
    })
    spaceDelete!: number;

    @Column({
        name: 'space_forced_exit',
        type: 'bigint',
        nullable: false
    })
    spaceForcedExit!: number;

    @Column({
        name: 'space_owner_assign',
        type: 'bigint',
        nullable: false
    })
    spaceOwnerAssign!: number;

    @Column({
        name: 'space_role_update',
        type: 'bigint',
        nullable: false
    })
    spaceRoleUpdate!: number;

    @Column({
        name: 'space_role_delete',
        type: 'bigint',
        nullable: false
    })
    spaceRoleDelete!: number;

    @Column({
        name: 'space_post_notice',
        type: 'bigint',
        nullable: false
    })
    spacePostNotice!: number;

    @Column({
        name: 'space_post_admin_delete',
        type: 'bigint',
        nullable: false
    })
    spacePostAdminDelete!: number;

    @Column({
        name: 'space_chat_admin_delete',
        type: 'bigint',
        nullable: false
    })
    spaceChatAdminDelete!: number;

    @ManyToOne(() => Space, space => space.spaceRoles)
    @JoinColumn({ name: 'space_id' })
    space!: Space;

    @ManyToOne(() => User, user => user.spaceRoles)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => SpaceUserRole, (spaceUserRole) => spaceUserRole.spaceRole)
    spaceUserRoles!: SpaceUserRole[];
}