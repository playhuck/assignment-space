import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CustomBaseEntity } from './base.entity';
import { SpaceRole } from './space.role.entity';

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

    @ManyToOne(() => User, user => user.userId)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => SpaceRole, role => role.space)
    spaceRoles!: SpaceRole[];
}