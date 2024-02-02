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
        length: 128,
        default: 'default_image.jpg'
    })
    profileImage!: string;

    @Column({
        name: 'refresh_token',
        type: 'varchar',
        length: 255,
        nullable: true
    })
    refreshToken?: string | null;

    @OneToMany(() => Space, (space) => space.user)
    spaces!: Space[];

    @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.user)
    spaceRoles!: SpaceRole[];

    @OneToMany(() => SpaceUserRole, (spaceUserRole) => spaceUserRole.user)
    spaceUserRoles!: SpaceUserRole[];
}